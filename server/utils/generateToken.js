const jwt =
  require("jsonwebtoken");

const generateToken = (
  id,
  role,
  companyId
) => {
  return jwt.sign(
    {
      id,
      role,
      companyId,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

module.exports =
  generateToken;