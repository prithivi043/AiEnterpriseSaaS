const model = require("../services/geminiService");

const router = require("express").Router();

const {
  getAnalytics,
  askAI,
  projectRiskAnalysis,
  getFinanceReport,
  createFinance,
} = require("../controllers/aiController");

const { protect } = require("../middleware/authMiddleware");

router.get("/analytics", protect, getAnalytics);

router.post("/chat", protect, askAI);

router.get("/risk-analysis", protect, projectRiskAnalysis);

router.post("/settings", protect, createFinance);

router.get("/finance", protect, getFinanceReport);

router.post("/", protect, createFinance);

router.get("/test", async (req, res) => {
  try {
    const result = await model.generateContent("Say Hello from Gemini");

    res.json({
      response: result.response.text(),
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;
