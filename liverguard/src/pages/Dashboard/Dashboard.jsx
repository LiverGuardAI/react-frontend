// src/pages/Dashboard/Dashboard.jsx
import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";  // 추가
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const doctor = JSON.parse(localStorage.getItem("doctor")); // 로그인 성공 시 저장된 정보

  const handleLogout = async () => {
    try {
      // Django 세션 로그아웃 요청
      await axios.post(
        "http://localhost:8000/api/doctor/logout/",
        {},
        { withCredentials: true } // 세션 쿠키 포함
      );

      // 클라이언트 저장 정보 정리
      localStorage.removeItem("doctor");

      // 로그인 페이지로 이동
      navigate("/login");
    } catch (err) {
      console.error("로그아웃 실패:", err);
      alert("로그아웃 중 오류가 발생했습니다.");
    }
  };

  const handleGoHome = () => {
    navigate("/home"); // 홈 페이지로 이동
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">LiverGuard 대시보드</h1>

      {doctor ? (
        <div className="doctor-info">
          <p><strong>이름:</strong> {doctor.name}</p>
          <p><strong>직책:</strong> {doctor.position}</p>
          <p><strong>병원:</strong> {doctor.hospital || "미등록"}</p>
          <p><strong>상태:</strong> {doctor.status === "on_duty" ? "근무중" : "대기/비번"}</p>
        </div>
      ) : (
        <p>의사 정보를 불러올 수 없습니다.</p>
      )}

      <div className="button-group">
        <button onClick={handleGoHome} className="home-button">
          홈으로 이동
        </button>
        <button onClick={handleLogout} className="logout-button">
          로그아웃
        </button>
      </div>
    </div>
  );
};

export default Dashboard;