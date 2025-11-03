import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const { handleLogin } = useAuth();

  const [form, setForm] = useState({
    user_id: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await handleLogin(form); // useAuth 훅에서 로그인 + 사용자 정보 갱신
      alert("로그인 성공!");
      navigate("/page1"); // 로그인 후 이동할 페이지
    } catch (err) {
      console.error("로그인 실패:", err);
      setError("아이디 또는 비밀번호가 올바르지 않습니다.");
    }
  };

  return (
    <div className="login-container">
      <form className="login-box" onSubmit={handleSubmit}>
        <h2>LiverGuard</h2>

        <input
          type="text"
          name="user_id"
          placeholder="아이디"
          value={form.user_id}
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

        {error && <p className="error-text">{error}</p>}

        <button type="submit">로그인</button>

        <p className="signup-link">
          계정이 없으신가요?{" "}
          <Link to="/signup" className="link">
            회원가입
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;