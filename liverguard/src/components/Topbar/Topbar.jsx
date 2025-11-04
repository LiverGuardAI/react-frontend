// src/components/Topbar.jsx
import React, { useState, useEffect } from "react";
import "./Topbar.css";

const Topbar = ({ toggleSidebar }) => {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    // localStorage에서 사용자 이름 가져오기
    const loadUserName = () => {
      const storedName = localStorage.getItem("user_name");
      if (storedName) {
        setUserName(storedName);
      }
    };

    // 초기 로드
    loadUserName();

    // 주기적으로 체크 (localStorage 변경 감지)
    const interval = setInterval(loadUserName, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <header className="topbar">
      <div className="topbar-left-items"> {/* ⬅️ 버튼과 로고를 묶어줍니다. */}
        <button className="toggle-btn" onClick={toggleSidebar}>
          ☰
        </button>
        <img
          src="/images/logo.png"
          alt="Health Management Logo"
          className="topbar-logo"
        />
      </div>

      <div className="topbar-center">
        <h1 className="topbar-title">LiverGuard Dashboard</h1>
      </div>

      {userName && (
        <div className="topbar-user">
          <span className="user-name">{userName}님</span>
        </div>
      )}
    </header>
  );

};

export default Topbar;