import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";

// JWT authentication cookie configuration
const cookieOptions = {
  httpOnly: true,
  secure: false,
  sameSite: "strict",
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

    // Check email
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Hash reset token
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Save reset token and expiry
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    await user.save();

    // Create reset password URL
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // Send reset password email
    await sendEmail({
      email: user.email,
      subject: "Reset Your Library Management Password",
      message: `Hello,

You requested to reset your password for your Library Management System account.

Click the link below to reset your password:

${resetUrl}

This link will expire in 15 minutes.

If you did not request a password reset, please ignore this email.

Regards,
Library Management System`,
    });

    return res.status(200).json({
      success: true,
      message: "Password reset link sent successfully",
    });
  } catch (error) {
    console.log("Error:", error);

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
