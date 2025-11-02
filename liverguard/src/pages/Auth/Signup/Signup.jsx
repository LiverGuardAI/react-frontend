import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signup } from "../../../api/authAPI";
import "./Signup.css";

const Signup = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (form.password !== form.password2) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      await signup({
        username: form.username,
        email: form.email,
        password: form.password,
      });
      setSuccess("회원가입이 완료되었습니다!");
      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      console.error("회원가입 실패:", err);
      setError("회원가입 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-box" onSubmit={handleSubmit}>
        <h2>회원가입</h2>

        <input
          type="text"
          name="username"
          placeholder="아이디"
          value={form.username}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="이메일"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="비밀번호"
          value={form.password}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password2"
          placeholder="비밀번호 확인"
          value={form.password2}
          onChange={handleChange}
          required
        />

        {error && <p className="error-text">{error}</p>}
        {success && <p className="success-text">{success}</p>}

        <button type="submit">회원가입</button>

        <p className="login-link">
          이미 계정이 있으신가요?{" "}
          <Link to="/login" className="link">
            로그인
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
