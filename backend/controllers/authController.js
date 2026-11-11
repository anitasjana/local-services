
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const ProviderProfile = require("../models/ProviderProfile");

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// REGISTER USER
const registerUser = async (req, res) => {
  try {
    const { name, phone, password, role } = req.body;

    if (!name || !req.body.email || !phone || !password) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const normalizedEmail = req.body.email.trim().toLowerCase();

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters"
      });
    }

    const existingUser = await User.findOne({
      email: normalizedEmail
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Email already registered"
      });
    }

    if (role && !["customer", "provider"].includes(role)) {
      return res.status(400).json({
        message: "Invalid role"
      });
    }

    const user = await User.create({
      name,
      email: normalizedEmail,
      phone,
      password,
      role: role || "customer"
    });

    const token = generateToken(user._id);

    return res.status(201).json({
      message: "Registration successful",
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
    console.error("Registration Error:", error);

    return res.status(500).json({
      message: "Server error during registration"
    });
  }
};

// LOGIN USER
const loginUser = async (req, res) => {
  try {
    console.log("LOGIN STARTED");

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    console.log("EMAIL RECEIVED:", normalizedEmail);

    // Find user and include password
    const user = await User.findOne({
      email: normalizedEmail
    }).select("+password");

    console.log("USER FOUND:", !!user);
    console.log("USER ROLE:", user?.role);

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    // Compare entered password with hashed password
    const isMatch = await user.comparePassword(password);

    console.log("PASSWORD MATCH:", isMatch);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    // Provider approval check
    if (user.role === "provider") {
      console.log("CHECKING PROVIDER PROFILE");

      const profile = await ProviderProfile.findOne({
        user: user._id
      });

      console.log("PROFILE FOUND:", !!profile);

      if (!profile) {
        return res.status(403).json({
          message: "Please complete your provider application first.",
          approvalStatus: "not_submitted"
        });
      }

      console.log("APPROVAL STATUS:", profile.approvalStatus);

      if (profile.approvalStatus === "pending") {
        return res.status(403).json({
          message: "Your provider application is awaiting admin approval.",
          approvalStatus: "pending"
        });
      }

      if (profile.approvalStatus === "rejected") {
        return res.status(403).json({
          message: "Your provider application was rejected.",
          approvalStatus: "rejected",
          rejectionReason: profile.rejectionReason
        });
      }
    }

    // Generate token after successful login
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
      }
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return res.status(500).json({
      message: "Server error during login"
    });
  }
};

module.exports = {
  registerUser,
  loginUser
};
