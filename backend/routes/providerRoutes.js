const express = require("express");

const router = express.Router();

const {
  createProviderProfile,
  getProviders,
  getProviderById
} = require("../controllers/providerController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

router.get("/", getProviders);

router.post(
  "/profile",
  protect,
  authorizeRoles("provider"),
  createProviderProfile
);

router.get("/:id", getProviderById);

module.exports = router;