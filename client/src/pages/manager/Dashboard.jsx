import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CreateProjectModal from "../../components/manager/CreateProjectModal";
import {
  FaBolt,
  FaSignOutAlt,
  FaProjectDiagram,
  FaUsers,
  FaClock,
  FaPlus,
  FaChartLine,
  FaTasks,
  FaCog,
  FaTimes,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaCheckCircle,
  FaBars,
  FaHome,
  FaBell,
  FaUser,
} from "react-icons/fa";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// ── Spinner ───────────────────────────────────────────────
function Spinner({ size = "h-4 w-4" }) {
  return (
    <svg
      className={`animate-spin ${size} text-white`}
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v8z"
      />
    </svg>
  );
}

// ── Status badge ──────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    completed: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
    "in-progress": "bg-cyan-500/15 text-cyan-400 border-cyan-500/25",
    pending: "bg-yellow-500/15 text-yellow-400 border-yellow-500/25",
  };
  const cls =
    map[status] || "bg-slate-500/15 text-slate-400 border-slate-500/25";
  return (
    <span
      className={`text-xs font-semibold px-2.5 py-1 rounded-full border capitalize ${cls}`}
    >
      {status}
    </span>
  );
}

// ── Change Password Modal ─────────────────────────────────
function ChangePasswordModal({ onClose }) {
  const { token } = useAuth();
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [show, setShow] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const set = (f) => (e) => setForm({ ...form, [f]: e.target.value });
  const toggleShow = (f) => setShow((s) => ({ ...s, [f]: !s[f] }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.newPassword.length < 8)
      return setError("New password must be at least 8 characters.");
    if (form.newPassword !== form.confirmPassword)
      return setError("Passwords do not match.");
    setLoading(true);
    try {
      await axios.patch(
        `${API}/auth/change-password`,
        {
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setDone(true);
      setTimeout(onClose, 1800);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to change password.");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { key: "currentPassword", label: "Current Password", showKey: "current" },
    { key: "newPassword", label: "New Password", showKey: "new" },
    {
      key: "confirmPassword",
      label: "Confirm New Password",
      showKey: "confirm",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel — slides up on mobile, centered on desktop */}
      <div className="relative w-full sm:max-w-md bg-slate-900 border border-slate-700 rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden animate-slideUp">
        {/* Top bar */}
        <div className="h-1 bg-gradient-to-r from-indigo-600 to-cyan-500" />

        {/* Mobile drag handle */}
        <div className="flex justify-center pt-3 sm:hidden">
          <div className="w-10 h-1 bg-slate-700 rounded-full" />
        </div>

        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center text-indigo-400">
              <FaLock size={14} />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Change Password
              </h2>
              <p className="text-xs text-slate-500">
                Update your account password
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-white transition p-1"
          >
            <FaTimes />
          </button>
        </div>

        <div className="px-6 py-5">
          {done ? (
            <div className="flex flex-col items-center gap-3 py-8">
              <FaCheckCircle className="text-cyan-400 text-5xl" />
              <p className="text-white font-semibold">
                Password changed successfully!
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {error && (
                <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  {error}
                </div>
              )}
              {fields.map(({ key, label, showKey }) => (
                <div key={key} className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-slate-400 uppercase tracking-widest">
                    {label}
                  </label>
                  <div className="relative">
                    <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs" />
                    <input
                      type={show[showKey] ? "text" : "password"}
                      value={form[key]}
                      onChange={set(key)}
                      placeholder="••••••••"
                      required
                      className="w-full bg-slate-800 border border-slate-700 focus:border-cyan-500 rounded-xl pl-9 pr-10 py-3 text-sm text-white placeholder-slate-600 outline-none transition"
                    />
                    <button
                      type="button"
                      onClick={() => toggleShow(showKey)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
                    >
                      {show[showKey] ? (
                        <FaEyeSlash size={13} />
                      ) : (
                        <FaEye size={13} />
                      )}
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 font-semibold text-sm hover:opacity-90 transition disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? <Spinner /> : "Update Password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Settings Drawer ───────────────────────────────────────
function SettingsDrawer({ user, onClose, onChangePassword, onLogout }) {
  return (
    <div className="fixed inset-0 z-40 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full sm:max-w-sm bg-slate-900 border border-slate-700 rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-cyan-500 to-indigo-600" />
        <div className="flex justify-center pt-3 sm:hidden">
          <div className="w-10 h-1 bg-slate-700 rounded-full" />
        </div>

        {/* Profile card */}
        <div className="flex items-center gap-4 px-6 py-5 border-b border-slate-800">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-cyan-500 flex items-center justify-center font-bold text-lg flex-shrink-0">
            {user?.name
              ?.split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-white truncate">{user?.name}</p>
            <p className="text-xs text-slate-400 truncate">{user?.email}</p>
            <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/25">
              {user?.department} · Manager
            </span>
          </div>
        </div>

        {/* Options */}
        <div className="px-3 py-3 flex flex-col gap-1">
          <button
            onClick={onChangePassword}
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 transition text-left w-full group"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500/20 transition">
              <FaLock size={13} />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Change Password</p>
              <p className="text-xs text-slate-500">
                Update your account password
              </p>
            </div>
          </button>

          <button
            onClick={onLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 transition text-left w-full group"
          >
            <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 group-hover:bg-red-500/20 transition">
              <FaSignOutAlt size={13} />
            </div>
            <div>
              <p className="text-sm font-medium text-red-400">Sign Out</p>
              <p className="text-xs text-slate-500">Log out of your account</p>
            </div>
          </button>
        </div>

        <div className="px-6 pb-6">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl border border-slate-700 text-slate-400 text-sm hover:bg-slate-800 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Stat Card ─────────────────────────────────────────────
function StatCard({ title, value, icon, accent }) {
  const colors = {
    cyan: "from-cyan-500/10 to-transparent border-cyan-500/20 text-cyan-400",
    indigo:
      "from-indigo-500/10 to-transparent border-indigo-500/20 text-indigo-400",
    violet:
      "from-violet-500/10 to-transparent border-violet-500/20 text-violet-400",
    amber:
      "from-amber-500/10 to-transparent border-amber-500/20 text-amber-400",
  };
  return (
    <div
      className={`bg-gradient-to-br ${colors[accent]} border rounded-2xl p-4 sm:p-5 flex flex-col gap-3 hover:scale-[1.02] transition-transform`}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-400 font-medium">{title}</span>
        <span className="text-xl">{icon}</span>
      </div>
      <span className="text-3xl font-bold text-white">{value ?? "—"}</span>
    </div>
  );
}

// ── Project Progress Card ─────────────────────────────────
function ProjectCard({ project }) {
  const pct = project.progress || 0;
  const statusColor =
    pct === 100 ? "bg-emerald-500" : pct > 50 ? "bg-cyan-500" : "bg-indigo-500";
  return (
    <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-4 hover:border-cyan-500/30 transition">
      <div className="flex items-start justify-between gap-2 mb-3">
        <h4 className="font-semibold text-sm text-white leading-tight">
          {project.projectName}
        </h4>
        <span className="text-xs text-slate-400 flex-shrink-0">{pct}%</span>
      </div>
      <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
        <div
          className={`${statusColor} h-2 rounded-full transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {project.deadline && (
        <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
          <FaClock size={10} /> Due{" "}
          {new Date(project.deadline).toLocaleDateString()}
        </p>
      )}
    </div>
  );
}

// ── Task Card ─────────────────────────────────────────────
function TaskCard({ task }) {
  return (
    <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-4 hover:border-indigo-500/30 transition">
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="font-semibold text-sm text-white leading-tight">
          {task.taskName}
        </h4>
        <StatusBadge status={task.status} />
      </div>
      <p className="text-xs text-slate-400 flex items-center gap-1.5">
        <FaUser size={9} />
        {task?.assignedTo?.name || "Unassigned"}
      </p>
      {task?.projectId?.projectName && (
        <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
          <FaProjectDiagram size={9} />
          {task.projectId.projectName}
        </p>
      )}
    </div>
  );
}

// ── Main Export ───────────────────────────────────────────
export default function ManagerDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [activeTab, setActiveTab] = useState("overview"); // overview | projects | tasks

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("eaura_token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const [projectRes, taskRes] = await Promise.all([
        axios.get(`${API}/projects`, config),
        axios.get(`${API}/tasks/manager-overview`, config),
      ]);
      setProjects(projectRes.data || []);
      setTasks(taskRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const stats = [
    {
      title: "Projects",
      value: projects.length,
      icon: <FaProjectDiagram />,
      accent: "indigo",
    },
    { title: "Tasks", value: tasks.length, icon: <FaTasks />, accent: "cyan" },
    {
      title: "Employees",
      value: new Set(tasks.map((t) => t?.assignedTo?._id).filter(Boolean)).size,
      icon: <FaUsers />,
      accent: "violet",
    },
    {
      title: "Pending",
      value: tasks.filter((t) => t.status !== "completed").length,
      icon: <FaClock />,
      accent: "amber",
    },
  ];

  const tabs = [
    { id: "overview", label: "Overview", icon: <FaHome size={14} /> },
    { id: "projects", label: "Projects", icon: <FaProjectDiagram size={14} /> },
    { id: "tasks", label: "Tasks", icon: <FaTasks size={14} /> },
    { id: "team", label: "Team", icon: <FaChartLine size={14} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-24 sm:pb-8">
      {/* ── Top Header ──────────────────────────────────── */}
      <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3">
          {/* Logo + title */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-500/20">
              <FaBolt size={14} className="text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-bold text-base leading-tight">
                Eaura <span className="text-cyan-400">AI</span>
              </h1>
              <p className="text-slate-500 text-xs">Manager Workspace</p>
            </div>
            <h1 className="font-bold text-base sm:hidden">
              Eaura <span className="text-cyan-400">AI</span>
            </h1>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Notification bell */}
            <button className="relative w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition">
              <FaBell size={13} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-cyan-400" />
            </button>

            {/* New project btn — hidden on very small */}
            <button
              onClick={() => setShowProjectModal(true)}
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-sm font-medium hover:opacity-90 transition"
            >
              <FaPlus size={11} /> New Project
            </button>

            {/* Settings / avatar */}
            <button
              onClick={() => setShowSettings(true)}
              className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-500 flex items-center justify-center text-xs font-bold hover:opacity-90 transition"
            >
              {user?.name
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </button>
          </div>
        </div>
      </header>

      {/* ── Page body ────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {/* Welcome */}
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold leading-tight">
            Welcome,{" "}
            <span className="text-cyan-400">{user?.name?.split(" ")[0]}</span>{" "}
            👋
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            {user?.department} · Manage projects, tasks and your team.
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {stats.map((s) => (
            <StatCard key={s.title} {...s} />
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-slate-900 border border-slate-800 rounded-2xl p-1 mb-6 overflow-x-auto scrollbar-none">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition whitespace-nowrap flex-1 justify-center
                ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-indigo-600/30 to-cyan-600/15 border border-indigo-500/25 text-white"
                    : "text-slate-400 hover:text-white"
                }`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-slate-500">
            <Spinner size="h-8 w-8" />
            <p className="text-sm">Loading dashboard…</p>
          </div>
        )}

        {/* Tab content */}
        {!loading && (
          <>
            {/* ── Overview ── */}
            {activeTab === "overview" && (
              <div className="flex flex-col gap-5">
                {/* Quick action on mobile */}
                <button
                  onClick={() => setShowProjectModal(true)}
                  className="sm:hidden flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-sm font-semibold hover:opacity-90 transition"
                >
                  <FaPlus size={12} /> Create New Project
                </button>

                {/* Projects summary */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-white flex items-center gap-2">
                      <FaProjectDiagram className="text-indigo-400" size={14} />{" "}
                      Project Overview
                    </h3>
                    <button
                      onClick={() => setActiveTab("projects")}
                      className="text-xs text-cyan-400 hover:underline"
                    >
                      View all
                    </button>
                  </div>
                  {projects.length === 0 ? (
                    <div className="text-center py-8 text-slate-500 text-sm">
                      No projects yet. Create one to get started.
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {projects.slice(0, 3).map((p) => (
                        <ProjectCard key={p._id} project={p} />
                      ))}
                    </div>
                  )}
                </div>

                {/* Tasks summary */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-white flex items-center gap-2">
                      <FaTasks className="text-cyan-400" size={14} /> Recent
                      Tasks
                    </h3>
                    <button
                      onClick={() => setActiveTab("tasks")}
                      className="text-xs text-cyan-400 hover:underline"
                    >
                      View all
                    </button>
                  </div>
                  {tasks.length === 0 ? (
                    <div className="text-center py-8 text-slate-500 text-sm">
                      No tasks assigned yet.
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {tasks.slice(0, 4).map((t) => (
                        <TaskCard key={t._id} task={t} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── Projects ── */}
            {activeTab === "projects" && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-white">
                    All Projects{" "}
                    <span className="text-slate-500 text-sm font-normal">
                      ({projects.length})
                    </span>
                  </h3>
                  <button
                    onClick={() => setShowProjectModal(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-sm font-medium transition"
                  >
                    <FaPlus size={11} /> New
                  </button>
                </div>
                {projects.length === 0 ? (
                  <div className="text-center py-20 text-slate-500">
                    <FaProjectDiagram
                      size={36}
                      className="mx-auto mb-3 opacity-20"
                    />
                    <p>No projects yet.</p>
                    <button
                      onClick={() => setShowProjectModal(true)}
                      className="mt-4 px-5 py-2.5 rounded-xl bg-indigo-600 text-sm font-medium hover:bg-indigo-500 transition"
                    >
                      Create First Project
                    </button>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-3">
                    {projects.map((p) => (
                      <ProjectCard key={p._id} project={p} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── Tasks ── */}
            {activeTab === "tasks" && (
              <div className="flex flex-col gap-4">
                <h3 className="font-semibold text-white">
                  All Tasks{" "}
                  <span className="text-slate-500 text-sm font-normal">
                    ({tasks.length})
                  </span>
                </h3>
                {tasks.length === 0 ? (
                  <div className="text-center py-20 text-slate-500">
                    <FaTasks size={36} className="mx-auto mb-3 opacity-20" />
                    <p>No tasks assigned yet.</p>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-3">
                    {tasks.map((t) => (
                      <TaskCard key={t._id} task={t} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── Team ── */}
            {activeTab === "team" && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-800">
                  <FaChartLine className="text-cyan-400" size={14} />
                  <h3 className="font-semibold text-white">Team Performance</h3>
                </div>
                {tasks.length === 0 ? (
                  <div className="text-center py-20 text-slate-500 text-sm">
                    No task data available.
                  </div>
                ) : (
                  <>
                    {/* Mobile cards */}
                    <div className="sm:hidden divide-y divide-slate-800">
                      {tasks.map((task) => (
                        <div
                          key={task._id}
                          className="px-5 py-4 flex items-center justify-between gap-3"
                        >
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-white truncate">
                              {task?.assignedTo?.name || "—"}
                            </p>
                            <p className="text-xs text-slate-400 truncate">
                              {task.taskName}
                            </p>
                          </div>
                          <StatusBadge status={task.status} />
                        </div>
                      ))}
                    </div>
                    {/* Desktop table */}
                    <div className="hidden sm:block overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-slate-800">
                            <th className="px-5 py-3.5 text-left text-xs text-slate-500 uppercase tracking-widest">
                              Employee
                            </th>
                            <th className="px-5 py-3.5 text-left text-xs text-slate-500 uppercase tracking-widest">
                              Task
                            </th>
                            <th className="px-5 py-3.5 text-left text-xs text-slate-500 uppercase tracking-widest">
                              Project
                            </th>
                            <th className="px-5 py-3.5 text-left text-xs text-slate-500 uppercase tracking-widest">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {tasks.map((task) => (
                            <tr
                              key={task._id}
                              className="border-b border-slate-800/60 hover:bg-slate-800/30 transition"
                            >
                              <td className="px-5 py-4 text-sm font-medium">
                                {task?.assignedTo?.name || "—"}
                              </td>
                              <td className="px-5 py-4 text-sm text-slate-300">
                                {task.taskName}
                              </td>
                              <td className="px-5 py-4 text-sm text-slate-400">
                                {task?.projectId?.projectName || "—"}
                              </td>
                              <td className="px-5 py-4">
                                <StatusBadge status={task.status} />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Bottom nav bar (mobile only) ─────────────────── */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-20 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800">
        <div className="flex items-center">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 transition
                ${activeTab === tab.id ? "text-cyan-400" : "text-slate-500"}`}
            >
              {tab.icon}
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          ))}
          <button
            onClick={() => setShowSettings(true)}
            className="flex-1 flex flex-col items-center gap-1 py-3 text-slate-500"
          >
            <FaCog size={14} />
            <span className="text-[10px] font-medium">Settings</span>
          </button>
        </div>
      </nav>

      {/* ── Modals & Drawers ──────────────────────────────── */}
      {showSettings && (
        <SettingsDrawer
          user={user}
          onClose={() => setShowSettings(false)}
          onChangePassword={() => {
            setShowSettings(false);
            setShowChangePassword(true);
          }}
          onLogout={handleLogout}
        />
      )}

      {showChangePassword && (
        <ChangePasswordModal onClose={() => setShowChangePassword(false)} />
      )}

      {showProjectModal && (
        <CreateProjectModal
          onClose={() => setShowProjectModal(false)}
          refreshProjects={loadDashboardData}
        />
      )}

      {/* Slide-up animation */}
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        .animate-slideUp { animation: slideUp 0.3s cubic-bezier(0.32, 0.72, 0, 1) both; }
        .scrollbar-none::-webkit-scrollbar { display: none; }
        .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
