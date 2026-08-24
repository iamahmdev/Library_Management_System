import jwt from "jsonwebtoken";

// Check User Authentication
export const isAuthenticated = async (req, res, next) => {
  try {
    // Try cookie first, then Authorization header
    let token = req.cookies.token;
    
    // If no cookie token, check Authorization header
    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7); // Remove 'Bearer ' prefix
      }
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    req.user = decoded;

    next();
  } catch (error) {
    console.log("Error:", error);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

// Check Admin Authentication
export const isAdmin = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }

    next();
  } catch (error) {
    console.log("Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Check User Authentication
export const isUser = async (req, res, next) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({
        success: false,
        message: "User access required",
      });
    }

    next();
  } catch (error) {
    console.log("Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
