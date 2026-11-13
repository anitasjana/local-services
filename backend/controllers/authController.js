
const User = require("../models/User");
const ProviderProfile = require("../models/ProviderProfile");
const jwt = require("jsonwebtoken");

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// ================= REGISTER USER =================

const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required"
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check existing account
    const existingUser = await User.findOne({
      email: normalizedEmail
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Email already registered"
      });
    }

    // Only customer and provider can register publicly
    const userRole = role || "customer";

    if (!["customer", "provider"].includes(userRole)) {
      return res.status(400).json({
        message: "Invalid user role"
      });
    }

    // Create user
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      phone,
      password,
      role: userRole
    });

    const token = generateToken(user._id);

    return res.status(201).json({
      message: "Account created successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });

  } catch (error) {
    console.error("REGISTER ERROR:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        message: "Email already registered"
      });
    }

    return res.status(500).json({
      message: "Server error during registration"
    });
  }
};


// ================= LOGIN USER =================

const loginUser = async (req, res) => {
  try {
    let providerStatus = null;

    console.log("LOGIN STARTED");

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    // Check provider application status
    if (user.role === "provider") {
      const profile = await ProviderProfile.findOne({
        user: user._id
      });

      if (!profile) {
        providerStatus = "not_submitted";
      } else {
        providerStatus = profile.approvalStatus;

        if (providerStatus === "pending") {
          return res.status(403).json({
            message: "Your provider application is awaiting admin approval.",
            approvalStatus: "pending"
          });
        }

        if (providerStatus === "rejected") {
          return res.status(403).json({
            message: "Your provider application was rejected.",
            approvalStatus: "rejected",
            rejectionReason: profile.rejectionReason
          });
        }
      }
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      },
      providerStatus
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return res.status(500).json({
      message: "Server error during login"
    });
  }
};


// ================= EXPORT =================

module.exports = {
  registerUser,
  loginUser
};
