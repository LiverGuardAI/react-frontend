import { useState, useEffect } from "react";
import { getUserInfo, login, logout } from "../api/authAPI";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 앱 실행 시 사용자 정보 가져오기
  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await getUserInfo();
        setUser(data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const handleLogin = async (credentials) => {
    await login(credentials);
    const data = await getUserInfo();
    setUser(data);
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
  };

  return { user, loading, handleLogin, handleLogout };
};