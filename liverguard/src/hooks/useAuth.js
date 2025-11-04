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
    // getUserInfo는 선택적으로 처리 (실패해도 로그인은 성공으로 처리)
    try {
      const data = await getUserInfo();
      setUser(data);
      localStorage.setItem("patient_id", data.patient_id);
      localStorage.setItem("user_name", data.name);  // 사용자 이름 저장
    } catch (err) {
      console.warn("사용자 정보 로딩 실패 (나중에 재시도):", err);
      // 사용자 정보는 나중에 Page1에서 다시 불러올 것임
    }
  };

  const handleLogout = async () => {
    try {
      await logout(); // 서버에 로그아웃 요청
      alert("로그아웃되었습니다.");
    } catch (err) {
      console.error("로그아웃 실패:", err);
    } finally {
      // 로컬 스토리지 정리
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("patient_id");
      localStorage.removeItem("user_name");
      setUser(null);
      navigate("/login");
    }
  };

  return { user, loading, handleLogin, handleLogout };
};