
const mongoose = require("mongoose");

const ProviderProfile = require("../models/ProviderProfile");
const Service = require("../models/Service");
const User = require("../models/User");

// 1. Create provider profile
const createProviderProfile = async (req, res) => {
  try {
    const { service, experience, location, price, bio } = req.body;

    if (
      !service ||
      experience === undefined ||
      !location ||
      price === undefined
    ) {
      return res.status(400).json({
        message: "Please provide all required fields",
      });
    }

    const serviceExists = await Service.findOne({
      _id: service,
      isActive: true,
    });

    if (!serviceExists) {
      return res.status(404).json({
        message: "Service not found",
      });
    }

    const existingProfile = await ProviderProfile.findOne({
      user: req.user._id,
    });

    if (existingProfile) {
      return res.status(409).json({
        message: "Provider profile already exists",
      });
    }

    const profile = await ProviderProfile.create({
      user: req.user._id,
      service,
      experience,
      location,
      price,
      bio,
      approvalStatus: "pending",
    });

    const result = await profile.populate([
      { path: "user", select: "name" },
      { path: "service", select: "name slug" },
    ]);

    return res.status(201).json({
      message: "Provider profile created successfully",
      profile: result,
    });
  } catch (error) {
    console.error("Create Provider Profile Error:", error);

    return res.status(500).json({
      message: "Failed to create provider profile",
    });
  }
};

// 2. Get all approved providers with optional filters
const getProviders = async (req, res) => {
  try {
    const { service, location } = req.query;

    const filter = {
      approvalStatus: "approved",
    };

    if (service) {
      let serviceDoc;

      if (mongoose.Types.ObjectId.isValid(service)) {
        serviceDoc = await Service.findOne({
          _id: service,
          isActive: true,
        });
      } else {
        serviceDoc = await Service.findOne({
          slug: service.toLowerCase(),
          isActive: true,
        });
      }

      if (!serviceDoc) {
        return res.status(200).json({
          count: 0,
          providers: [],
        });
      }

      filter.service = serviceDoc._id;
    }

    if (location) {
      filter.location = {
        $regex: location,
        $options: "i",
      };
    }

    const providers = await ProviderProfile.find(filter)
      .populate("user", "name")
      .populate("service", "name slug")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      count: providers.length,
      providers,
    });
  } catch (error) {
    console.error("Get Providers Error:", error);

    return res.status(500).json({
      message: "Failed to fetch providers",
    });
  }
};

// 3. Get single approved provider details
const getProviderById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid provider ID",
      });
    }

    const provider = await ProviderProfile.findOne({
      _id: id,
      approvalStatus: "approved",
    })
      .populate("user", "name")
      .populate("service", "name slug");

    if (!provider) {
      return res.status(404).json({
        message: "Provider not found",
      });
    }

    return res.status(200).json({
      provider,
    });
  } catch (error) {
    console.error("Get Provider Error:", error);

    return res.status(500).json({
      message: "Failed to fetch provider",
    });
  }
};

// Admin: Dashboard statistics
const getAdminStats = async (req, res) => {
  try {
    const [
      totalCustomers,
      totalProviders,
      totalProviderProfiles,
      pendingProviders,
      approvedProviders,
      rejectedProviders,
    ] = await Promise.all([
      User.countDocuments({ role: "customer" }),
      User.countDocuments({ role: "provider" }),
      ProviderProfile.countDocuments(),
      ProviderProfile.countDocuments({ approvalStatus: "pending" }),
      ProviderProfile.countDocuments({ approvalStatus: "approved" }),
      ProviderProfile.countDocuments({ approvalStatus: "rejected" }),
    ]);

    return res.status(200).json({
      stats: {
        totalCustomers,
        totalProviders,
        totalProviderProfiles,
        pendingProviders,
        approvedProviders,
        rejectedProviders,
      },
    });
  } catch (error) {
    console.error("Admin Stats Error:", error);

    return res.status(500).json({
      message: "Failed to fetch admin statistics",
    });
  }
};

// 4. Admin: Get all pending provider applications
const getPendingProviders = async (req, res) => {
  try {
    const providers = await ProviderProfile.find({
      approvalStatus: "pending",
    })
      .populate("user", "name email phone")
      .populate("service", "name slug")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      count: providers.length,
      providers,
    });
  } catch (error) {
    console.error("Pending Providers Error:", error);

    return res.status(500).json({
      message: "Failed to fetch pending providers",
    });
  }
};

// 5. Admin: Approve or reject provider application
const updateProviderApproval = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, rejectionReason } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({
        message: "Invalid approval status",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid provider ID",
      });
    }

    const provider = await ProviderProfile.findById(id);

    if (!provider) {
      return res.status(404).json({
        message: "Provider application not found",
      });
    }

    if (provider.approvalStatus !== "pending") {
      return res.status(400).json({
        message: "This application has already been reviewed",
      });
    }

    if (status === "rejected" && !rejectionReason?.trim()) {
      return res.status(400).json({
        message: "Rejection reason is required",
      });
    }

    provider.approvalStatus = status;
    provider.rejectionReason =
      status === "rejected" ? rejectionReason.trim() : "";

    await provider.save();

    const result = await provider.populate([
      { path: "user", select: "name email phone" },
      { path: "service", select: "name slug" },
    ]);

    return res.status(200).json({
      message: `Provider application ${status} successfully`,
      provider: result,
    });
  } catch (error) {
    console.error("Provider Approval Error:", error);

    return res.status(500).json({
      message: "Failed to update provider approval",
    });
  }
};

// Export all controller functions
module.exports = {
  createProviderProfile,
  getProviders,
  getProviderById,
  getPendingProviders,
  updateProviderApproval,
  getAdminStats,
};
