import { useEffect, useState } from "react";

import {
  FaTasks,
  FaProjectDiagram,
  FaCheckCircle,
  FaClock,
  FaChartLine,
  FaCalendarAlt,
} from "react-icons/fa";

import { useAuth } from "../../context/AuthContext";
import { getMyTasks } from "../../services/employeeApi";

export default function EmployeeHome() {
  const { user } = useAuth();

  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const data = await getMyTasks();
      setTasks(data);
    } catch (error) {
      console.log(error);
    }
  };

  const completed = tasks.filter((task) => task.status === "completed").length;

  const pending = tasks.filter((task) => task.status === "pending").length;

  const inProgress = tasks.filter(
    (task) => task.status === "in-progress",
  ).length;

  const projects = new Set(tasks.map((task) => task.projectId?._id)).size;

  const productivity =
    tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0;

  const stats = [
    {
      title: "Projects",
      value: projects,
      icon: <FaProjectDiagram />,
      color: "from-cyan-500 to-blue-500",
    },
    {
      title: "Total Tasks",
      value: tasks.length,
      icon: <FaTasks />,
      color: "from-violet-500 to-purple-500",
    },
    {
      title: "Completed",
      value: completed,
      icon: <FaCheckCircle />,
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Pending",
      value: pending,
      icon: <FaClock />,
      color: "from-orange-500 to-red-500",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}

      <div className="bg-gradient-to-r from-cyan-600 to-indigo-700 rounded-3xl p-8 shadow-xl">
        <h1 className="text-3xl font-bold text-white">
          Welcome back, {user?.name}
          👋
        </h1>

        <p className="text-cyan-100 mt-2">
          Track your projects, update tasks, and monitor your productivity.
        </p>
      </div>

      {/* Stats */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-6"
          >
            <div
              className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${stat.color} flex items-center justify-center text-white text-xl mb-4`}
            >
              {stat.icon}
            </div>

            <h2 className="text-3xl font-bold text-white">{stat.value}</h2>

            <p className="text-slate-400 mt-1">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Performance Section */}

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <FaChartLine className="text-cyan-400" />
            <h2 className="text-xl font-semibold">Productivity Score</h2>
          </div>

          <div className="text-6xl font-bold text-cyan-400">
            {productivity}%
          </div>

          <p className="text-slate-400 mt-3">Based on completed tasks.</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <FaTasks className="text-violet-400" />
            <h2 className="text-xl font-semibold">Task Overview</h2>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Completed</span>

              <span className="text-green-400">{completed}</span>
            </div>

            <div className="flex justify-between">
              <span>In Progress</span>

              <span className="text-cyan-400">{inProgress}</span>
            </div>

            <div className="flex justify-between">
              <span>Pending</span>

              <span className="text-orange-400">{pending}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Tasks */}

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <FaCalendarAlt className="text-cyan-400" />

          <h2 className="text-xl font-semibold">Recent Assigned Tasks</h2>
        </div>

        {tasks.length === 0 ? (
          <div className="text-slate-400">No tasks assigned.</div>
        ) : (
          <div className="space-y-4">
            {tasks.slice(0, 5).map((task) => (
              <div
                key={task._id}
                className="bg-slate-800 rounded-2xl p-4 flex justify-between items-center"
              >
                <div>
                  <h3 className="font-semibold">{task.taskName}</h3>

                  <p className="text-sm text-slate-400">
                    {task?.projectId?.projectName}
                  </p>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    task.status === "completed"
                      ? "bg-green-500/20 text-green-400"
                      : task.status === "in-progress"
                        ? "bg-cyan-500/20 text-cyan-400"
                        : "bg-orange-500/20 text-orange-400"
                  }`}
                >
                  {task.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
