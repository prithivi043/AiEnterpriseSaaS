import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(
    () => localStorage.getItem("eaura_token") || null,
  );
  const [loading, setLoading] = useState(true);

  // Keep axios header in sync with token
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      localStorage.setItem("eaura_token", token);
    } else {
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem("eaura_token");
    }
  }, [token]);

  // On mount: verify stored token
  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await axios.get(`${API}/auth/me`);
        setUser(data);
      } catch {
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    verify();
  }, []); // eslint-disable-line

  // Register company + admin
  const register = async (payload) => {
    const { data } = await axios.post(`${API}/auth/register`, payload);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  // Login
  const login = async (email, password) => {
    const { data } = await axios.post(`${API}/auth/login`, { email, password });
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  // Logout
  const logout = () => {
    setToken(null);
    setUser(null);
  };

  // Admin: create manager  →  POST /api/users/manager
  const createManager = async (payload) => {
    const { data } = await axios.post(`${API}/users/manager`, payload);
    return data.user;
  };

  // Admin: create employee  →  POST /api/users/employee
  const createEmployee = async (payload) => {
    const { data } = await axios.post(`${API}/users/employee`, payload);
    return data.user;
  };

  // Fetch managers list
  const fetchManagers = async () => {
    const { data } = await axios.get(`${API}/users/managers`);
    return data.managers;
  };

  // Fetch employees list
  const fetchEmployees = async () => {
    const { data } = await axios.get(`${API}/users/employees`);
    return data.employees;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        register,
        login,
        logout,
        createManager,
        createEmployee,
        fetchManagers,
        fetchEmployees,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
