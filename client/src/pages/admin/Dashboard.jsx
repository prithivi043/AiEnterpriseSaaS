import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getAdminProjectOverview } from "../../services/projectApi";
import { useAuth } from "../../context/AuthContext";
import AIAnalytics from "./AIAnalytics";
import AIFinance from "./AIFinance";
import AIChat from "./AIChat";
import {
  FaBolt,
  FaUsers,
  FaUserTie,
  FaUserCog,
  FaProjectDiagram,
  FaChartLine,
  FaMoneyBillWave,
  FaPlus,
  FaTimes,
  FaBuilding,
  FaSignOutAlt,
  FaBell,
  FaSearch,
  FaEye,
  FaEyeSlash,
  FaCheckCircle,
  FaTachometerAlt,
  FaClipboardList,
  FaCog,
  FaEnvelope,
  FaLock,
  FaIdBadge,
  FaSitemap,
  FaBriefcase,
  FaBars,
  FaChevronRight,
  FaRobot,
} from "react-icons/fa";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: <FaTachometerAlt /> },
  { id: "managers", label: "Managers", icon: <FaUserTie /> },
  { id: "employees", label: "Employees", icon: <FaUsers /> },
  { id: "projects", label: "Projects", icon: <FaProjectDiagram /> },
  { id: "tasks", label: "Tasks", icon: <FaClipboardList /> },
  { id: "finances", label: "Finances", icon: <FaMoneyBillWave /> },
  { id: "analytics", label: "AI Analytics", icon: <FaChartLine /> },
  { id: "settings", label: "Settings", icon: <FaCog />, disabled: true },
];

const BOTTOM_NAV = [
  { id: "dashboard", label: "Home", icon: <FaTachometerAlt size={18} /> },
  { id: "managers", label: "Managers", icon: <FaUserTie size={18} /> },
  { id: "employees", label: "Employees", icon: <FaUsers size={18} /> },
  { id: "projects", label: "Projects", icon: <FaProjectDiagram size={18} /> },
];

const DEPARTMENTS = [
  "Engineering",
  "Product",
  "Design",
  "Marketing",
  "Sales",
  "Finance",
  "Operations",
  "HR",
  "Legal",
];

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

function FormInput({
  icon,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
}) {
  const [show, setShow] = useState(false);
  const isPass = type === "password";
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-slate-400 uppercase tracking-widest">
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">
          {icon}
        </span>
        <input
          type={isPass ? (show ? "text" : "password") : type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="w-full bg-slate-800/70 border border-slate-700 focus:border-cyan-500 rounded-xl pl-9 pr-9 py-3 text-sm text-white placeholder-slate-500 outline-none transition"
        />
        {isPass && (
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
          >
            {show ? <FaEyeSlash size={13} /> : <FaEye size={13} />}
          </button>
        )}
      </div>
    </div>
  );
}

function FormSelect({ icon, label, value, onChange, options, required }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-slate-400 uppercase tracking-widest">
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">
          {icon}
        </span>
        <select
          value={value}
          onChange={onChange}
          required={required}
          className="w-full bg-slate-800/70 border border-slate-700 focus:border-cyan-500 rounded-xl pl-9 pr-4 py-3 text-sm text-white outline-none transition appearance-none"
        >
          <option value="">Select {label}</option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

function SuccessState({ label }) {
  return (
    <motion.div
      className="flex flex-col items-center gap-3 py-8"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
    >
      <FaCheckCircle className="text-cyan-400 text-5xl" />
      <p className="text-white font-semibold">{label}</p>
    </motion.div>
  );
}

function ModalShell({ title, subtitle, onClose, accent, children }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        className="relative w-full sm:max-w-md bg-slate-900 border border-slate-700 rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="flex justify-center pt-3 pb-1 sm:hidden flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-slate-700" />
        </div>
        <div
          className={`h-1 w-full flex-shrink-0 ${accent === "indigo" ? "bg-gradient-to-r from-indigo-600 to-violet-500" : "bg-gradient-to-r from-cyan-500 to-indigo-500"}`}
        />
        <div className="flex items-start justify-between px-5 pt-5 pb-4 border-b border-slate-800 flex-shrink-0">
          <div>
            <h2 className="text-base font-bold text-white">{title}</h2>
            <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-white transition p-1"
          >
            <FaTimes />
          </button>
        </div>
        <div className="px-5 py-5 overflow-y-auto flex-1">{children}</div>
      </motion.div>
    </motion.div>
  );
}

