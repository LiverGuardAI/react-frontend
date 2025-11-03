import api from "./axiosConfig";

/**
 * 회원가입 (Signup)
 * POST /api/auth/register/
 */
export const signup = async (userData) => {
  const response = await api.post("dashboard/auth/register/", userData);
  return response.data;
};

/**
 * 로그인 (Login)
 * POST /api/auth/login/
 */
export const login = async (credentials) => {
  console.log("🟢 로그인 요청 payload:", credentials); // 🔥 실제 전송 데이터 확인
  const response = await api.post("dashboard/auth/login/", credentials);
  const { access, refresh } = response.data;

  // 토큰 로컬 저장
  localStorage.setItem("access_token", access);
  localStorage.setItem("refresh_token", refresh);

  return response.data;
};

/**
 * 로그아웃 (Logout)
 * POST /api/auth/logout/
 */
export const logout = async () => {
  const refresh = localStorage.getItem("refresh_token");
  try {
    await api.post("dashboard/auth/logout/", { refresh }); // ✅ refresh 전송
  } catch (err) {
    console.error("로그아웃 실패:", err);
  } finally {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  }
};

/**
 * 토큰 갱신 (JWT Refresh)
 * POST /api/auth/token/refresh/
 */
export const refreshToken = async () => {
  const refresh = localStorage.getItem("refresh_token");
  if (!refresh) throw new Error("No refresh token found");

  const response = await api.post("dashboard/auth/token/refresh/", { refresh });
  localStorage.setItem("access_token", response.data.access);
  return response.data;
};

/**
 * 사용자 정보 조회 (Profile)
 * GET /api/auth/user/
 */
export const getUserInfo = async () => {
  const response = await api.get("dashboard/auth/user/");
  return response.data;
};