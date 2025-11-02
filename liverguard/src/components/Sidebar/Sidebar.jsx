import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css"; // 따로 CSS 파일 연결

const Sidebar = () => {
  const location = useLocation();

  const menus = [
    { name: "Page 1", path: "/page1" },
    { name: "Page 2", path: "/page2" },
    { name: "Page 3", path: "/page3" },
    { name: "Page 4", path: "/page4" },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-title">Sidebar</div>
      <nav>
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
    </div>
  );
};

export default Sidebar;