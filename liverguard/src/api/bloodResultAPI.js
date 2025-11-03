
import api from "./axiosConfig";

/**
 * 혈액검사 결과 목록 조회
 * GET /api/dashboard/blood-results/
 */
export const getBloodResults = async () => {
  const response = await api.get("dashboard/blood-results/");
  return response.data;
};

/**
 * 특정 환자의 혈액검사 결과 조회
 * GET /api/dashboard/blood-results/:id/
 */
export const getBloodResultById = async (id) => {
  const response = await api.get(`dashboard/blood-results/${id}/`);
  return response.data;
};

/**
 * 새 혈액검사 결과 등록
 * POST /api/dashboard/blood-results/
 */
export const createBloodResult = async (data) => {
  const response = await api.post("dashboard/blood-results/", data);
  return response.data;
};

/**
 * 기존 혈액검사 결과 수정
 * PUT /api/dashboard/blood-results/:id/
 */
export const updateBloodResult = async (id, data) => {
  const response = await api.put(`dashboard/blood-results/${id}/`, data);
  return response.data;
};

/**
 * 혈액검사 결과 삭제
 * DELETE /api/dashboard/blood-results/:id/
 */
export const deleteBloodResult = async (id) => {
  const response = await api.delete(`dashboard/blood-results/${id}/`);
  return response.data;
};