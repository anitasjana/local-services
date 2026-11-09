const express = require("express");
const router = express.Router();

const {
  createBooking,
  getMyBookings,
  updateBookingStatus
} = require("../controllers/bookingController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

router.post(
  "/",
  protect,
  authorizeRoles("customer"),
  createBooking
);

router.get(
  "/",
  protect,
  authorizeRoles("customer", "provider"),
  getMyBookings
);

router.patch(
  "/:id/status",
  protect,
  authorizeRoles("provider"),
  updateBookingStatus
);

module.exports = router;