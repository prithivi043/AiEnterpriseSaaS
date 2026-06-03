const model = require("../services/geminiService");

const User = require("../models/User");

const Task = require("../models/Task");

const Project = require("../models/Project");

const Finance = require("../models/Finance");

// ========================================
// AI Dashboard Analytics
// ========================================

exports.getAnalytics = async (req, res) => {
  try {
    const companyId = req.user.companyId;

    // Employees
    const employees = await User.find({
      companyId,
      role: "employee",
    }).select("name department position");

    // Managers
    const managers = await User.find({
      companyId,
      role: "manager",
    }).select("name department");

    // Projects
    const projects = await Project.find({
      companyId,
    });

    // Tasks
    const tasks = await Task.find({
      companyId,
    }).populate("assignedTo", "name department");

    // Statistics

    const totalEmployees = employees.length;

    const totalManagers = managers.length;

    const totalProjects = projects.length;

    const totalTasks = tasks.length;

    const completedTasks = tasks.filter((t) => t.status === "completed").length;

    const pendingTasks = tasks.filter((t) => t.status === "pending").length;

    const inProgressTasks = tasks.filter(
      (t) => t.status === "in-progress",
    ).length;

    const overdueTasks = tasks.filter(
      (t) =>
        t.deadline &&
        new Date(t.deadline) < new Date() &&
        t.status !== "completed",
    ).length;

    // AI Prompt

    const prompt = `
Company Overview

Employees: ${totalEmployees}
Managers: ${totalManagers}
Projects: ${totalProjects}
Tasks: ${totalTasks}
Completed Tasks: ${completedTasks}
Pending Tasks: ${pendingTasks}
Overdue Tasks: ${overdueTasks}

Generate ONLY:

1. Company Health Score (0-100)
2. Short Executive Summary (3 lines)
3. One Recommendation

Keep under 120 words.
`;

    const result = await model.generateContent(prompt);

    const aiInsights = result.response.text();

    res.json({
      totalEmployees,
      totalManagers,
      totalProjects,
      totalTasks,
      completedTasks,
      pendingTasks,
      inProgressTasks,
      overdueTasks,
      summary: aiInsights,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ========================================
// AI Chat Assistant
// ========================================

exports.askAI = async (req, res) => {
  try {
    const { question } = req.body;

    const companyId = req.user.companyId;

    const employees = await User.find({
      companyId,
    }).select("name role department");

    const projects = await Project.find({
      companyId,
    });

    const tasks = await Task.find({
      companyId,
    });

    const prompt = `
Company Data:

Employees:
${JSON.stringify(employees)}

Projects:
${JSON.stringify(projects)}

Tasks:
${JSON.stringify(tasks)}

User Question:
${question}

Answer only using company data.
`;

    const result = await model.generateContent(prompt);

    res.json({
      answer: result.response.text(),
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ========================================
// Project Risk Analysis
// ========================================

exports.projectRiskAnalysis = async (req, res) => {
  try {
    const projects = await Project.find({
      companyId: req.user.companyId,
    });

    const tasks = await Task.find({
      companyId: req.user.companyId,
    });

    const prompt = `
You are a project risk consultant.

Projects:
${JSON.stringify(projects)}

Tasks:
${JSON.stringify(tasks)}

Analyze:

1. High Risk Projects

2. Medium Risk Projects

3. Delayed Projects

4. Resource Issues

5. Deadline Risks

6. Suggested Actions

Return detailed report.
`;

    const result = await model.generateContent(prompt);

    res.json({
      report: result.response.text(),
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ========================================
// AI Finance Report
// ========================================

exports.getFinanceReport = async (req, res) => {
  try {
    const companyId = req.user.companyId;

    const finance = await Finance.findOne({
      companyId,
    }).sort({ createdAt: -1 });

    if (!finance) {
      return res.status(404).json({
        message: "Please configure finance settings first.",
      });
    }

    const totalEmployees = await User.countDocuments({
      companyId,
      role: "employee",
    });

    const totalManagers = await User.countDocuments({
      companyId,
      role: "manager",
    });

    const totalProjects = await Project.countDocuments({
      companyId,
    });

    const totalTasks = await Task.countDocuments({
      companyId,
    });

    const completedTasks = await Task.countDocuments({
      companyId,
      status: "completed",
    });

    const pendingTasks = await Task.countDocuments({
      companyId,
      status: "pending",
    });

    const completionRate =
      totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(1) : 0;

    const salaryExpense = totalEmployees * (finance.salaryPerEmployee || 0);

    const totalExpense =
      salaryExpense +
      (finance.officeRent || 0) +
      (finance.hostingCost || 0) +
      (finance.marketingBudget || 0) +
      (finance.miscExpense || 0);

    const prompt = `
You are a CFO AI.

Company Data:

Employees: ${totalEmployees}
Managers: ${totalManagers}
Projects: ${totalProjects}
Tasks: ${totalTasks}
Completed Tasks: ${completedTasks}
Pending Tasks: ${pendingTasks}
Completion Rate: ${completionRate}%

Monthly Expense: ₹${totalExpense}

Return ONLY JSON:

{
  "financialScore": 80,
  "riskLevel": "Low",
  "summary": "Short summary",
  "growthForecast": "Moderate Growth",
  "recommendations": [
    "Recommendation 1",
    "Recommendation 2",
    "Recommendation 3"
  ]
}
`;

    const result = await model.generateContent(prompt);

    const text = result.response.text();

    console.log("GEMINI RESPONSE:");
    console.log(text);

    let aiData;

    try {
      aiData = JSON.parse(
        text
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim(),
      );
    } catch (parseError) {
      console.error("JSON PARSE ERROR:");
      console.error(text);

      aiData = {
        financialScore: 60,
        riskLevel: "Medium",
        summary: "AI returned invalid JSON format.",
        growthForecast: "Stable",
        recommendations: [
          "Review expenses",
          "Improve productivity",
          "Increase project delivery speed",
        ],
      };
    }

    res.json({
      totalEmployees,
      totalManagers,
      totalProjects,
      totalTasks,
      completedTasks,
      pendingTasks,
      completionRate,

      totalExpense,
      salaryExpense,

      financialScore: aiData.financialScore || 0,

      riskLevel: aiData.riskLevel || "N/A",

      summary: aiData.summary || "No summary available",

      growthForecast: aiData.growthForecast || "Stable",

      recommendations: aiData.recommendations || [],

      expenseBreakdown: {
        salary: salaryExpense,
        rent: finance.officeRent || 0,
        hosting: finance.hostingCost || 0,
        marketing: finance.marketingBudget || 0,
        misc: finance.miscExpense || 0,
      },
    });
  } catch (error) {
    console.error("FINANCE ERROR:");
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

exports.createFinance = async (req, res) => {
  try {
    const finance = await Finance.findOneAndUpdate(
      {
        companyId: req.user.companyId,
      },
      req.body,
      {
        new: true,
        upsert: true,
      },
    );

    res.json(finance);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
