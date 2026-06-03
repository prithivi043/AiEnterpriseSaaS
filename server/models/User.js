const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    // ── Core identity ─────────────────────────────────
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 8, select: false },

    // ── Role: admin | manager | employee ─────────────
    role: {
      type: String,
      enum: ["admin", "manager", "employee"],
      default: "employee",
    },

    // ── Multi-tenant key: every record links to a company ──
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },

    // ── Profile extras ────────────────────────────────
    department: { type: String, default: "" },
    position: { type: String, default: "" }, // used by employees
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

// ── Hash password before saving ───────────────────────
userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  const salt = await bcrypt.genSalt(12);

  this.password = await bcrypt.hash(this.password, salt);
});

// ── Password comparison helper ────────────────────────
userSchema.methods.comparePassword = function (plainText) {
  return bcrypt.compare(plainText, this.password);
};

module.exports = mongoose.model("User", userSchema);