function CreateManagerModal({ onClose, onSuccess, companyName }) {
  const { createManager } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const set = (f) => (e) => setForm({ ...form, [f]: e.target.value });
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await createManager(form);
      setDone(true);
      setTimeout(() => onSuccess(user), 900);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create manager.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <ModalShell
      title="Create Manager"
      subtitle={`Company: ${companyName}`}
      onClose={onClose}
      accent="indigo"
    >
      {done ? (
        <SuccessState label="Manager created successfully!" />
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-sm">
            <FaBuilding className="text-indigo-400 flex-shrink-0" />
            <span className="text-slate-300 truncate min-w-0">
              Company: <strong className="text-white">{companyName}</strong>
            </span>
            <span className="ml-auto text-xs bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full flex-shrink-0">
              Auto
            </span>
          </div>
          {error && (
            <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2">
              {error}
            </p>
          )}
          <FormInput
            icon={<FaIdBadge />}
            label="Full Name"
            value={form.name}
            onChange={set("name")}
            placeholder="Jane Smith"
            required
          />
          <FormInput
            icon={<FaEnvelope />}
            label="Email"
            type="email"
            value={form.email}
            onChange={set("email")}
            placeholder="jane@company.com"
            required
          />
          <FormInput
            icon={<FaLock />}
            label="Password"
            type="password"
            value={form.password}
            onChange={set("password")}
            placeholder="Min. 8 characters"
            required
          />
          <FormSelect
            icon={<FaSitemap />}
            label="Department"
            value={form.department}
            onChange={set("department")}
            options={DEPARTMENTS}
            required
          />
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm">
            <FaUserTie className="text-cyan-400" />
            <span className="text-slate-400">Role</span>
            <span className="ml-auto text-cyan-300 font-semibold">Manager</span>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="mt-1 w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 font-semibold text-sm hover:opacity-90 transition disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <Spinner />
            ) : (
              <>
                <FaPlus size={12} /> Create Manager
              </>
            )}
          </button>
        </form>
      )}
    </ModalShell>
  );
}

function CreateEmployeeModal({ onClose, onSuccess, companyName }) {
  const { createEmployee } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
    position: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const set = (f) => (e) => setForm({ ...form, [f]: e.target.value });
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await createEmployee(form);
      setDone(true);
      setTimeout(() => onSuccess(user), 900);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create employee.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <ModalShell
      title="Create Employee"
      subtitle={`Company: ${companyName}`}
      onClose={onClose}
      accent="cyan"
    >
      {done ? (
        <SuccessState label="Employee created successfully!" />
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-sm">
            <FaBuilding className="text-cyan-400 flex-shrink-0" />
            <span className="text-slate-300 truncate min-w-0">
              Company: <strong className="text-white">{companyName}</strong>
            </span>
            <span className="ml-auto text-xs bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full flex-shrink-0">
              Auto
            </span>
          </div>
          {error && (
            <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2">
              {error}
            </p>
          )}
          <FormInput
            icon={<FaIdBadge />}
            label="Full Name"
            value={form.name}
            onChange={set("name")}
            placeholder="John Doe"
            required
          />
          <FormInput
            icon={<FaEnvelope />}
            label="Email"
            type="email"
            value={form.email}
            onChange={set("email")}
            placeholder="john@company.com"
            required
          />
          <FormInput
            icon={<FaLock />}
            label="Password"
            type="password"
            value={form.password}
            onChange={set("password")}
            placeholder="Min. 8 characters"
            required
          />
          <FormSelect
            icon={<FaSitemap />}
            label="Department"
            value={form.department}
            onChange={set("department")}
            options={DEPARTMENTS}
            required
          />
          <FormInput
            icon={<FaBriefcase />}
            label="Position / Job Title"
            value={form.position}
            onChange={set("position")}
            placeholder="e.g. Frontend Engineer"
            required
          />
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm">
            <FaUserCog className="text-cyan-400" />
            <span className="text-slate-400">Role</span>
            <span className="ml-auto text-cyan-300 font-semibold">
              Employee
            </span>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="mt-1 w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-500 font-semibold text-sm hover:opacity-90 transition disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <Spinner />
            ) : (
              <>
                <FaPlus size={12} /> Create Employee
              </>
            )}
          </button>
        </form>
      )}
    </ModalShell>
  );
}

