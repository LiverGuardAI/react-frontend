import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { User, Lock, Mail } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { handleLogin } = useAuth();

  const [form, setForm] = useState({
    user_id: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

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
      console.log("🔵 로그인 시도:", form);
      await handleLogin(form);
      navigate("/page1");
    } catch (err) {
      console.error("로그인 실패:", err);
      console.error("에러 응답:", err.response);

      if (err.response?.data) {
        const errorMsg = typeof err.response.data === 'string'
          ? err.response.data
          : JSON.stringify(err.response.data);
        setError(`로그인 실패: ${errorMsg}`);
      } else if (err.message === 'Network Error') {
        setError("백엔드 서버에 연결할 수 없습니다.");
      } else {
        setError(`아이디 또는 비밀번호가 올바르지 않습니다.`);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-400 via-pink-300 to-blue-300">
      <div className="w-full max-w-md px-8">
        <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-10">
          {/* User Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
              <User className="text-white" size={40} />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">User Login</h2>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <Mail className="text-blue-500" size={20} />
              </div>
              <input
                type="text"
                name="user_id"
                placeholder="Email ID"
                value={form.user_id}
                onChange={handleChange}
                required
                className="w-full pl-12 pr-4 py-3 bg-white border-b-2 border-blue-300 focus:border-blue-500 outline-none transition-colors text-gray-700"
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <Lock className="text-blue-500" size={20} />
              </div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full pl-12 pr-4 py-3 bg-white border-b-2 border-blue-300 focus:border-blue-500 outline-none transition-colors text-gray-700"
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="mr-2 w-4 h-4 accent-blue-500"
                />
                <span className="text-gray-600">Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => alert('비밀번호 찾기 기능은 준비 중입니다.')}
                className="text-blue-500 hover:text-blue-700 transition-colors"
              >
                Forgot Password?
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              LOGIN
            </button>

            {/* Signup Link */}
            <p className="text-center text-gray-600 text-sm mt-6">
              계정이 없으신가요?{" "}
              <Link to="/signup" className="text-blue-500 hover:text-blue-700 font-semibold transition-colors">
                회원가입
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
