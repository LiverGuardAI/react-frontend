// src/pages/Page3/Page3.jsx
import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./Page3.css";
import {
  getPatientAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment
} from "../../api/appointmentAPI";
import { Plus, X, Edit2, Trash2 } from "lucide-react";

const Page3 = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const [formData, setFormData] = useState({
    appointment_date: "",
    appointment_time: "",
    hospital: "",
    appointment_type: "blood_test",
    details: "",
    status: "scheduled"
  });

  const appointmentTypes = [
    { value: "blood_test", label: "혈액검사" },
    { value: "ct", label: "CT 검사" },
    { value: "mri", label: "MRI 검사" },
    { value: "ultrasound", label: "초음파 검사" },
    { value: "consultation", label: "진료 상담" },
    { value: "other", label: "기타" }
  ];

  const statusTypes = [
    { value: "scheduled", label: "예정" },
    { value: "completed", label: "완료" },
    { value: "cancelled", label: "취소" }
  ];

  // 일정 목록 불러오기
  useEffect(() => {
    fetchAppointments();
  }, []);

  // 선택된 날짜의 일정 필터링
  useEffect(() => {
    if (selectedDate) {
      const dateString = selectedDate.toISOString().split('T')[0];
      const filtered = appointments.filter(apt => apt.appointment_date === dateString);
      setFilteredAppointments(filtered);
    }
  }, [selectedDate, appointments]);

  const fetchAppointments = async () => {
    try {
      const patientId = localStorage.getItem("patient_id");
      const token = localStorage.getItem("access_token");

      if (!patientId) {
        console.error("Patient ID not found");
        return;
      }

      if (!token) {
        console.error("Access token not found - user may need to login");
        return;
      }

      const data = await getPatientAppointments(patientId);
      setAppointments(data);
    } catch (error) {
      console.error("일정 로딩 실패:", error);
      console.error("Error details:", error.response?.status, error.response?.data);

      // 401 에러면 토큰이 만료되었을 가능성
      if (error.response?.status === 401) {
        console.error("인증 실패 - 로그인이 필요합니다");
      }
    }
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  const handleAddClick = () => {
    setEditingAppointment(null);
    setFormData({
      appointment_date: selectedDate.toISOString().split('T')[0],
      appointment_time: "",
      hospital: "",
      appointment_type: "blood_test",
      details: "",
      status: "scheduled"
    });
    setShowModal(true);
  };

  const handleEditClick = (appointment) => {
    setEditingAppointment(appointment);
    setFormData({
      appointment_date: appointment.appointment_date,
      appointment_time: appointment.appointment_time || "",
      hospital: appointment.hospital,
      appointment_type: appointment.appointment_type,
      details: appointment.details || "",
      status: appointment.status
    });
    setShowModal(true);
  };

  const handleDeleteClick = async (appointmentId) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      try {
        await deleteAppointment(appointmentId);
        fetchAppointments();
      } catch (error) {
        console.error("일정 삭제 실패:", error);
        alert("일정 삭제에 실패했습니다.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const patientId = localStorage.getItem("patient_id");
      const token = localStorage.getItem("access_token");

      console.log("Creating appointment with patient_id:", patientId);
      console.log("Token exists:", !!token);

      const submitData = {
        ...formData,
        patient: patientId
      };

      if (editingAppointment) {
        await updateAppointment(editingAppointment.appointment_id, submitData);
      } else {
        await createAppointment(submitData);
      }

      setShowModal(false);
      fetchAppointments();
      setFormData({
        appointment_date: "",
        appointment_time: "",
        hospital: "",
        appointment_type: "blood_test",
        details: "",
        status: "scheduled"
      });
    } catch (error) {
      console.error("일정 저장 실패:", error);
      console.error("Error response:", error.response?.data);
      alert("일정 저장에 실패했습니다.");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // 캘린더에 일정 표시를 위한 함수
  const getTileContent = ({ date, view }) => {
    if (view === 'month') {
      const dateString = date.toISOString().split('T')[0];
      const dayAppointments = appointments.filter(apt => apt.appointment_date === dateString);

      if (dayAppointments.length > 0) {
        return (
          <div className="appointment-dots">
            {dayAppointments.slice(0, 3).map((apt, index) => (
              <div
                key={index}
                className={`appointment-dot ${apt.status}`}
                title={apt.hospital}
              />
            ))}
          </div>
        );
      }
    }
    return null;
  };

  const getAppointmentTypeLabel = (value) => {
    const type = appointmentTypes.find(t => t.value === value);
    return type ? type.label : value;
  };

  const getStatusLabel = (value) => {
    const status = statusTypes.find(s => s.value === value);
    return status ? status.label : value;
  };

  return (
    <div className="page3-container" style={{
      backgroundImage: "url(/images/background.avif)"
    }}>
      <div className="calendar-section">
        <div className="calendar-header">
          <h2>
            {currentMonth.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' })}
          </h2>
        </div>

        <Calendar
          onChange={handleDateClick}
          value={selectedDate}
          onActiveStartDateChange={({ activeStartDate }) => setCurrentMonth(activeStartDate)}
          tileContent={getTileContent}
          locale="ko-KR"
          formatDay={(locale, date) => date.getDate()}
        />

        <button className="add-appointment-btn" onClick={handleAddClick}>
          <Plus size={24} />
        </button>
      </div>

      <div className="appointments-section">
        <div className="appointments-header">
          <h2>
            {selectedDate.toLocaleDateString('ko-KR', {
              month: 'numeric',
              day: 'numeric',
              weekday: 'short'
            })}
          </h2>
          <span className="appointment-count">{filteredAppointments.length}개의 일정</span>
        </div>

        <div className="appointments-list">
          {filteredAppointments.length === 0 ? (
            <div className="no-appointments">
              <p>일정이 없습니다</p>
            </div>
          ) : (
            filteredAppointments.map((appointment) => (
              <div
                key={appointment.appointment_id}
                className={`appointment-card ${appointment.status}`}
              >
                <div className="appointment-time">
                  {appointment.appointment_time || "시간 미정"}
                </div>
                <div className="appointment-details">
                  <h3>{appointment.hospital}</h3>
                  <p className="appointment-type">
                    {getAppointmentTypeLabel(appointment.appointment_type)}
                  </p>
                  {appointment.details && (
                    <p className="appointment-notes">{appointment.details}</p>
                  )}
                  <span className={`status-badge ${appointment.status}`}>
                    {getStatusLabel(appointment.status)}
                  </span>
                </div>
                <div className="appointment-actions">
                  <button
                    className="edit-btn"
                    onClick={() => handleEditClick(appointment)}
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteClick(appointment.appointment_id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <button className="add-appointment-btn-mobile" onClick={handleAddClick}>
          <Plus size={24} />
        </button>
      </div>

      {/* 일정 추가/수정 모달 */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingAppointment ? "일정 수정" : "일정 추가"}</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>날짜 *</label>
                <input
                  type="date"
                  name="appointment_date"
                  value={formData.appointment_date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>시간</label>
                <input
                  type="time"
                  name="appointment_time"
                  value={formData.appointment_time}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>병원명 *</label>
                <input
                  type="text"
                  name="hospital"
                  value={formData.hospital}
                  onChange={handleChange}
                  placeholder="병원 이름을 입력하세요"
                  required
                />
              </div>

              <div className="form-group">
                <label>일정 유형 *</label>
                <select
                  name="appointment_type"
                  value={formData.appointment_type}
                  onChange={handleChange}
                  required
                >
                  {appointmentTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>상태</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  {statusTypes.map(status => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>메모</label>
                <textarea
                  name="details"
                  value={formData.details}
                  onChange={handleChange}
                  placeholder="추가 메모를 입력하세요"
                  rows="3"
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowModal(false)}
                >
                  취소
                </button>
                <button type="submit" className="submit-btn">
                  {editingAppointment ? "수정" : "추가"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page3;