function SidebarDrawer({ activeNav, setActiveNav, user, onLogout, onClose }) {
  return (
    <motion.div
      className="fixed inset-0 z-40 flex"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.aside
        className="relative w-72 max-w-[85vw] bg-slate-900 border-r border-slate-800 flex flex-col h-full"
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        exit={{ x: "-100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="h-14 flex items-center gap-3 px-4 border-b border-slate-800 flex-shrink-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-500 flex items-center justify-center flex-shrink-0">
            <FaBolt size={13} className="text-white" />
          </div>
          <span className="font-bold text-base">
            Eaura <span className="text-cyan-400">AI</span>
          </span>
          <button
            onClick={onClose}
            className="ml-auto text-slate-500 hover:text-white transition p-1"
          >
            <FaTimes />
          </button>
        </div>
        <div className="mx-3 mt-3 px-3 py-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex-shrink-0">
          <div className="text-xs text-indigo-300 font-medium truncate">
            {user?.companyName}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">Admin Account</div>
        </div>
        <nav className="flex-1 px-2 py-3 flex flex-col gap-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                if (!item.disabled) {
                  setActiveNav(item.id);
                  onClose();
                }
              }}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition w-full text-left
                ${activeNav === item.id ? "bg-gradient-to-r from-indigo-600/30 to-cyan-600/15 border border-indigo-500/25 text-white" : "text-slate-400 hover:text-white hover:bg-slate-800"}
                ${item.disabled ? "opacity-35 cursor-not-allowed" : "cursor-pointer"}`}
            >
              <span
                className={`text-base flex-shrink-0 ${activeNav === item.id ? "text-cyan-400" : ""}`}
              >
                {item.icon}
              </span>
              <span>{item.label}</span>
              {item.disabled ? (
                <span className="ml-auto text-xs bg-slate-800 text-slate-500 px-2 py-0.5 rounded-full">
                  Soon
                </span>
              ) : (
                activeNav !== item.id && (
                  <FaChevronRight
                    size={10}
                    className="ml-auto text-slate-700"
                  />
                )
              )}
            </button>
          ))}
        </nav>
        <div className="px-3 pb-4 border-t border-slate-800 pt-3 flex-shrink-0">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-800/50 mb-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-500 flex items-center justify-center text-xs font-bold flex-shrink-0">
              {user?.name
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium truncate leading-tight">
                {user?.name}
              </div>
              <div className="text-xs text-slate-500 truncate">
                {user?.email}
              </div>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition w-full"
          >
            <FaSignOutAlt className="flex-shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </motion.aside>
    </motion.div>
  );
}

function StatCard({ icon, label, value, accent }) {
  const colors = {
    cyan: "from-cyan-500/15 to-cyan-500/5 border-cyan-500/20",
    indigo: "from-indigo-500/15 to-indigo-500/5 border-indigo-500/20",
    violet: "from-violet-500/15 to-violet-500/5 border-violet-500/20",
    emerald: "from-emerald-500/15 to-emerald-500/5 border-emerald-500/20",
  };
  return (
    <motion.div
      whileHover={{ y: -3 }}
      className={`bg-gradient-to-br ${colors[accent]} border rounded-2xl p-4 transition`}
    >
      <div className="mb-2 text-xl">{icon}</div>
      <div className="text-2xl sm:text-3xl font-bold text-white">{value}</div>
      <div className="text-xs sm:text-sm text-slate-400 mt-1">{label}</div>
    </motion.div>
  );
}

function UserRow({ user, index }) {
  const roleColor =
    user.role === "manager"
      ? "bg-indigo-500/15 text-indigo-300 border-indigo-500/25"
      : "bg-cyan-500/15 text-cyan-300 border-cyan-500/25";
  const initials = user.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const bgs = [
    "from-indigo-600 to-violet-500",
    "from-cyan-600 to-indigo-500",
    "from-violet-600 to-pink-500",
    "from-emerald-600 to-cyan-500",
  ];
  return (
    <>
      <div className="sm:hidden bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4 flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-xl bg-gradient-to-br ${bgs[index % bgs.length]} flex items-center justify-center text-sm font-bold flex-shrink-0`}
        >
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">{user.name}</p>
          <p className="text-xs text-slate-400 truncate">{user.email}</p>
          <p className="text-xs text-slate-500 mt-0.5 truncate">
            {user.department}
            {user.position ? ` · ${user.position}` : ""}
          </p>
        </div>
        <span
          className={`text-xs font-semibold px-2.5 py-1 rounded-full border capitalize flex-shrink-0 ${roleColor}`}
        >
          {user.role}
        </span>
      </div>
      <motion.tr
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.04 }}
        className="hidden sm:table-row border-b border-slate-800/60 hover:bg-slate-800/30 transition"
      >
        <td className="px-5 py-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-8 h-8 rounded-xl bg-gradient-to-br ${bgs[index % bgs.length]} flex items-center justify-center text-xs font-bold flex-shrink-0`}
            >
              {initials}
            </div>
            <span className="text-sm font-medium text-white">{user.name}</span>
          </div>
        </td>
        <td className="px-5 py-4 text-sm text-slate-400">{user.email}</td>
        <td className="px-5 py-4 text-sm text-slate-400">{user.department}</td>
        {user.position !== undefined && (
          <td className="px-5 py-4 text-sm text-slate-400">
            {user.position || "—"}
          </td>
        )}
        <td className="px-5 py-4">
          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full border capitalize ${roleColor}`}
          >
            {user.role}
          </span>
        </td>
      </motion.tr>
    </>
  );
}

function TeamTable({
  title,
  subtitle,
  data,
  loading,
  onAdd,
  addLabel,
  columns,
  showPosition,
}) {
  const [search, setSearch] = useState("");
  const filtered = data.filter((u) =>
    [u.name, u.email, u.department].some((v) =>
      v?.toLowerCase().includes(search.toLowerCase()),
    ),
  );
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">{title}</h1>
          <p className="text-slate-400 text-sm mt-1">{subtitle}</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-sm font-medium hover:opacity-90 transition"
        >
          <FaPlus size={11} /> {addLabel}
        </motion.button>
      </div>
      <div className="relative">
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={`Search ${title.toLowerCase()}…`}
          className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-8 pr-4 py-2.5 text-sm placeholder-slate-500 text-white outline-none focus:border-cyan-500 transition"
        />
      </div>
      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner size="h-8 w-8" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-500 text-sm">
          No {title.toLowerCase()} found.
        </div>
      ) : (
        <>
          <div className="sm:hidden flex flex-col gap-3">
            {filtered.map((u, i) => (
              <UserRow key={u._id || i} user={u} index={i} />
            ))}
          </div>
          <div className="hidden sm:block bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800">
                  {columns.map((col) => (
                    <th
                      key={col}
                      className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-widest"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((u, i) => (
                  <UserRow key={u._id || i} user={u} index={i} />
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      <p className="text-xs text-slate-600">
        {filtered.length} of {data.length} {title.toLowerCase()} shown
      </p>
    </div>
  );
}

function ProjectsView({ projects }) {
  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-xl sm:text-2xl font-bold">Projects Monitoring</h1>
      {projects.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          <FaProjectDiagram size={36} className="mx-auto mb-3 opacity-20" />
          <p className="text-sm">No projects yet.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {projects.map((p) => (
            <div
              key={p._id}
              className="bg-slate-900 border border-slate-800 hover:border-cyan-500/30 rounded-2xl p-5 transition"
            >
              <div className="flex justify-between items-start gap-3">
                <div className="min-w-0">
                  <h2 className="font-semibold text-white truncate">
                    {p.projectName}
                  </h2>
                  <p className="text-slate-400 text-sm mt-0.5">
                    {p.department}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-cyan-400 text-sm font-medium">
                    {p.managerId?.name}
                  </p>
                  <p className="text-xs text-slate-500">Manager</p>
                </div>
              </div>
              {p.progress !== undefined && (
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                    <span>Progress</span>
                    <span>{p.progress || 0}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-cyan-500 h-2 rounded-full"
                      style={{ width: `${p.progress || 0}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TasksView({ tasks }) {
  const sc = (s) =>
    ({
      completed: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
      "in-progress": "bg-cyan-500/15 text-cyan-400 border-cyan-500/25",
      pending: "bg-amber-500/15 text-amber-400 border-amber-500/25",
    })[s] || "bg-slate-500/15 text-slate-400 border-slate-500/25";
  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-xl sm:text-2xl font-bold">Task Monitoring</h1>
      {tasks.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          <FaClipboardList size={36} className="mx-auto mb-3 opacity-20" />
          <p className="text-sm">No tasks yet.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {tasks.map((t) => (
            <div
              key={t._id}
              className="bg-slate-900 border border-slate-800 hover:border-indigo-500/30 rounded-2xl p-5 transition"
            >
              <div className="flex justify-between items-start gap-3">
                <div className="min-w-0">
                  <h3 className="font-semibold text-white truncate">
                    {t.taskName}
                  </h3>
                  <p className="text-slate-400 text-xs mt-1 truncate">
                    {t.projectId?.projectName}
                  </p>
                </div>
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full border capitalize flex-shrink-0 ${sc(t.status)}`}
                >
                  {t.status}
                </span>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-cyan-600 to-indigo-500 flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {t.assignedTo?.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </div>
                <span className="text-xs text-slate-400">
                  {t.assignedTo?.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DashboardHome({
  admin,
  managers,
  employees,
  setModal,
  projects,
  tasks,
  setActiveNav,
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">
            Welcome, {admin?.name?.split(" ")[0]} 👋
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Managing{" "}
            <span className="text-cyan-400 font-medium">
              {admin?.companyName}
            </span>
          </p>
        </div>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setModal("manager")}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-sm font-medium transition"
          >
            <FaPlus size={10} />
            <span className="hidden sm:inline">Add </span>Manager
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setModal("employee")}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 text-sm font-medium hover:opacity-90 transition"
          >
            <FaPlus size={10} />
            <span className="hidden sm:inline">Add </span>Employee
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <StatCard
          icon={<FaUsers className="text-cyan-400" />}
          label="Total Users"
          value={managers.length + employees.length}
          accent="cyan"
        />
        <StatCard
          icon={<FaUserTie className="text-indigo-400" />}
          label="Managers"
          value={managers.length}
          accent="indigo"
        />
        <StatCard
          icon={<FaUserCog className="text-violet-400" />}
          label="Employees"
          value={employees.length}
          accent="violet"
        />
        <StatCard
          icon={<FaProjectDiagram className="text-emerald-400" />}
          label="Projects"
          value={projects.length}
          accent="emerald"
        />
        <StatCard
          icon={<FaClipboardList className="text-cyan-400" />}
          label="Tasks"
          value={tasks.length}
          accent="cyan"
        />
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6">
        <h2 className="font-semibold text-white mb-4 flex items-center gap-2 text-sm sm:text-base">
          <FaSitemap className="text-cyan-400" /> Organisation Hierarchy
        </h2>
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex items-center gap-3 px-3 sm:px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-600/20 to-cyan-600/10 border border-indigo-500/25">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-500 flex items-center justify-center text-xs font-bold flex-shrink-0">
              {admin?.name
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
            </div>
            <div className="min-w-0">
              <div className="font-semibold text-white text-xs sm:text-sm truncate">
                {admin?.name}
              </div>
              <div className="text-xs text-indigo-300 truncate">
                Administrator · {admin?.companyName}
              </div>
            </div>
          </div>
          <div className="ml-6 sm:ml-8 border-l border-slate-700 pl-3 sm:pl-4 flex flex-col gap-2 mt-1">
            {managers.map((m, i) => (
              <div
                key={m._id || i}
                className="flex items-center gap-3 px-3 py-2 rounded-xl bg-slate-800/60 border border-slate-700/60"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-500 flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {m.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </div>
                <div className="min-w-0">
                  <div className="text-white text-xs font-medium truncate">
                    {m.name}
                  </div>
                  <div className="text-xs text-slate-500 truncate">
                    {m.department} · Manager
                  </div>
                </div>
              </div>
            ))}
            {employees.map((e, i) => (
              <div
                key={e._id || i}
                className="flex items-center gap-3 px-3 py-2 rounded-xl bg-slate-800/40 border border-slate-800"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-600 to-indigo-500 flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {e.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </div>
                <div className="min-w-0">
                  <div className="text-white text-xs font-medium truncate">
                    {e.name}
                  </div>
                  <div className="text-xs text-slate-500 truncate">
                    {e.department} · {e.position || "Employee"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          {
            label: "Create Manager",
            desc: "Add a department manager",
            icon: <FaUserTie />,
            color: "indigo",
            action: () => setModal("manager"),
          },
          {
            label: "Create Employee",
            desc: "Add a team member",
            icon: <FaUserCog />,
            color: "cyan",
            action: () => setModal("employee"),
          },
          {
            label: "AI Assistant",
            desc: "Ask Gemini about your data",
            icon: <FaRobot />,
            color: "cyan",
            action: () => setActiveNav("analytics"),
          },
        ].map((qa) => (
          <motion.button
            key={qa.label}
            whileHover={!qa.disabled ? { y: -3 } : {}}
            onClick={!qa.disabled ? qa.action : undefined}
            disabled={qa.disabled}
            className={`text-left bg-slate-900 border ${qa.disabled ? "border-slate-800 opacity-40 cursor-not-allowed" : "border-slate-700 hover:border-cyan-500/30 cursor-pointer"} rounded-2xl p-4 flex flex-col gap-3 transition`}
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-base ${qa.color === "indigo" ? "bg-indigo-500/15 text-indigo-400" : qa.color === "cyan" ? "bg-cyan-500/15 text-cyan-400" : "bg-violet-500/15 text-violet-400"}`}
            >
              {qa.icon}
            </div>
            <div>
              <div className="font-semibold text-xs sm:text-sm leading-tight">
                {qa.label}
              </div>
              <div className="text-xs text-slate-500 mt-0.5 leading-snug">
                {qa.desc}
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { user, logout, fetchManagers, fetchEmployees } = useAuth();
  const navigate = useNavigate();

  const [activeNav, setActiveNav] = useState("dashboard");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);
  const [modal, setModal] = useState(null);
  const [managers, setManagers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const load = async () => {
      setDataLoading(true);
      try {
        const [mgrs, emps, overview] = await Promise.all([
          fetchManagers(),
          fetchEmployees(),
          getAdminProjectOverview(),
        ]);
        setManagers(mgrs);
        setEmployees(emps);
        setProjects(overview.projects || []);
        setTasks(overview.tasks || []);
      } catch (err) {
        console.error("Failed to load:", err);
      } finally {
        setDataLoading(false);
      }
    };
    load();
  }, []); // eslint-disable-line

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  const handleManagerCreated = (u) => {
    setManagers((p) => [u, ...p]);
    setModal(null);
  };
  const handleEmployeeCreated = (u) => {
    setEmployees((p) => [u, ...p]);
    setModal(null);
  };

  const renderContent = () => {
    switch (activeNav) {
      case "dashboard":
        return (
          <DashboardHome
            admin={user}
            managers={managers}
            employees={employees}
            projects={projects}
            tasks={tasks}
            setModal={setModal}
            setActiveNav={setActiveNav}
          />
        );
      case "managers":
        return (
          <TeamTable
            title="Managers"
            subtitle="All managers in your enterprise"
            data={managers}
            loading={dataLoading}
            onAdd={() => setModal("manager")}
            addLabel="Add Manager"
            columns={["Name", "Email", "Department", "Role"]}
            showPosition={false}
          />
        );
      case "employees":
        return (
          <TeamTable
            title="Employees"
            subtitle="All employees in your enterprise"
            data={employees}
            loading={dataLoading}
            onAdd={() => setModal("employee")}
            addLabel="Add Employee"
            columns={["Name", "Email", "Department", "Position", "Role"]}
            showPosition={true}
          />
        );
      case "projects":
        return <ProjectsView projects={projects} />;
      case "tasks":
        return <TasksView tasks={tasks} />;
      case "analytics":
        return <AIAnalytics />;
      case "finances":
        return <AIFinance />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-60 sm:h-80 gap-4 text-slate-500">
            <FaCog size={36} className="opacity-30" />
            <p className="text-base sm:text-lg font-medium">Coming Soon</p>
            <p className="text-sm text-center">
              This module is part of the next phase of Eaura AI.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex overflow-hidden">
      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex ${desktopCollapsed ? "w-16" : "w-64"} flex-shrink-0 flex-col bg-slate-900 border-r border-slate-800 transition-all duration-300 z-30`}
      >
        <div className="h-16 flex items-center gap-3 px-4 border-b border-slate-800 flex-shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-500 flex items-center justify-center flex-shrink-0">
            <FaBolt size={14} className="text-white" />
          </div>
          {!desktopCollapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-bold text-lg"
            >
              Eaura <span className="text-cyan-400">AI</span>
            </motion.span>
          )}
        </div>
        {!desktopCollapsed && (
          <div className="mx-3 mt-4 px-3 py-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
            <div className="text-xs text-indigo-300 font-medium truncate">
              {user?.companyName}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">Admin Account</div>
          </div>
        )}
        <nav className="flex-1 px-2 py-4 flex flex-col gap-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => !item.disabled && setActiveNav(item.id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition w-full text-left
                ${activeNav === item.id ? "bg-gradient-to-r from-indigo-600/30 to-cyan-600/15 border border-indigo-500/25 text-white" : "text-slate-400 hover:text-white hover:bg-slate-800"}
                ${item.disabled ? "opacity-35 cursor-not-allowed" : "cursor-pointer"}`}
            >
              <span
                className={`text-base flex-shrink-0 ${activeNav === item.id ? "text-cyan-400" : ""}`}
              >
                {item.icon}
              </span>
              {!desktopCollapsed && <span>{item.label}</span>}
              {!desktopCollapsed && item.disabled && (
                <span className="ml-auto text-xs bg-slate-800 text-slate-500 px-2 py-0.5 rounded-full">
                  Soon
                </span>
              )}
            </button>
          ))}
        </nav>
        <div className="px-2 pb-4 border-t border-slate-800 pt-4 flex-shrink-0">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition w-full"
          >
            <FaSignOutAlt className="flex-shrink-0" />
            {!desktopCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-14 sm:h-16 flex items-center justify-between px-4 sm:px-6 border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl flex-shrink-0 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setDrawerOpen(true)}
              className="lg:hidden text-slate-400 hover:text-white transition p-1"
            >
              <FaBars size={18} />
            </button>
            <button
              onClick={() => setDesktopCollapsed(!desktopCollapsed)}
              className="hidden lg:block text-slate-400 hover:text-white transition"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <rect y="3" width="20" height="2" rx="1" />
                <rect y="9" width="20" height="2" rx="1" />
                <rect y="15" width="20" height="2" rx="1" />
              </svg>
            </button>
            <div className="lg:hidden flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-600 to-cyan-500 flex items-center justify-center">
                <FaBolt size={11} className="text-white" />
              </div>
              <span className="font-bold text-sm">
                Eaura <span className="text-cyan-400">AI</span>
              </span>
            </div>
            <div className="relative hidden md:block">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs" />
              <input
                placeholder="Search people, projects…"
                className="bg-slate-800/60 border border-slate-700 rounded-xl pl-8 pr-4 py-2 text-sm placeholder-slate-500 text-white outline-none focus:border-cyan-500 transition w-52 lg:w-64"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition">
              <FaBell size={12} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-cyan-400" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-500 flex items-center justify-center text-xs font-bold">
                {user?.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
              </div>
              <div className="hidden sm:block">
                <div className="text-xs sm:text-sm font-medium leading-tight">
                  {user?.name}
                </div>
                <div className="text-xs text-slate-500">Administrator</div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 pb-24 lg:pb-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeNav}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-20 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 safe-area-pb">
        <div className="flex items-stretch">
          {BOTTOM_NAV.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 transition relative
                ${activeNav === item.id ? "text-cyan-400" : "text-slate-500"}`}
            >
              {item.icon}
              <span className="text-[10px] font-medium">{item.label}</span>
              {activeNav === item.id && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-cyan-400 rounded-full" />
              )}
            </button>
          ))}
          <button
            onClick={() => setDrawerOpen(true)}
            className="flex-1 flex flex-col items-center justify-center gap-1 py-3 text-slate-500"
          >
            <FaBars size={18} />
            <span className="text-[10px] font-medium">More</span>
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <SidebarDrawer
            activeNav={activeNav}
            setActiveNav={setActiveNav}
            user={user}
            onLogout={handleLogout}
            onClose={() => setDrawerOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Modals */}
      <AnimatePresence>
        {modal === "manager" && (
          <CreateManagerModal
            onClose={() => setModal(null)}
            onSuccess={handleManagerCreated}
            companyName={user?.companyName}
          />
        )}
        {modal === "employee" && (
          <CreateEmployeeModal
            onClose={() => setModal(null)}
            onSuccess={handleEmployeeCreated}
            companyName={user?.companyName}
          />
        )}
        {modal === "ai" && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => {
                setModal(null);
                setActiveNav("analytics");
              }}
            />

            <motion.div
              className="relative w-full sm:max-w-md sm:mx-4 bg-slate-900 border border-slate-700 rounded-t-3xl sm:rounded-2xl overflow-hidden"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
            >
              <div className="flex justify-center pt-3 sm:hidden">
                <div className="w-10 h-1 rounded-full bg-slate-700" />
              </div>

              <div className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 flex items-center justify-center text-2xl">
                  🤖
                </div>

                <h2 className="text-xl font-bold mb-2">Eaura AI Analytics</h2>

                <p className="text-slate-400 mb-6">
                  Open the AI Analytics dashboard to view company insights,
                  financial reports, recommendations, and business intelligence.
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setModal(null)}
                    className="flex-1 px-4 py-3 rounded-xl border border-slate-700 hover:bg-slate-800"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={() => {
                      setModal(null);
                      setActiveNav("analytics");
                    }}
                    className="flex-1 px-4 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500"
                  >
                    Open Analytics
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
