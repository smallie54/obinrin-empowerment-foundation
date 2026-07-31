import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/client";

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("obinrin_admin_token");
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get("/admin/auth/me")
      .then((res) => setAdmin(res.data))
      .catch(() => localStorage.removeItem("obinrin_admin_token"))
      .finally(() => setLoading(false));
  }, []);

  async function login(email, password) {
    const res = await api.post("/admin/auth/login", { email, password });
    if (res.data.requiresTwoFactor) {
      return { requiresTwoFactor: true, pendingToken: res.data.pendingToken };
    }
    localStorage.setItem("obinrin_admin_token", res.data.token);
    setAdmin(res.data.admin);
    return { requiresTwoFactor: false };
  }

  async function verifyTwoFactor(pendingToken, code) {
    const res = await api.post("/admin/auth/verify-2fa", { pendingToken, code });
    localStorage.setItem("obinrin_admin_token", res.data.token);
    setAdmin(res.data.admin);
  }

  function logout() {
    localStorage.removeItem("obinrin_admin_token");
    setAdmin(null);
  }

  return (
    <AdminAuthContext.Provider
      value={{ admin, loading, login, verifyTwoFactor, logout }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used inside AdminAuthProvider");
  return ctx;
}
