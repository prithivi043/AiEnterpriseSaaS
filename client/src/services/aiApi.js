import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export const getAIAnalytics = async () => {
  const { data } = await axios.get(`${API}/ai/analytics`);

  return data;
};

export const getRiskAnalysis = async () => {
  const { data } = await axios.get(`${API}/ai/risk-analysis`);

  return data;
};

export const askAI = async (question) => {
  const { data } = await axios.post(`${API}/ai/chat`, {
    question,
  });

  return data;
};
