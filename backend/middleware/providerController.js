
const getPendingProviders = async (req, res) => {
  try {
    const providers = await ProviderProfile.find({
      approvalStatus: "pending",
    })
      .populate("user", "name email phone")
      .populate("service", "name slug")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: providers.length,
      providers,
    });
  } catch (error) {
    console.error("Pending Providers Error:", error);
    res.status(500).json({
      message: "Failed to fetch pending providers",
    });
  }
};

const updateProviderApproval = async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;
    const { id } = req.params;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({
        message: "Status must be approved or rejected",
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

    if (
      status === "rejected" &&
      (!rejectionReason || !rejectionReason.trim())
    ) {
      return res.status(400).json({
        message: "Please provide a rejection reason",
      });
    }

    provider.approvalStatus = status;
    provider.rejectionReason =
      status === "rejected" ? rejectionReason.trim() : "";

    await provider.save();

    res.status(200).json({
      message: `Provider ${status} successfully`,
      provider,
    });
  } catch (error) {
    console.error("Provider Approval Error:", error);
    res.status(500).json({
      message: "Failed to update provider approval",
    });
  }
};
module.exports = {
  createProviderProfile,
  getProviders,
  getProviderById,
  getPendingProviders,
  updateProviderApproval,
};