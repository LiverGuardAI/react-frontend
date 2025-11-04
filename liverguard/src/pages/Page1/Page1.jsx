import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserInfo } from "../../api/authAPI";
import "./Page1.css";

const Page1 = () => {
  const navigate = useNavigate();
  const [activeOrgan, setActiveOrgan] = useState(null);
  const [ripples, setRipples] = useState([]);
  const [userInfo, setUserInfo] = useState({
    name: "사용자",
    birth_date: "",
    sex: "",
    phone: ""
  });

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('access_token');
    if (!token) {
      // Redirect to login if not authenticated
      navigate('/login');
      return;
    }

    // Fetch user information
    const fetchUserInfo = async () => {
      try {
        const userData = await getUserInfo();
        setUserInfo(userData);
      } catch (error) {
        console.error("사용자 정보 로딩 실패:", error);
      }
    };

    fetchUserInfo();
  }, [navigate]);

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
      x: 55,
      y: 48,
      color: '#8B5CF6',
      tests: ['AST', 'ALT', 'ALP', 'GGT', 'Bilirubin', 'Albumin', 'ALBI']
    },
    {
      id: 'blood',
      label: '혈액/응고',
      x: 40,
      y: 35,
      color: '#EC4899',
      tests: ['INR', 'Platelet']
    },
    {
      id: 'tumor',
      label: '종양표지자',
      x: 50,
      y: 55,
      color: '#06B6D4',
      tests: ['AFP']
    }
  ];

  const bloodTestResults = {
    'AST': { value: 35, normal: [0, 40], unit: 'U/L', status: 'normal', trend: 'stable' },
    'ALT': { value: 42, normal: [0, 41], unit: 'U/L', status: 'high', trend: 'up' },
    'ALP': { value: 85, normal: [30, 120], unit: 'U/L', status: 'normal', trend: 'down' },
    'GGT': { value: 55, normal: [0, 51], unit: 'U/L', status: 'high', trend: 'up' },
    'Bilirubin': { value: 1.2, normal: [0.2, 1.2], unit: 'mg/dL', status: 'normal', trend: 'stable' },
    'Albumin': { value: 4.0, normal: [3.5, 5.5], unit: 'g/dL', status: 'normal', trend: 'stable' },
    'INR': { value: 1.1, normal: [0.8, 1.2], unit: '', status: 'normal', trend: 'stable' },
    'Platelet': { value: 185, normal: [150, 400], unit: '×10³/μL', status: 'normal', trend: 'stable' },
    'AFP': { value: 8.5, normal: [0, 10], unit: 'ng/mL', status: 'normal', trend: 'down' },
    'ALBI': { value: -2.5, normal: [-2.6, -1.4], unit: '', status: 'normal', trend: 'stable' }
  };

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

  return (
    <div className="page1-container">
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

          {/* Test Results Section */}
          <div className="test-results-container">
            {organs.map((organ) => (
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
            ))}
          </div>
        </div>
      </div>
    </div>
      );
};

      export default Page1;
