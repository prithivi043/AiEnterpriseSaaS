import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export const getProjects = async () => {
  const res = await axios.get(`${API}/projects/manager-projects`);

  return res.data;
};

export const getAdminProjectOverview = async () => {
  const { data } = await axios.get(`${API}/projects/admin-overview`);

  return data;
};
