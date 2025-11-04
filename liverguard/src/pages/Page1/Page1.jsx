import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserInfo } from "../../api/authAPI";
import { getBloodResults } from "../../api/bloodResultAPI";
import "./Page1.css";

const Page1 = () => {
  const navigate = useNavigate();
  const [activeOrgan, setActiveOrgan] = useState(null);
  const [ripples, setRipples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bloodTestResults, setBloodTestResults] = useState({});
  const [userInfo, setUserInfo] = useState({
    name: "사용자",
    birth_date: "",
    sex: "",
    height: null,
    weight: null
  });

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('access_token');
    if (!token) {
      // Redirect to login if not authenticated
      navigate('/login');
      return;
    }

    // Fetch user information and blood test results
    const fetchData = async () => {
      try {
        setLoading(true);

        // 사용자 정보 가져오기
        const userData = await getUserInfo();
        setUserInfo(userData);
        if (userData.name) {
          localStorage.setItem("user_name", userData.name);
        }

        // 혈액검사 결과 가져오기
        const patient_id = localStorage.getItem("patient_id");
        if (patient_id) {
          const bloodData = await getBloodResults();
          const patientData = (Array.isArray(bloodData) ? bloodData : [])
            .filter((item) => item.patient === patient_id)
            .sort((a, b) => new Date(b.taken_at) - new Date(a.taken_at));

          // 가장 최근 검사 결과 사용
          if (patientData.length > 0) {
            const latest = patientData[0];
            const results = convertToTestResults(latest, patientData);
            setBloodTestResults(results);
          }
        }
      } catch (error) {
        console.error("데이터 로딩 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  // API 데이터를 테스트 결과 형식으로 변환
  const convertToTestResults = (latest, history) => {
    const getTrend = (currentValue, fieldName) => {
      if (history.length < 2) return 'stable';
      const previous = history[1][fieldName];
      if (!previous || !currentValue) return 'stable';
      if (currentValue > previous) return 'up';
      if (currentValue < previous) return 'down';
      return 'stable';
    };

    const getStatus = (value, min, max) => {
      if (!value) return 'normal';
      if (value < min) return 'low';
      if (value > max) return 'high';
      return 'normal';
    };

    return {
      'AST': {
        value: latest.ast || 0,
        normal: [0, 40],
        unit: 'U/L',
        status: getStatus(latest.ast, 0, 40),
        trend: getTrend(latest.ast, 'ast')
      },
      'ALT': {
        value: latest.alt || 0,
        normal: [0, 41],
        unit: 'U/L',
        status: getStatus(latest.alt, 0, 41),
        trend: getTrend(latest.alt, 'alt')
      },
      'ALP': {
        value: latest.alp || 0,
        normal: [30, 120],
        unit: 'U/L',
        status: getStatus(latest.alp, 30, 120),
        trend: getTrend(latest.alp, 'alp')
      },
      'GGT': {
        value: latest.ggt || 0,
        normal: [0, 51],
        unit: 'U/L',
        status: getStatus(latest.ggt, 0, 51),
        trend: getTrend(latest.ggt, 'ggt')
      },
      'Bilirubin': {
        value: latest.bilirubin || 0,
        normal: [0.2, 1.2],
        unit: 'mg/dL',
        status: getStatus(latest.bilirubin, 0.2, 1.2),
        trend: getTrend(latest.bilirubin, 'bilirubin')
      },
      'Albumin': {
        value: latest.albumin || 0,
        normal: [3.5, 5.5],
        unit: 'g/dL',
        status: getStatus(latest.albumin, 3.5, 5.5),
        trend: getTrend(latest.albumin, 'albumin')
      },
      'INR': {
        value: latest.inr || 0,
        normal: [0.8, 1.2],
        unit: '',
        status: getStatus(latest.inr, 0.8, 1.2),
        trend: getTrend(latest.inr, 'inr')
      },
      'Platelet': {
        value: latest.platelet || 0,
        normal: [150, 400],
        unit: '×10³/μL',
        status: getStatus(latest.platelet, 150, 400),
        trend: getTrend(latest.platelet, 'platelet')
      },
      'AFP': {
        value: latest.afp || 0,
        normal: [0, 10],
        unit: 'ng/mL',
        status: getStatus(latest.afp, 0, 10),
        trend: getTrend(latest.afp, 'afp')
      },
      'ALBI': {
        value: latest.albi_score || 0,
        normal: [-2.6, -1.4],
        unit: '',
        status: getStatus(latest.albi_score, -2.6, -1.4),
        trend: getTrend(latest.albi_score, 'albi_score')
      }
    };
  };

  const handleOrganClick = (organ, event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const newRipple = {
      id: Date.now(),
      x,
      y,
      color: organ.color
    };

    setRipples(prev => [...prev, newRipple]);
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id));
    }, 1000);

    scrollToOrgan(organ.id);
  };

  const scrollToOrgan = (organId) => {
    setActiveOrgan(organId);
    const element = document.getElementById(organId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const organs = [
    {
      id: 'liver',
      label: '간',
      x: 58,
      y: 42,
      color: '#1ECBE1',  // Cyan
      tests: ['AST', 'ALT', 'ALP', 'GGT', 'Bilirubin', 'Albumin', 'ALBI']
    },
    {
      id: 'blood',
      label: '혈액/응고',
      x: 43,
      y: 38,
      color: '#EC4899',  // Pink
      tests: ['INR', 'Platelet']
    },
    {
      id: 'tumor',
      label: '종양표지자',
      x: 52,
      y: 45,
      color: '#8B5CF6',  // Purple
      tests: ['AFP']
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'high': return '#EF4444';
      case 'low': return '#F59E0B';
      default: return '#10B981';
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return '↑';
      case 'down': return '↓';
      default: return '→';
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

  if (loading) {
    return (
      <div className="page1-container" style={{ backgroundImage: 'url(/images/background.avif)' }}>
        <div className="page1-content">
          <div style={{ textAlign: 'center', padding: '50px', color: 'white' }}>
            로딩 중...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page1-container" style={{ backgroundImage: 'url(/images/background.avif)' }}>
      <div className="page1-content">
        <h2 className="page1-title">신체 부위별 검사 결과</h2>
        <p className="page1-subtitle">장기를 클릭하여 관련 혈액검사 결과를 확인하세요</p>

        <div className="body-diagram-row">
          {/* Body Diagram Container */}
          <div className="body-diagram-container">
            <div className="body-diagram">
              <img
                src="/images/body-diagram.png"
                alt="Human Body Diagram"
                className="body-image"
              />

              {/* Interactive Organ Hotspots */}
              {organs.map((organ) => (
                <div
                  key={organ.id}
                  className="organ-hotspot"
                  style={{
                    left: `${organ.x}%`,
                    top: `${organ.y}%`,
                  }}
                  onClick={(e) => handleOrganClick(organ, e)}
                  onMouseEnter={() => setActiveOrgan(organ.id)}
                  onMouseLeave={() => setActiveOrgan(null)}
                >
                  {/* Pulsing Circle */}
                  <div className={`organ-circle ${activeOrgan === organ.id ? 'active' : ''}`}>
                    {/* Outer Glow */}
                    <div
                      className="organ-glow"
                      style={{
                        backgroundColor: organ.color,
                        transform: activeOrgan === organ.id ? 'scale(1.5)' : 'scale(1)',
                      }}
                    />

                    {/* Main Circle */}
                    <div
                      className="organ-main"
                      style={{
                        backgroundColor: organ.color,
                        transform: activeOrgan === organ.id ? 'scale(1.2)' : 'scale(1)',
                        boxShadow: activeOrgan === organ.id ? `0 0 30px ${organ.color}` : '0 4px 6px rgba(0,0,0,0.1)'
                      }}
                    >
                      <div className="organ-dot" />
                    </div>

                    {/* Label Tooltip */}
                    {activeOrgan === organ.id && (
                      <div
                        className="organ-tooltip"
                        style={{
                          backgroundColor: organ.color,
                        }}
                      >
                        <span className="organ-label">{organ.label}</span>
                        <div
                          className="organ-arrow"
                          style={{
                            borderTop: `6px solid ${organ.color}`
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Ripple Effects */}
              {ripples.map((ripple) => (
                <div
                  key={ripple.id}
                  className="ripple-container"
                  style={{
                    left: ripple.x,
                    top: ripple.y,
                  }}
                >
                  <div
                    className="ripple-effect"
                    style={{
                      backgroundColor: ripple.color,
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Patient Profile Card */}
          <div className="patient-profile-card">
            <h3 className="profile-title">{userInfo.name} 님의 건강 프로필</h3>
            <div className="profile-content">
              <div className="profile-item">
                <span className="profile-label">이름</span>
                <span className="profile-value">{userInfo.name}</span>
              </div>
              <div className="profile-item">
                <span className="profile-label">나이</span>
                <span className="profile-value">
                  {calculateAge(userInfo.birth_date) ? `${calculateAge(userInfo.birth_date)}세` : '-'}
                </span>
              </div>
              <div className="profile-item">
                <span className="profile-label">성별</span>
                <span className="profile-value">{userInfo.sex === 'male' ? '남성' : userInfo.sex === 'female' ? '여성' : '-'}</span>
              </div>
              <div className="profile-item">
                <span className="profile-label">신장/체중</span>
                <span className="profile-value">
                  {userInfo.height && userInfo.weight
                    ? `${userInfo.height}cm / ${userInfo.weight}kg`
                    : '-'}
                </span>
              </div>
            </div>

            <button
              className="add-test-btn"
              onClick={() => navigate('/page2')}
            >
              <span className="btn-icon">+</span>
              검사 추가 및 수정
            </button>
          </div>
        </div>

          {/* Test Results Section */}
          <div className="test-results-container">
            {Object.keys(bloodTestResults).length === 0 ? (
              <div style={{ textAlign: 'center', padding: '50px', color: 'white', fontSize: '18px' }}>
                <p>혈액검사 결과가 없습니다.</p>
                <p style={{ marginTop: '10px', fontSize: '14px', opacity: 0.8 }}>
                  '검사 추가 및 수정' 버튼을 눌러 혈액검사 결과를 추가해주세요.
                </p>
              </div>
            ) : (
              organs.map((organ) => (
              <div key={organ.id} id={organ.id} className="organ-section">
                <div className="organ-header">
                  <div
                    className="organ-color-indicator"
                    style={{ backgroundColor: organ.color }}
                  />
                  <h3 className="organ-title">{organ.label} 관련 검사</h3>
                </div>

                <div className="test-cards">
                  {organ.tests.map((testName) => {
                    const test = bloodTestResults[testName];
                    if (!test) return null;

                    const percentage = test.normal[1] > 0
                      ? Math.min((test.value / test.normal[1]) * 100, 100)
                      : 50;

                    return (
                      <div key={testName} className="test-card">
                        <div className="test-card-header">
                          <div>
                            <h4 className="test-name">{testName}</h4>
                            <p className="test-normal">
                              정상: {test.normal[0]} - {test.normal[1]} {test.unit}
                            </p>
                          </div>
                          <span className="test-trend">{getTrendIcon(test.trend)}</span>
                        </div>

                        <div className="test-value-container">
                          <div className="test-value-row">
                            <span className="test-value" style={{ color: getStatusColor(test.status) }}>
                              {test.value}
                            </span>
                            <span className="test-unit">{test.unit}</span>
                          </div>

                          <div className="test-progress-bar">
                            <div
                              className="test-progress-fill"
                              style={{
                                width: `${percentage}%`,
                                backgroundColor: getStatusColor(test.status)
                              }}
                            />
                          </div>
                        </div>

                        {test.status !== 'normal' && (
                          <div className="test-warning">
                            <span className="warning-icon">⚠</span>
                            <p className="warning-text">
                              {test.status === 'high' ? '정상 범위보다 높습니다' : '정상 범위보다 낮습니다'}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              ))
            )}
          </div>
      </div>
    </div>
  );
};

export default Page1;
