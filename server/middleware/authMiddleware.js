const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  console.log("AUTH HEADER:", authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Not authorised. No token provided.",
    });
  }

  try {
    const token = authHeader.split(" ")[1];

    console.log("TOKEN:", token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("DECODED:", decoded);

    const user = await User.findById(decoded.id)
      .populate("companyId")
      .select("-password");

    console.log("USER FOUND:", user);

    if (!user) {
      return res.status(401).json({
        message: "User belonging to this token no longer exists.",
      });
    }

    req.user = user;

    next();
  } catch (err) {
    console.log("JWT ERROR:", err);

    return res.status(401).json({
      message: "Token is invalid or has expired.",
    });
  }
};

const authorise = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Role '${req.user.role}' does not have access to this resource.`,
      });
    }

    next();
  };
};

module.exports = {
  protect,
  authorise,
};
