// src/pages/Home/Home.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const navigate = useNavigate();
  const doctor = JSON.parse(localStorage.getItem("doctor"));

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/doctor/session/", {
          withCredentials: true,
        });
        if (!res.data.is_authenticated) {
          alert("로그인이 필요합니다.");
          navigate("/login");
        }
      } catch (err) {
        console.error("세션 확인 실패:", err);
        navigate("/login");
      }
    };

    fetchSession();
  }, [navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>🏠 환영합니다, {doctor.name} LiverGuard Home</h1>
      <p>이 페이지는 로그인한 사용자만 접근할 수 있습니다.</p>
    </div>
  );
};

export default Home;