// src/pages/Login/Login.jsx
import React, { useState } from "react";
import axios from "axios";
import "./Login.css";

const Login = () => {
  const [doctorId, setDoctorId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8000/api/doctor/login/", {
        doctor_id: doctorId,
        password: password,
      },{ withCredentials: true } 
    );

      if (response.status === 200) {
        // 로그인 성공 시 doctor 정보 저장
        localStorage.setItem("doctor", JSON.stringify(response.data));
        alert(`${response.data.name} 님 환영합니다!`);
        window.location.href = "/dashboard";
      }
    } catch (err) {
      setError("아이디 또는 비밀번호가 올바르지 않습니다.");
    }
  };

  return (
    <div className="login-container">
      <h1 className="login-title">LiverGuard 로그인</h1>

      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="doctorId">의사 ID</label>
          <input
            type="text"
            id="doctorId"
            value={doctorId}
            onChange={(e) => setDoctorId(e.target.value)}
            placeholder="의사 ID를 입력하세요"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">비밀번호</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력하세요"
            required
          />
        </div>

        <button type="submit" className="login-button">
          로그인
        </button>

        {error && <p className="error-message">{error}</p>}
      </form>

      <div className="extra-links">
        <a href="#">비밀번호 찾기</a> | <a href="#">회원가입</a>
      </div>
    </div>
  );
};

export default Login;