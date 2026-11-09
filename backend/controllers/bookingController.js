const Booking = require("../models/Booking");
const ProviderProfile = require("../models/ProviderProfile");
const mongoose = require("mongoose");

// Create Booking
const createBooking = async (req, res) => {
  try {
    const {
      provider,
      scheduledDate,
      address,
      description,
      paymentMethod
    } = req.body;

    if (!provider || !scheduledDate || !address) {
      return res.status(400).json({
        message: "Please provide all required fields"
      });
    }

    if (!mongoose.Types.ObjectId.isValid(provider)) {
      return res.status(400).json({
        message: "Invalid provider ID"
      });
    }

    const providerProfile = await ProviderProfile.findOne({
      _id: provider,
      isAvailable: true
    });

    if (!providerProfile) {
      return res.status(404).json({
        message: "Provider not found or unavailable"
      });
    }

    const booking = await Booking.create({
      customer: req.user._id,
      provider: providerProfile._id,
      service: providerProfile.service,
      scheduledDate,
      address,
      description,
      price: providerProfile.price,
      paymentMethod: paymentMethod || "cash"
    });

    const result = await booking.populate([
      { path: "customer", select: "name email" },
      { path: "provider", populate: { path: "user", select: "name" } },
      { path: "service", select: "name slug" }
    ]);

    res.status(201).json({
      message: "Booking created successfully",
      booking: result
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to create booking"
    });
  }
};


// Get My Bookings
const getMyBookings = async (req, res) => {
  try {
    let filter = {};

    if (req.user.role === "customer") {
      filter.customer = req.user._id;
    } else if (req.user.role === "provider") {
      const profile = await ProviderProfile.findOne({
        user: req.user._id
      });

      if (!profile) {
        return res.status(404).json({
          message: "Provider profile not found"
        });
      }

      filter.provider = profile._id;
    }

    const bookings = await Booking.find(filter)
      .populate("customer", "name email")
      .populate({
        path: "provider",
        populate: { path: "user", select: "name" }
      })
      .populate("service", "name slug")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: bookings.length,
      bookings
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch bookings"
    });
  }
};


// Update Booking Status
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["accepted", "rejected", "completed"].includes(status)) {
      return res.status(400).json({
        message: "Invalid booking status"
      });
    }

    const profile = await ProviderProfile.findOne({
      user: req.user._id
    });

    if (!profile) {
      return res.status(404).json({
        message: "Provider profile not found"
      });
    }

    const booking = await Booking.findOne({
      _id: req.params.id,
      provider: profile._id
    });

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found"
      });
    }

    if (
      (status === "accepted" || status === "rejected") &&
      booking.status !== "pending"
    ) {
      return res.status(400).json({
        message: "Only pending bookings can be accepted or rejected"
      });
    }

    if (status === "completed" && booking.status !== "accepted") {
      return res.status(400).json({
        message: "Only accepted bookings can be completed"
      });
    }

    booking.status = status;
    await booking.save();

    res.status(200).json({
      message: "Booking status updated successfully",
      booking
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to update booking status"
    });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  updateBookingStatus
};