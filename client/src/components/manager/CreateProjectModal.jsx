import { useState, useEffect } from "react";

import axios from "axios";

import { FaTimes, FaPlus, FaTrash } from "react-icons/fa";

const API = import.meta.env.VITE_API_URL;

export default function CreateProjectModal({ onClose, refreshProjects }) {
  const [employees, setEmployees] = useState([]);

  const [project, setProject] = useState({
    projectName: "",
    description: "",
    department: "",
    deadline: "",
  });

  const [tasks, setTasks] = useState([
    {
      taskName: "",
      assignedTo: "",
      employeeName: "",
      priority: "medium",
      deadline: "",
    },
  ]);

  useEffect(() => {
    if (!project.department) return;

    fetchEmployees();
  }, [project.department]);

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem("eaura_token");

      const { data } = await axios.get(
        `${API}/users/department?department=${project.department}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setEmployees(data);
    } catch (error) {
      console.log(error);
    }
  };

  const addTask = () => {
    setTasks([
      ...tasks,
      {
        taskName: "",
        assignedTo: "",
        employeeName: "",
        priority: "medium",
        deadline: "",
      },
    ]);
  };

  const removeTask = (index) => {
    const updated = [...tasks];

    updated.splice(index, 1);

    setTasks(updated);
  };

  const updateTask = (index, field, value) => {
    const updated = [...tasks];

    updated[index][field] = value;

    if (field === "assignedTo") {
      const employee = employees.find((emp) => emp._id === value);

      updated[index].employeeName = employee?.name || "";
    }

    setTasks(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("eaura_token");

      await axios.post(
        `${API}/projects`,
        {
          ...project,
          tasks,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      refreshProjects();

      onClose();
    } catch (error) {
      console.log(error);

      alert(error.response?.data?.message || "Project creation failed");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-5">
      <div className="w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}

        <div className="flex items-center justify-between px-8 py-5 border-b border-slate-800">
          <h2 className="text-2xl font-bold text-white">Create Project</h2>

          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <FaTimes />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-8 overflow-y-auto max-h-[85vh]"
        >
          {/* Project Details */}

          <div className="grid md:grid-cols-2 gap-5">
            <input
              type="text"
              placeholder="Project Name"
              required
              value={project.projectName}
              onChange={(e) =>
                setProject({
                  ...project,
                  projectName: e.target.value,
                })
              }
              className="bg-slate-800 border border-slate-700 rounded-xl p-3 text-white"
            />

            <select
              required
              value={project.department}
              onChange={(e) =>
                setProject({
                  ...project,
                  department: e.target.value,
                })
              }
              className="bg-slate-800 border border-slate-700 rounded-xl p-3 text-white"
            >
              <option value="">Select Department</option>

              <option>Development</option>

              <option>Design</option>

              <option>HR</option>

              <option>Finance</option>

              <option>Marketing</option>
            </select>
          </div>

          <textarea
            placeholder="Project Description"
            rows="4"
            value={project.description}
            onChange={(e) =>
              setProject({
                ...project,
                description: e.target.value,
              })
            }
            className="w-full mt-5 bg-slate-800 border border-slate-700 rounded-xl p-3 text-white"
          />

          <input
            type="date"
            required
            value={project.deadline}
            onChange={(e) =>
              setProject({
                ...project,
                deadline: e.target.value,
              })
            }
            className="w-full mt-5 bg-slate-800 border border-slate-700 rounded-xl p-3 text-white"
          />

          {/* Tasks */}

          <div className="mt-8 flex justify-between items-center">
            <h3 className="text-xl font-semibold text-white">Project Tasks</h3>

            <button
              type="button"
              onClick={addTask}
              className="bg-cyan-600 hover:bg-cyan-500 px-4 py-2 rounded-xl flex items-center gap-2"
            >
              <FaPlus />
              Add Task
            </button>
          </div>

          <div className="space-y-5 mt-5">
            {tasks.map((task, index) => (
              <div
                key={index}
                className="bg-slate-800 border border-slate-700 rounded-2xl p-5"
              >
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-semibold text-white">Task {index + 1}</h4>

                  {tasks.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTask(index)}
                      className="text-red-400"
                    >
                      <FaTrash />
                    </button>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Task Name"
                    required
                    value={task.taskName}
                    onChange={(e) =>
                      updateTask(index, "taskName", e.target.value)
                    }
                    className="bg-slate-900 border border-slate-700 rounded-xl p-3 text-white"
                  />

                  <select
                    required
                    value={task.assignedTo}
                    onChange={(e) =>
                      updateTask(index, "assignedTo", e.target.value)
                    }
                    className="bg-slate-900 border border-slate-700 rounded-xl p-3 text-white"
                  >
                    <option value="">Select Employee</option>

                    {employees.map((emp) => (
                      <option key={emp._id} value={emp._id}>
                        {emp.name}
                        {" - "}
                        {emp.position}
                      </option>
                    ))}
                  </select>

                  <select
                    value={task.priority}
                    onChange={(e) =>
                      updateTask(index, "priority", e.target.value)
                    }
                    className="bg-slate-900 border border-slate-700 rounded-xl p-3 text-white"
                  >
                    <option value="low">Low</option>

                    <option value="medium">Medium</option>

                    <option value="high">High</option>
                  </select>

                  <input
                    type="date"
                    value={task.deadline}
                    onChange={(e) =>
                      updateTask(index, "deadline", e.target.value)
                    }
                    className="bg-slate-900 border border-slate-700 rounded-xl p-3 text-white"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}

          <div className="flex justify-end gap-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 rounded-xl bg-slate-700"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 font-semibold"
            >
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
