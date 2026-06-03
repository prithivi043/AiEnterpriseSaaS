const Company = require("../models/Company");

// ─────────────────────────────────────────────────────
//  GET  /api/company/me   (admin only)
// ─────────────────────────────────────────────────────
exports.getMyCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.user.companyId._id);
    if (!company) {
      return res.status(404).json({ message: "Company not found." });
    }
    res.json(company);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────────────
//  PATCH  /api/company/me   (admin only)
// ─────────────────────────────────────────────────────
exports.updateMyCompany = async (req, res) => {
  try {
    const { companyName, phone, address } = req.body;

    const company = await Company.findByIdAndUpdate(
      req.user.companyId._id,
      { companyName, phone, address },
      { new: true, runValidators: true },
    );

    res.json({ message: "Company updated successfully.", company });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
