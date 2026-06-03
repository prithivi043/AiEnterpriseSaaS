const express = require("express");

const router = express.Router();

const bcrypt = require("bcryptjs");

const User = require("../models/User");

const { protect, authorise } = require("../middleware/authMiddleware");

const {
  createManager,
  createEmployee,
  getManagers,
  getEmployees,
  getAllUsers,
  deactivateUser,
  getEmployeesByDepartment,
  changePassword,
} = require("../controllers/userController");

// ======================================
// Common Authentication
// ======================================

router.use(protect);

// ======================================
// Admin Only Routes
// ======================================

router.post("/manager", authorise("admin"), createManager);

router.post("/employee", authorise("admin"), createEmployee);

router.get("/managers", authorise("admin"), getManagers);

router.get("/employees", authorise("admin"), getEmployees);

router.get("/all", authorise("admin"), getAllUsers);

router.delete("/:id", authorise("admin"), deactivateUser);

// ======================================
// Admin + Manager Routes
// ======================================

router.get(
  "/department",
  authorise("admin", "manager"),
  getEmployeesByDepartment,
);

router.put("/change-password", protect, changePassword);

module.exports = router;
