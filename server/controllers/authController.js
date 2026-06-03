const Company = require("../models/Company");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

exports.registerCompany = async (req, res) => {
  try {
    console.log("REGISTER BODY:", req.body); // ← add this to debug

    const { companyName, name, email, password } = req.body;

    if (!companyName || !name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required.",
        received: { companyName, name, email, passwordProvided: !!password },
      });
    }

    const companyExists = await Company.findOne({ companyName });
    if (companyExists) {
      return res.status(400).json({ message: "Company name already exists." });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email already registered." });
    }

    const company = await Company.create({ companyName });

    const admin = await User.create({
      name,
      email,
      password,
      role: "admin",
      companyId: company._id,
    });

    const token = generateToken(admin._id);

    res.status(201).json({
      message: "Enterprise registered successfully.",
      token,
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        companyId: company._id,
        companyName: company.companyName,
      },
    });
  } catch (error) {
    console.log("========== REGISTER ERROR ==========");
    console.log(error);
    console.log(error.stack);

    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];

      return res.status(400).json({
        message: `${field} already exists.`,
      });
    }

    return res.status(500).json({
      message: error.message,
    });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email })
      .select("+password")
      .populate("companyId");

    if (!user) return res.status(401).json({ message: "Invalid credentials." });

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials." });

    if (!user.isActive)
      return res.status(403).json({ message: "Account deactivated." });

    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyId: user.companyId._id,
        companyName: user.companyId.companyName,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const u = req.user;
    res.json({
      id: u._id,
      name: u.name,
      email: u.email,
      role: u.role,
      department: u.department,
      position: u.position,
      companyId: u.companyId._id,
      companyName: u.companyId.companyName,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
