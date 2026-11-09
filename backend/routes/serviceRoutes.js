const express = require("express");

const router = express.Router();

const {
  getServices,
  createService
} = require("../controllers/serviceController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

router.get("/", getServices);

router.post(
  "/",
  protect,
  authorizeRoles("admin"),
  createService
);

module.exports = router;