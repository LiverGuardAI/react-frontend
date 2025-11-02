// src/components/Topbar.jsx
import React from "react";
import "./Topbar.css";

const Topbar = ({ toggleSidebar }) => {
  return (
    <header className="topbar">
      <button className="toggle-btn" onClick={toggleSidebar}>
        ☰
      </button>
      <h1 className="topbar-title">LiverGuard Dashboard</h1>
    </header>
  );
};

export default Topbar;