// src/components/Sidebar/Sidebar.jsx
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logout as apiLogout } from "../../api/authAPI"; // src 기준으로 경로 맞춰주세요
import "./Sidebar.css";

const Sidebar = ({ isOpen = true, menus = [] }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 초기 로그인 상태 체크 (렌더 시 토큰만 확인)
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setIsLoggedIn(Boolean(token));
  }, []);

  // 안전한 로그아웃 핸들러 (버튼 클릭 시만 실행)
  const handleLogout = async (e) => {
    e?.preventDefault?.();
    if (isLoggedIn) {
      try {
        await apiLogout(); // 백엔드에 로그아웃 요청 (내부에서 토큰 제거 안 하면 여기서 제거)
      } catch (err) {
        // 로그아웃 실패해도 클라이언트 토큰은 제거하여 세션을 확실히 끝냄
        console.error("Logout API error:", err);
      } finally {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        setIsLoggedIn(false);
        navigate("/login", { replace: true });
      }
    } else {
      // 로그인 유도: 로그인 페이지로 이동
      navigate("/login");
    }
  };

  return (
    <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <nav className="menu">
        {menus.map((menu) => (
          <Link
            key={menu.path}
            to={menu.path}
            className={`menu-item ${location.pathname === menu.path ? "active" : ""}`}
          >
            {menu.name}
          </Link>
        ))}
      </nav>

      <div className="logout-section">
        {/* type="button"을 반드시 명시 -> form 내에서 submit 되는 것을 막음 */}
        <button type="button" className="logout-btn" onClick={handleLogout}>
          {isLoggedIn ? "로그아웃" : "로그인"}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
