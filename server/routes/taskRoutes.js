const router = require("express").Router();

const { protect } = require("../middleware/authMiddleware");

const {
  createTask,
  getTasks,
  getMyTasks,
  managerTaskOverview,
  updateTaskProgress,
  updateTaskStatus,
  taskAnalytics,
  changePassword,
} = require("../controllers/taskController");

router.post("/", protect, createTask);

router.get("/", protect, getTasks);

router.get("/my-tasks", protect, getMyTasks);

router.get("/manager-overview", protect, managerTaskOverview);

router.put("/:taskId/status", protect, updateTaskStatus);

router.get("/analytics", protect, taskAnalytics);

router.put("/:taskId/progress", protect, updateTaskProgress);

module.exports = router;
