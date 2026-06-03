const mongoose = require("mongoose");

const financeSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },

    salaryPerEmployee: {
      type: Number,
      default: 0,
    },

    officeRent: {
      type: Number,
      default: 0,
    },

    hostingCost: {
      type: Number,
      default: 0,
    },

    marketingBudget: {
      type: Number,
      default: 0,
    },

    miscExpense: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Finance", financeSchema);
