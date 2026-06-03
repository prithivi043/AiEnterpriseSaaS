import { useEffect, useState } from "react";

import {
  FaProjectDiagram,
  FaTasks,
  FaCheckCircle,
  FaCalendarAlt,
} from "react-icons/fa";

import {
  getMyTasks,
  updateTaskProgress,
  updateTaskStatus,
} from "../../services/employeeApi";

export default function MyProjects() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const tasks = await getMyTasks();

      const grouped = {};

      tasks.forEach((task) => {
        const project = task.projectId;

        if (!project) return;

        if (!grouped[project._id]) {
          grouped[project._id] = {
            ...project,
            tasks: [],
          };
        }

        grouped[project._id].tasks.push(task);
      });

      setProjects(Object.values(grouped));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}

      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-white">
          My Projects
        </h1>

        <p className="text-slate-400 mt-1">
          View all projects assigned to you and track progress.
        </p>
      </div>

      {/* Projects */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {projects.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center text-slate-400">
            No projects assigned.
          </div>
        ) : (
          projects.map((project) => {
            const totalTasks = project.tasks.length;

            const completedTasks = project.tasks.filter(
              (task) => task.status === "completed",
            ).length;

            const progress =
              totalTasks > 0
                ? Math.round(
                    project.tasks.reduce(
                      (total, task) => total + (task.progress || 0),
                      0,
                    ) / totalTasks,
                  )
                : 0;

            return (
              <div
                key={project._id}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-6 hover:border-cyan-500 transition"
              >
                {/* Top */}

                <div className="flex items-start justify-between mb-5">
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                        <FaProjectDiagram />
                      </div>

                      <div>
                        <h2 className="text-xl font-bold text-white">
                          {project.projectName}
                        </h2>

                        <p className="text-slate-400 text-sm">
                          {project.department}
                        </p>
                      </div>
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs">
                    {progress}%
                  </span>
                </div>

                {/* Description */}

                <p className="text-slate-400 mb-6">
                  {project.description || "No description available"}
                </p>

                {/* Stats */}

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-800 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-cyan-400 mb-2">
                      <FaTasks />

                      <span className="text-sm">Tasks</span>
                    </div>

                    <h3 className="text-2xl font-bold">{totalTasks}</h3>
                  </div>

                  <div className="bg-slate-800 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-green-400 mb-2">
                      <FaCheckCircle />

                      <span className="text-sm">Completed</span>
                    </div>

                    <h3 className="text-2xl font-bold">{completedTasks}</h3>
                  </div>
                </div>

                {/* Progress */}

                <div className="mt-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Project Progress</span>

                    <span>{progress}%</span>
                  </div>

                  <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full"
                      style={{
                        width: `${progress}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Project Tasks */}

                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Assigned Tasks</h3>

                  <div className="space-y-3">
                    {project.tasks.map((task) => (
                      <div
                        key={task._id}
                        className="bg-slate-800 rounded-xl p-4"
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                          <div>
                            <h4 className="font-semibold text-white">
                              {task.taskName}
                            </h4>

                            <p className="text-sm text-slate-400">
                              {task.description}
                            </p>

                            <p className="text-xs text-cyan-400 mt-1">
                              Current Progress: {task.progress || 0}%
                            </p>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-3">
                            {/* Progress Update */}

                            <select
                              value={task.progress || 0}
                              onChange={async (e) => {
                                try {
                                  await updateTaskProgress(
                                    task._id,
                                    Number(e.target.value),
                                  );

                                  loadProjects();
                                } catch (error) {
                                  console.log(error);
                                }
                              }}
                              className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2"
                            >
                              <option value="0">0%</option>

                              <option value="25">25%</option>

                              <option value="50">50%</option>

                              <option value="75">75%</option>

                              <option value="100">100%</option>
                            </select>

                            {/* Status Update */}

                            <select
                              value={task.status}
                              onChange={async (e) => {
                                try {
                                  await updateTaskStatus(
                                    task._id,
                                    e.target.value,
                                  );

                                  loadProjects();
                                } catch (error) {
                                  console.log(error);
                                }
                              }}
                              className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2"
                            >
                              <option value="pending">Pending</option>

                              <option value="in-progress">In Progress</option>

                              <option value="completed">Completed</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Deadline */}

                <div className="mt-6 flex items-center gap-3 text-slate-400">
                  <FaCalendarAlt />

                  <span>Deadline:</span>

                  <span className="text-white">
                    {project.deadline
                      ? new Date(project.deadline).toLocaleDateString()
                      : "Not specified"}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
