import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserInfo, login, logout } from "../api/authAPI";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
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
    try {
      await logout(); // ✅ refresh token 무효화 시도
      alert("로그아웃되었습니다.");
    } catch (err) {
      console.error("로그아웃 실패:", err);
      alert("이미 로그아웃 상태이거나, 서버 연결에 실패했습니다.");
    } finally {
      setUser(null);
      navigate("/login"); // ✅ 항상 로그인 페이지로 이동
    }
  };

  return { user, loading, handleLogin, handleLogout };
};