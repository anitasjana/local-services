
const express = require("express");
const router = express.Router();

const {
  createProviderProfile,
  getProviders,
  getProviderById,
  getPendingProviders,
  updateProviderApproval,
  getAdminStats,
} = require("../controllers/providerController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

// Admin verification routes
router.get(
  "/admin/pending",
  protect,
  authorizeRoles("admin"),
  getPendingProviders
);

router.patch(
  "/admin/:id/approval",
  protect,
  authorizeRoles("admin"),
  updateProviderApproval
);

// Public provider routes
router.get("/", getProviders);

// Provider application submission
router.post(
  "/profile",
  protect,
  authorizeRoles("provider"),
  createProviderProfile
);

router.get(
  "/admin/stats",
  protect,
  authorizeRoles("admin"),
  getAdminStats
);

router.get("/:id", getProviderById);

module.exports = router;

