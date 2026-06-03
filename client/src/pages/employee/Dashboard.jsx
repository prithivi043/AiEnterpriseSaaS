import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

import {
  FaHome,
  FaTasks,
  FaProjectDiagram,
  FaChartLine,
  FaCog,
  FaSignOutAlt,
  FaBolt,
  FaBars,
  FaTimes,
} from "react-icons/fa";

import EmployeeHome from "./EmployeeHome";

import MyProjects from "./MyProjects";

import Settings from "./Settings";

export default function EmployeeDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const { user, logout } = useAuth();

  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menu = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <FaHome />,
    },

    {
      id: "projects",
      label: "My Projects",
      icon: <FaProjectDiagram />,
    },

    {
      id: "settings",
      label: "Settings",
      icon: <FaCog />,
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "projects":
        return <MyProjects />;

      case "settings":
        return <Settings />;

      default:
        return <EmployeeHome />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      {/* Mobile Overlay */}

      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        />
      )}

      {/* Sidebar */}

      <aside
        className={`
        fixed lg:static
        top-0 left-0
        h-screen
        w-72
        bg-slate-900
        border-r border-slate-800
        z-50
        transform
        transition-transform
        duration-300

        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}

        lg:translate-x-0
      `}
      >
        {/* Logo */}

        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 flex items-center justify-center">
              <FaBolt />
            </div>

            <div>
              <h2 className="font-bold text-lg">Eaura AI</h2>

              <p className="text-xs text-slate-400">Employee Workspace</p>
            </div>
          </div>

          <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
            <FaTimes />
          </button>
        </div>

        {/* Navigation */}

        <nav className="p-4">
          {menu.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition ${
                activeTab === item.id ? "bg-cyan-600" : "hover:bg-slate-800"
              }`}
            >
              {item.icon}

              {item.label}
            </button>
          ))}

          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-slate-800 mt-5"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}

      <main className="flex-1 min-w-0">
        {/* Header */}

        <header className="h-auto lg:h-20 border-b border-slate-800 px-4 lg:px-8 py-4 flex items-center justify-between">
          {/* Left Side */}

          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg bg-slate-800"
            >
              <FaBars />
            </button>

            <div>
              <h1 className="text-lg lg:text-2xl font-bold truncate">
                Welcome, {user?.name}
              </h1>

              <p className="text-sm text-slate-400">{user?.department}</p>
            </div>
          </div>

          {/* Right Side */}

          <div className="text-right">
            <h3 className="text-sm lg:text-base font-medium">
              {user?.position}
            </h3>

            <p className="text-xs text-slate-500">Employee</p>
          </div>
        </header>

        {/* Content */}

        <div className="p-4 lg:p-8">{renderContent()}</div>
      </main>
    </div>
  );
}
