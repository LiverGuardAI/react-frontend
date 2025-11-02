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

  return (
    <div className="layout">
      <Topbar toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} />
      <main className={`main-content ${isSidebarOpen ? "with-sidebar" : "full"}`}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
