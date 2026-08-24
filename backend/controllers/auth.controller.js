import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";

// JWT authentication cookie configuration
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", // HTTPS only in production
  sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", // Allow cross-site in production
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

// Register Student
export const registerStudent = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({
        success: false,
        message: "User already registered with this email",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in DB
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "student",
    });

    return res.status(201).json({
      success: true,
      message: "Student registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
// Login Student + Admin
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Admin login from .env
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      // Generate JWT token for Admin
      const token = generateToken({
        email: process.env.ADMIN_EMAIL,
        role: "admin",
      });

      // Save JWT token in HTTP-only cookie
      res.cookie("token", token, cookieOptions);

      return res.status(200).json({
        success: true,
        message: "Admin logged in successfully",
        token: token, // Add token in response for cross-domain
        user: {
          email: process.env.ADMIN_EMAIL,
          role: "admin",
        },
      });
    }

    // Student login from database
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate JWT token
    const token = generateToken({
      id: user._id,
      role: user.role,
    });

    // Save JWT token in HTTP-only cookie
    res.cookie("token", token, cookieOptions);

    // Login success response
    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      token: token, // Add token in response for cross-domain
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.log("Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Logout User
export const logoutUser = async (req, res) => {
  try {
    res.clearCookie("token", cookieOptions);

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get My Profile
export const getMyProfile = async (req, res) => {
  try {
    const { id, role, email } = req.user;

    // If user is admin, return admin profile from .env
    if (role === "admin") {
      return res.status(200).json({
        success: true,
        message: "Profile fetched successfully",
        user: {
          email: process.env.ADMIN_EMAIL,
          role: "admin",
        },
      });
    }

    // If user is student, find from database
    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      user,
    });
  } catch (error) {
    console.log("Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Forgot Password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    console.log("=== FORGOT PASSWORD DEBUG ===");
    console.log("Received email:", email);

    // Check email
    if (!email) {
      console.log("❌ Email missing");
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      console.log("❌ User not found for email:", email);
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    console.log("✅ User found:", user.email);

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    console.log("✅ Reset token generated");

    // Hash reset token
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Save reset token and expiry
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    await user.save();
    console.log("✅ Reset token saved to database");

    // Create reset password URL
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    console.log("✅ Reset URL:", resetUrl);

    // HTML email template
    const htmlTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
        <style>
            body { font-family: 'Roboto', sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #4f46e5; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: #4f46e5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; font-family: 'Roboto', sans-serif; font-weight: 500; }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
            h2, h3 { font-family: 'Roboto', sans-serif; font-weight: 500; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h2>🔒 Password Reset Request</h2>
            </div>
            <div class="content">
                <h3>Hello!</h3>
                <p>You requested to reset your password for your Library Management System account.</p>
                
                <p>Click the button below to reset your password:</p>
                
                <a href="${resetUrl}" class="button">Reset Password</a>
                
                <p><strong>⏰ This link will expire in 15 minutes.</strong></p>
                
                <p>If the button doesn't work, copy and paste this link in your browser:</p>
                <p style="word-break: break-all; background: #e9ecef; padding: 10px; border-radius: 4px;">${resetUrl}</p>
                
                <p>If you did not request a password reset, please ignore this email.</p>
                
                <p>Best regards,<br>Library Management System Team</p>
            </div>
            <div class="footer">
                <p>© 2024 Library Management System. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>`;

    console.log("🚀 Attempting to send HTML email...");

    // Send HTML email
    await sendEmail({
      email: user.email,
      subject: "Reset Your Library Management Password",
      html: htmlTemplate
    });

    console.log("✅ Email sent successfully!");

    return res.status(200).json({
      success: true,
      message: "Password reset link sent successfully",
    });
  } catch (error) {
    console.log("❌ Forgot Password Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Reset Password
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Check password
    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is required",
      });
    }

    // Hash reset token
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find user with valid reset token
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password
    user.password = hashedPassword;

    // Clear reset token
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.log("Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
