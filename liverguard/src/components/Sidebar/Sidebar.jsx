// src/components/Sidebar.jsx
import React from "react";
import { useAuth } from "../../hooks/useAuth";
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = ({ isOpen }) => {
  const location = useLocation();

  const menus = [
    { name: "2D MAP", path: "/page1" },
    { name: "혈액검사 결과관리", path: "/page2" },
    { name: "혈액검사 대시보드", path: "/dashboard1" },
    { name: "일정관리", path: "/page3" },
  ];

  const { handleLogout } = useAuth();

  return (
    <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <nav className="menu">
        {menus.map((menu) => (
          <Link
            key={menu.path}
            to={menu.path}
            className={`menu-item ${
              location.pathname === menu.path ? "active" : ""
            }`}
          >
            {menu.name}
          </Link>
        ))}
      </nav>
      <div className="logout-section">
        <button className="logout-btn" onClick={handleLogout}>
          로그아웃
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
