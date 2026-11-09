const Service = require("../models/Service");

// Get all active services
const getServices = async (req, res) => {
  try {
    const services = await Service.find({ isActive: true })
      .sort({ name: 1 });

    res.status(200).json({
      count: services.length,
      services
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch services"
    });
  }
};

// Create new service
const createService = async (req, res) => {
  try {
    const { name, description, icon } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Service name is required"
      });
    }

    const slug = name.trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const service = await Service.create({
      name: name.trim(),
      slug,
      description,
      icon
    });

    res.status(201).json({
      message: "Service created successfully",
      service
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Service already exists"
      });
    }

    console.error(error);

    res.status(500).json({
      message: "Failed to create service"
    });
  }
};

module.exports = {
  getServices,
  createService
};