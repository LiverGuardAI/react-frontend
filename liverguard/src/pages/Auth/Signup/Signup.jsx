import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signup } from "../../../api/authAPI";
import "./Signup.css";

const Signup = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    user_id: "",
    name: "",
    birth_date: "",
    sex: "",
    phone: "",
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
        user_id: form.user_id,
        name: form.name,
        birth_date: form.birth_date,
        sex: form.sex,
        phone: form.phone,
        password: form.password,
        password2: form.password2,
      });
      setSuccess("회원가입이 완료되었습니다!");
      setTimeout(() => navigate("/login"), 1000);
      console.log(1)
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
          name="user_id"
          placeholder="아이디"
          value={form.id}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="name"
          placeholder="이름"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          type="date"
          name="birth_date"
          placeholder="생년월일"
          value={form.birth_date}
          onChange={handleChange}
          required
        />

        <select
          name="sex"
          value={form.sex}
          onChange={handleChange}
          required
        >
          <option value="">성별 선택</option>
          <option value="male">남성</option>
          <option value="female">여성</option>
        </select>

        <input
          type="text"
          name="phone"
          placeholder="번호"
          value={form.phone}
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
