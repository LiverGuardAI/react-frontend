// src/components/Sidebar.jsx
import React from "react";
import { useAuth } from "../../hooks/useAuth";
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = ({ isOpen }) => {
  const location = useLocation();

  const menus = [
    { name: "Page 1", path: "/page1" },
    { name: "Page 2", path: "/page2" },
    { name: "Page 3", path: "/page3" },
    { name: "Page 4", path: "/page4" },
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
