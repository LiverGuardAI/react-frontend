// src/components/Topbar/Topbar.jsx
import React, { useState, useEffect } from "react";
import "./Topbar.css";

const Topbar = ({ toggleSidebar }) => {
  const [userName, setUserName] = useState("사용자");

  useEffect(() => {
    const name = localStorage.getItem("name") || "사용자";
    setUserName(name);
  }, []);

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="toggle-btn" onClick={toggleSidebar}>
          ☰
        </button>
        <h1 className="topbar-title">LiverGuard Dashboard</h1>
      </div>

      <div className="topbar-right">
        <div className="user-info">
          <div className="user-details">
            <div className="user-name">{userName}</div>
          </div>
          <div className="user-avatar">
            {userName.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;