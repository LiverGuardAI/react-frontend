// src/components/Layout/Layout.jsx
import React, { useState } from "react";
import Sidebar from "../Sidebar/Sidebar"; 
import Topbar from "../Topbar/Topbar";    
import { Outlet } from "react-router-dom";
import "./Layout.css";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const menus = [
    { name: "2D MAP", path: "/page1" },
    { name: "혈액검사 기록관리", path: "/page2" },
    { name: "혈액검사 대시보드", path: "/dashboard1" },
    { name: "일정관리", path: "/page3" },
    { name: "개인정보 수정", path: "/profile" },
    { name: "근처 약국 검색", path: "/pharmacy" },
  ];

  return (
    <div className="layout">
      <Topbar toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} menus={menus} />
      <main className={`main-content ${isSidebarOpen ? "with-sidebar" : "full"}`}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
