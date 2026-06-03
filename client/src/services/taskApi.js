import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export const getManagerTasks = async () => {
  const res = await axios.get(`${API}/tasks/manager-overview`);

  return res.data;
};
