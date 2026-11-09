require("dotenv").config();

const mongoose = require("mongoose");
const connectDB = require("../config/db");
const User = require("../models/User");

const createAdmin = async () => {
  try {
    const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PHONE, ADMIN_PASSWORD } =
      process.env;

    if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PHONE || !ADMIN_PASSWORD) {
      throw new Error("Admin environment variables are missing");
    }

    await connectDB();

    const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });

    if (existingAdmin) {
    existingAdmin.name = ADMIN_NAME;
    existingAdmin.phone = ADMIN_PHONE;
    existingAdmin.password = ADMIN_PASSWORD;
    existingAdmin.role = "admin";

    await existingAdmin.save();

    console.log("Admin password updated successfully");
    return;
    }

    const admin = await User.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      phone: ADMIN_PHONE,
      password: ADMIN_PASSWORD,
      role: "admin"
    });

    console.log("Admin created successfully:", admin.email);

  } catch (error) {
    console.error("Admin creation failed:", error.message);
  } finally {
    await mongoose.connection.close();
  }
};

createAdmin();