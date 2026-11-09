const mongoose = require("mongoose");

const ProviderProfile = require("../models/ProviderProfile");
const Service = require("../models/Service");

// Create provider profile
const createProviderProfile = async (req, res) => {
  try {
    const { service, experience, location, price, bio } = req.body;

    if (!service || experience === undefined ||
        !location || price === undefined) {
      return res.status(400).json({
        message: "Please provide all required fields"
      });
    }

    const serviceExists = await Service.findOne({
      _id: service,
      isActive: true
    });

    if (!serviceExists) {
      return res.status(404).json({
        message: "Service not found"
      });
    }

    const existingProfile = await ProviderProfile.findOne({
      user: req.user._id
    });

    if (existingProfile) {
      return res.status(409).json({
        message: "Provider profile already exists"
      });
    }

    const profile = await ProviderProfile.create({
      user: req.user._id,
      service,
      experience,
      location,
      price,
      bio
    });

    const result = await profile.populate([
      { path: "user", select: "name" },
      { path: "service", select: "name slug" }
    ]);

    res.status(201).json({
      message: "Provider profile created successfully",
      profile: result
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create provider profile"
    });
  }
};

// Get all providers with optional filters
const getProviders = async (req, res) => {
  try {
    const { service, location } = req.query;

    const filter = {};

    if (service) {
      let serviceDoc;

      if (mongoose.Types.ObjectId.isValid(service)) {
        serviceDoc = await Service.findOne({
          _id: service,
          isActive: true
        });
      } else {
        serviceDoc = await Service.findOne({
          slug: service.toLowerCase(),
          isActive: true
        });
      }

      if (!serviceDoc) {
        return res.status(200).json({
          count: 0,
          providers: []
        });
      }

      filter.service = serviceDoc._id;
    }

    if (location) {
      filter.location = {
        $regex: location,
        $options: "i"
      };
    }

    const providers = await ProviderProfile.find(filter)
      .populate("user", "name")
      .populate("service", "name slug")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: providers.length,
      providers
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch providers"
    });
  }
};

// Get single provider details
const getProviderById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid provider ID"
      });
    }

    const provider = await ProviderProfile.findById(id)
      .populate("user", "name")
      .populate("service", "name slug");

    if (!provider) {
      return res.status(404).json({
        message: "Provider not found"
      });
    }

    res.status(200).json({
      provider
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch provider"
    });
  }
};

module.exports = {
  createProviderProfile,
  getProviders,
  getProviderById
};