// src/api/appointmentAPI.js
import api from "./axiosConfig";

// 특정 환자의 일정 목록 조회
export const getPatientAppointments = async (patientId) => {
  const response = await api.get(`dashboard/patients/${patientId}/appointments/`);
  return response.data;
};

// 모든 일정 목록 조회
export const getAllAppointments = async () => {
  const response = await api.get("dashboard/appointments/");
  return response.data;
};

// 일정 생성
export const createAppointment = async (appointmentData) => {
  const response = await api.post("dashboard/appointments/", appointmentData);
  return response.data;
};

// 일정 수정
export const updateAppointment = async (appointmentId, appointmentData) => {
  const response = await api.put(`dashboard/appointments/${appointmentId}/`, appointmentData);
  return response.data;
};

// 일정 부분 수정
export const patchAppointment = async (appointmentId, appointmentData) => {
  const response = await api.patch(`dashboard/appointments/${appointmentId}/`, appointmentData);
  return response.data;
};

// 일정 삭제
export const deleteAppointment = async (appointmentId) => {
  const response = await api.delete(`dashboard/appointments/${appointmentId}/`);
  return response.data;
};

// 일정 상세 조회
export const getAppointmentDetail = async (appointmentId) => {
  const response = await api.get(`dashboard/appointments/${appointmentId}/`);
  return response.data;
};
