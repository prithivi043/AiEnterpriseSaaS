const Task = require("../models/Task");

const Project = require("../models/Project");

// =====================================
// Create Task
// =====================================

exports.createTask = async (req, res) => {
  try {
    const task = await Task.create({
      ...req.body,

      assignedBy: req.user._id,

      companyId: req.user.companyId,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// =====================================
// Get All Tasks
// Admin
// =====================================

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      companyId: req.user.companyId,
    })
      .populate("assignedTo", "name email department")
      .populate("projectId", "projectName");

    res.json(tasks);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// =====================================
// Employee Tasks
// =====================================

exports.getMyTasks = async (req, res) => {
  const tasks = await Task.find({
    assignedTo: req.user._id,
  }).populate("projectId", "projectName description department deadline");

  res.json(tasks);
};

// =====================================
// Manager Team Tasks
// =====================================

exports.managerTaskOverview = async (req, res) => {
  try {
    const tasks = await Task.find({
      assignedBy: req.user._id,
    })
      .populate("assignedTo", "name department")
      .populate("projectId", "projectName");

    res.json(tasks);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// =====================================
// Update Progress
// Employee
// =====================================

exports.updateTaskProgress = async (req, res) => {
  try {
    const { progress } = req.body;

    const task = await Task.findByIdAndUpdate(
      req.params.taskId,
      { progress },
      { new: true },
    );

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    if (progress === 100) {
      task.status = "completed";
    } else if (progress > 0) {
      task.status = "in-progress";
    }

    await task.save();

    res.json(task);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// =====================================
// Update Status
// Employee / Manager
// =====================================

exports.updateTaskStatus = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.taskId,
      {
        status: req.body.status,
      },
      {
        new: true,
      },
    );

    res.json(task);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// =====================================
// Admin Analytics
// =====================================

exports.taskAnalytics = async (req, res) => {
  try {
    const totalTasks = await Task.countDocuments({
      companyId: req.user.companyId,
    });

    const completedTasks = await Task.countDocuments({
      companyId: req.user.companyId,

      status: "completed",
    });

    const pendingTasks = await Task.countDocuments({
      companyId: req.user.companyId,

      status: "pending",
    });

    const inProgressTasks = await Task.countDocuments({
      companyId: req.user.companyId,

      status: "in-progress",
    });

    res.json({
      totalTasks,
      completedTasks,
      pendingTasks,
      inProgressTasks,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
