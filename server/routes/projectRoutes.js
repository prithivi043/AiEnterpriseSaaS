const router = require("express").Router();

const {
  createProject,
  getProjects,
  adminProjectOverview,
} = require("../controllers/projectController");

const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createProject);

router.get("/", protect, getProjects);

router.get("/admin-overview", protect, adminProjectOverview);

module.exports = router;
