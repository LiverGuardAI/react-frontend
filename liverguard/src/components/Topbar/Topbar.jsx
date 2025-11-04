// src/components/Topbar.jsx
import React from "react";
import "./Topbar.css";

const Topbar = ({ toggleSidebar }) => {
  return (
    <header className="topbar">
      <button className="toggle-btn" onClick={toggleSidebar}>
        ☰
      </button>
      <div className="topbar-branding">
        <img
          src="/images/logo.png"
          alt="Health Management Logo"
          className="topbar-logo"
          style={{ height: '40px', marginRight: '12px' }}
        />
        <h1 className="topbar-title">LiverGuard Dashboard</h1>
      </div>
    </header>
  );
};

export default Topbar;