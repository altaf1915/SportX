import { createContext, useContext, useMemo, useState } from "react";
import { api } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("sportx_token"));
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("sportx_user");
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("sportx_token", data.token);
    localStorage.setItem("sportx_user", JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
  };

  const register = async (payload) => {
    const { data } = await api.post("/auth/signup", payload);
    localStorage.setItem("sportx_token", data.token);
    localStorage.setItem("sportx_user", JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
  };

  const refreshSession = async () => {
    if (!localStorage.getItem("sportx_token")) return;
    const { data } = await api.post("/auth/refresh");
    localStorage.setItem("sportx_token", data.token);
    localStorage.setItem("sportx_user", JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
  };

  const updateStoredUser = (nextUser) => {
    localStorage.setItem("sportx_user", JSON.stringify(nextUser));
    setUser(nextUser);
  };

  const demoLogin = () => {
    const demoUser = { _id: "demo", name: "Demo Captain", role: "admin", isPremium: true, isVerified: true, city: "Bengaluru", sportsInterests: ["Football", "Chess"] };
    localStorage.setItem("sportx_token", "demo-token");
    localStorage.setItem("sportx_user", JSON.stringify(demoUser));
    setToken("demo-token");
    setUser(demoUser);
  };

  const logout = () => {
    localStorage.removeItem("sportx_token");
    localStorage.removeItem("sportx_user");
    setToken(null);
    setUser(null);
  };

  const value = useMemo(() => ({ token, user, isAuthed: Boolean(token), login, register, refreshSession, updateStoredUser, demoLogin, logout }), [token, user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
