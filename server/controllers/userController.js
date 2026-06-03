const User = require("../models/User");

const bcrypt = require("bcryptjs");

// ─────────────────────────────────────────────────────
//  POST  /api/users/manager   (admin only)
//  Creates a Manager under the admin's company.
//  companyId is auto-inherited — never sent from client.
// ─────────────────────────────────────────────────────
exports.createManager = async (req, res) => {
  try {
    const { name, email, password, department } = req.body;

    if (!name || !email || !password || !department) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ message: "Email already in use." });
    }

    const manager = await User.create({
      name,
      email,
      password,
      department,
      role: "manager",
      companyId: req.user.companyId._id, // ← auto-inherited from logged-in admin
    });

    res.status(201).json({
      message: "Manager created successfully.",
      user: {
        id: manager._id,
        name: manager.name,
        email: manager.email,
        role: manager.role,
        department: manager.department,
        companyId: manager.companyId,
        companyName: req.user.companyId.companyName,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────────────
//  POST  /api/users/employee   (admin only)
//  Creates an Employee under the admin's company.
// ─────────────────────────────────────────────────────
exports.createEmployee = async (req, res) => {
  try {
    const { name, email, password, department, position } = req.body;

    if (!name || !email || !password || !department || !position) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ message: "Email already in use." });
    }

    const employee = await User.create({
      name,
      email,
      password,
      department,
      position,
      role: "employee",
      companyId: req.user.companyId._id, // ← auto-inherited
    });

    res.status(201).json({
      message: "Employee created successfully.",
      user: {
        id: employee._id,
        name: employee.name,
        email: employee.email,
        role: employee.role,
        department: employee.department,
        position: employee.position,
        companyId: employee.companyId,
        companyName: req.user.companyId.companyName,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────────────
//  GET  /api/users/managers   (admin only)
// ─────────────────────────────────────────────────────
exports.getManagers = async (req, res) => {
  try {
    const managers = await User.find({
      companyId: req.user.companyId._id,
      role: "manager",
      isActive: true,
    }).select("-password");

    res.json({ count: managers.length, managers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────────────
//  GET  /api/users/employees   (admin only)
// ─────────────────────────────────────────────────────
exports.getEmployees = async (req, res) => {
  try {
    const employees = await User.find({
      companyId: req.user.companyId._id,
      role: "employee",
      isActive: true,
    }).select("-password");

    res.json({ count: employees.length, employees });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────────────
//  GET  /api/users/all   (admin only)
//  Returns all users (managers + employees) in company
// ─────────────────────────────────────────────────────
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({
      companyId: req.user.companyId._id,
      role: { $ne: "admin" },
      isActive: true,
    }).select("-password");

    res.json({ count: users.length, users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────────────
//  DELETE  /api/users/:id   (admin only)
//  Soft-deletes a user by setting isActive = false
// ─────────────────────────────────────────────────────
exports.deactivateUser = async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.params.id,
      companyId: req.user.companyId._id, // must belong to same company
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    user.isActive = false;
    await user.save();

    res.json({ message: "User deactivated successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getEmployeesByDepartment = async (req, res) => {
  try {
    const { department } = req.query;

    const employees = await User.find({
      companyId: req.user.companyId,

      role: "employee",

      department: department,

      isActive: true,
    }).select("name position department");

    res.json(employees);

    console.log("Department:", department);

    console.log("Company:", req.user.companyId);

    console.log(employees);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // 1. Validate inputs
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Both current and new password are required.",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        message: "New password must be at least 8 characters.",
      });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({
        message: "New password must be different from the current password.",
      });
    }

    // 2. Fetch user with password (select: false by default)
    const user = await User.findById(req.user._id).select("+password");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // 3. Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Current password is incorrect." });
    }

    // 4. Assign new password — User pre-save hook handles hashing
    user.password = newPassword;
    await user.save();

    res.json({ message: "Password updated successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
