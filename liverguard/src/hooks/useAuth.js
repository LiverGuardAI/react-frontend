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
      const token = localStorage.getItem("access_token");
      if (!token) {
        setUser(null);
        setLoading(false);
        return;  // ✅ 토큰 없으면 API 안 부름
      }

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
    localStorage.setItem("patient_id", data.patient_id); // 추가
  };

const handleLogout = async () => {
  try {
    await logout(); // ✅ 서버에 토큰 보낼 때까지 유지
    alert("로그아웃되었습니다.");
  } catch (err) {
    console.error("로그아웃 실패:", err);
  } finally {
    localStorage.removeItem("access_token"); // ✅ 서버 요청 후 삭제
    localStorage.removeItem("refresh_token");
    setUser(null);
    navigate("/login");
  }
};

  return { user, loading, handleLogin, handleLogout };
};