import api from "./axiosConfig";

/**
 * 혈액검사 결과 목록 조회
 * GET /api/bloodresult/
 */
export const getBloodResults = async () => {
  const response = await api.get("bloodresult/");
  return response.data;
};

/**
 * 특정 환자의 혈액검사 결과 조회
 * GET /api/bloodresult/:id/
 */
export const getBloodResultById = async (id) => {
  const response = await api.get(`bloodresult/${id}/`);
  return response.data;
};

/**
 * 새 혈액검사 결과 등록
 * POST /api/bloodresult/
 */
export const createBloodResult = async (data) => {
  const response = await api.post("bloodresult/", data);
  return response.data;
};

/**
 * 기존 혈액검사 결과 수정
 * PUT /api/bloodresult/:id/
 */
export const updateBloodResult = async (id, data) => {
  const response = await api.put(`bloodresult/${id}/`, data);
  return response.data;
};

/**
 * 혈액검사 결과 삭제
 * DELETE /api/bloodresult/:id/
 */
export const deleteBloodResult = async (id) => {
  const response = await api.delete(`bloodresult/${id}/`);
  return response.data;
};