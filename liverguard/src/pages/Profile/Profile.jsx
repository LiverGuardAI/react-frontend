// src/pages/Profile/Profile.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserInfo } from "../../api/authAPI";
import api from "../../api/axiosConfig";
import "./Profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    birth_date: "",
    sex: "",
    phone: "",
    address: "",
    height: "",
    weight: ""
  });

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login');
      return;
    }

    fetchUserInfo();
  }, [navigate]);

  const fetchUserInfo = async () => {
    try {
      setIsLoading(true);
      const userData = await getUserInfo();
      setFormData({
        name: userData.name || "",
        birth_date: userData.birth_date || "",
        sex: userData.sex || "",
        phone: userData.phone || "",
        address: userData.address || "",
        height: userData.height || "",
        weight: userData.weight || ""
      });
    } catch (error) {
      console.error("사용자 정보 로딩 실패:", error);
      alert("사용자 정보를 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (window.confirm("개인정보를 수정하시겠습니까?")) {
      try {
        setIsSaving(true);
        const patientId = localStorage.getItem("patient_id");

        // PATCH 요청으로 수정 가능한 필드만 전송
        const updateData = {
          phone: formData.phone,
          address: formData.address,
          height: formData.height ? parseFloat(formData.height) : null,
          weight: formData.weight ? parseFloat(formData.weight) : null
        };

        await api.patch(`dashboard/patients/${patientId}/`, updateData);

        alert("개인정보가 성공적으로 수정되었습니다.");
        fetchUserInfo(); // 수정 후 데이터 새로고침
      } catch (error) {
        console.error("개인정보 수정 실패:", error);
        console.error("Error response:", error.response?.data);
        alert("개인정보 수정에 실패했습니다.");
      } finally {
        setIsSaving(false);
      }
    }
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return '';
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  if (isLoading) {
    return (
      <div className="profile-container" style={{ backgroundImage: 'url(/images/background.avif)' }}>
        <div className="profile-loading">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="profile-container" style={{ backgroundImage: 'url(/images/background.avif)' }}>
      <div className="profile-content">
        <div className="profile-header">
          <h2 className="profile-title">개인정보 수정</h2>
          <p className="profile-subtitle">회원님의 개인정보를 관리하실 수 있습니다</p>
        </div>

        <form className="profile-form" onSubmit={handleSubmit}>
          {/* 읽기 전용 필드 */}
          <div className="form-section">
            <h3 className="section-title">기본 정보 (수정 불가)</h3>

            <div className="form-group">
              <label className="form-label">이름</label>
              <input
                type="text"
                className="form-input readonly"
                value={formData.name}
                readOnly
              />
            </div>

            <div className="form-group">
              <label className="form-label">생년월일</label>
              <div className="input-with-info">
                <input
                  type="date"
                  className="form-input readonly"
                  value={formData.birth_date}
                  readOnly
                />
                <span className="info-badge">
                  {calculateAge(formData.birth_date) ? `${calculateAge(formData.birth_date)}세` : ''}
                </span>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">성별</label>
              <input
                type="text"
                className="form-input readonly"
                value={formData.sex === 'male' ? '남성' : formData.sex === 'female' ? '여성' : ''}
                readOnly
              />
            </div>
          </div>

          {/* 수정 가능 필드 */}
          <div className="form-section">
            <h3 className="section-title">연락처 정보</h3>

            <div className="form-group">
              <label className="form-label">전화번호</label>
              <input
                type="tel"
                name="phone"
                className="form-input"
                value={formData.phone}
                onChange={handleChange}
                placeholder="010-0000-0000"
              />
            </div>

            <div className="form-group">
              <label className="form-label">주소</label>
              <input
                type="text"
                name="address"
                className="form-input"
                value={formData.address}
                onChange={handleChange}
                placeholder="주소를 입력하세요"
              />
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">신체 정보</h3>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">신장 (cm)</label>
                <input
                  type="number"
                  name="height"
                  className="form-input"
                  value={formData.height}
                  onChange={handleChange}
                  placeholder="예: 175"
                  step="0.1"
                  min="0"
                  max="300"
                />
              </div>

              <div className="form-group">
                <label className="form-label">체중 (kg)</label>
                <input
                  type="number"
                  name="weight"
                  className="form-input"
                  value={formData.weight}
                  onChange={handleChange}
                  placeholder="예: 70"
                  step="0.1"
                  min="0"
                  max="500"
                />
              </div>
            </div>

            {formData.height && formData.weight && (
              <div className="bmi-info">
                <span className="bmi-label">BMI: </span>
                <span className="bmi-value">
                  {(formData.weight / Math.pow(formData.height / 100, 2)).toFixed(1)}
                </span>
              </div>
            )}
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={() => navigate('/page1')}
              disabled={isSaving}
            >
              취소
            </button>
            <button
              type="submit"
              className="btn-submit"
              disabled={isSaving}
            >
              {isSaving ? '저장 중...' : '저장하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
