import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export const getMyTasks = async () => {
  const { data } = await axios.get(`${API}/tasks/my-tasks`);

  return data;
};

export const updateTaskProgress = async (taskId, progress) => {
  const { data } = await axios.put(`${API}/tasks/${taskId}/progress`, {
    progress,
  });

  return data;
};

export const updateTaskStatus = async (id, status) => {
  const { data } = await axios.put(`${API}/tasks/${id}/status`, { status });

  return data;
};

export const changePassword = async (payload) => {
  const { data } = await axios.put(`${API}/users/change-password`, payload);

  return data;
};
