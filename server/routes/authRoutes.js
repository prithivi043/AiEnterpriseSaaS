const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

const {
  registerCompany,
  loginUser,
  getMe,
} = require("../controllers/authController");

const { changePassword } = require("../controllers/userController");

// POST   /api/auth/register         — create company + admin (public)
router.post("/register", registerCompany);

// POST   /api/auth/login            — login any role (public)
router.post("/login", loginUser);

// GET    /api/auth/me               — get current user (any logged-in role)
router.get("/me", protect, getMe);

// PATCH  /api/auth/change-password  — change own password (any logged-in role)
//        Works for:  admin | manager | employee
router.patch("/change-password", protect, changePassword);

module.exports = router;
