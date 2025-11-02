import axios from "axios";

// ✅ 환경변수에서 baseURL 가져오기
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL, 
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ 요청 인터셉터 (선택: 토큰 추가 등)
api.interceptors.request.use(
  (config) => {
    // 예시: localStorage에 저장된 토큰 자동 첨부
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ 응답 인터셉터 (선택: 에러 처리)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API 요청 오류:", error);
    return Promise.reject(error);
  }
);

export default api;