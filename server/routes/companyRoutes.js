const express = require("express");
const router = express.Router();
const { protect, authorise } = require("../middleware/authMiddleware");
const {
  getMyCompany,
  updateMyCompany,
} = require("../controllers/companyController");

// GET   /api/company/me   — fetch company info
router.get("/me", protect, authorise("admin"), getMyCompany);

// PATCH /api/company/me   — update company info
router.patch("/me", protect, authorise("admin"), updateMyCompany);

module.exports = router;
