const Payment = require("../models/Payment");
const Booking = require("../models/Booking");

// CREATE PAYMENT
const createPayment = async (req, res) => {
  try {
    const { bookingId } = req.body;

    // Find booking
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    // Check booking owner
    if (booking.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not allowed to pay for this booking",
      });
    }

    // Check existing payment
    const existingPayment = await Payment.findOne({
      booking: bookingId,
    });

    if (existingPayment) {
      return res.status(400).json({
        message: "Payment already exists for this booking",
      });
    }

    // Create payment
    const payment = await Payment.create({
      booking: booking._id,
      customer: booking.customer,
      amount: booking.price,
      commission: 0,
      providerAmount: booking.price,
      paymentMethod: booking.paymentMethod,
    });

    res.status(201).json({
      message: "Payment created successfully",
      payment,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET MY PAYMENTS
const getMyPayments = async (req, res) => {
  try {
    const payments = await Payment.find({
      customer: req.user._id,
    }).populate("booking");

    res.status(200).json({
      payments,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createPayment,
  getMyPayments,
};