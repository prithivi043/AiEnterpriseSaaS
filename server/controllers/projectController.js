const Project = require("../models/Project");
const Task = require("../models/Task");

// =====================================
// Create Project + Tasks
// =====================================

exports.createProject = async (req, res) => {
  try {
    const { projectName, description, department, deadline, tasks } = req.body;

    const project = await Project.create({
      companyId: req.user.companyId,
      managerId: req.user._id,
      projectName,
      description,
      department,
      deadline,
      totalTasks: tasks.length,
    });

    const createdTasks = [];

    for (const task of tasks) {
      const newTask = await Task.create({
        companyId: req.user.companyId,
        projectId: project._id,
        assignedBy: req.user._id,
        assignedTo: task.assignedTo,
        employeeName: task.employeeName,
        department,
        taskName: task.taskName,
        description: task.description,
        priority: task.priority,
        deadline: task.deadline,
      });

      createdTasks.push(newTask);
    }

    res.status(201).json({
      project,
      tasks: createdTasks,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// =====================================
// Get All Projects
// =====================================

exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      companyId: req.user.companyId,
    }).populate("managerId", "name email");

    res.json(projects);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// =====================================
// Admin Overview
// =====================================

exports.adminProjectOverview = async (req, res) => {
  try {
    const projects = await Project.find({
      companyId: req.user.companyId,
    }).populate("managerId", "name");

    const tasks = await Task.find({
      companyId: req.user.companyId,
    })
      .populate("assignedTo", "name")
      .populate("projectId", "projectName");

    res.json({
      projects,
      tasks,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// =====================================
// Manager Projects
// =====================================

exports.getManagerProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      managerId: req.user._id,
    });

    res.json(projects);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// =====================================
// Employee Projects
// =====================================

exports.getEmployeeProjects = async (req, res) => {
  try {
    const tasks = await Task.find({
      assignedTo: req.user._id,
    }).populate("projectId");

    const projects = tasks.map((task) => task.projectId);

    res.json(projects);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// =====================================
// Single Project
// =====================================

exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    const tasks = await Task.find({
      projectId: project._id,
    });

    res.json({
      project,
      tasks,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// =====================================
// Update Project
// =====================================

exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.projectId,
      req.body,
      {
        new: true,
      },
    );

    res.json(project);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// =====================================
// Delete Project
// =====================================

exports.deleteProject = async (req, res) => {
  try {
    await Task.deleteMany({
      projectId: req.params.projectId,
    });

    await Project.findByIdAndDelete(req.params.projectId);

    res.json({
      message: "Project deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
