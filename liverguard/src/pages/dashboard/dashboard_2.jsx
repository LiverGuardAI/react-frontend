import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getBloodResults } from "../../api/bloodResultAPI";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./dashboard_2.css";

const Dashboard2 = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [availableDates, setAvailableDates] = useState([]);
  const [selectedDates, setSelectedDates] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const patient_id = localStorage.getItem("patient_id");
      if (!patient_id) {
        setError("환자 정보가 없습니다.");
        return;
      }

      const res = await getBloodResults();
      const patientData = (Array.isArray(res) ? res : [])
        .filter((item) => item.patient === patient_id)
        .sort((a, b) => new Date(a.taken_at) - new Date(b.taken_at));

      setAllData(patientData);
      setFilteredData(patientData);

      const dates = patientData.map((item) => item.taken_at);
      setAvailableDates(dates);
      setSelectedDates(dates);

      setError(null);
    } catch (err) {
      setError("데이터를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const filtered = allData.filter((item) =>
      selectedDates.includes(item.taken_at)
    );
    setFilteredData(filtered);
  }, [selectedDates, allData]);

  const toggleDate = (date) => {
    if (selectedDates.includes(date)) {
      setSelectedDates(selectedDates.filter((d) => d !== date));
    } else {
      setSelectedDates([...selectedDates, date].sort());
    }
  };

  const selectAllDates = () => {
    setSelectedDates(availableDates);
  };

  const clearAllDates = () => {
    setSelectedDates([]);
  };

  const totalTests = filteredData.length;
  const latestTestDate =
    filteredData.length > 0
      ? filteredData[filteredData.length - 1].taken_at
      : "N/A";

  const countAbnormal = () => {
    if (filteredData.length === 0) return 0;
    const latest = filteredData[filteredData.length - 1];
    let count = 0;

    if (latest.ast && (latest.ast < 5 || latest.ast > 40)) count++;
    if (latest.alt && (latest.alt < 5 || latest.alt > 40)) count++;
    if (latest.alp && (latest.alp < 30 || latest.alp > 120)) count++;
    if (latest.ggt && (latest.ggt < 7 || latest.ggt > 50)) count++;
    if (latest.bilirubin && (latest.bilirubin < 0.1 || latest.bilirubin > 1.2))
      count++;
    if (latest.albumin && (latest.albumin < 3.5 || latest.albumin > 5.5))
      count++;
    if (latest.platelet && (latest.platelet < 150 || latest.platelet > 450))
      count++;

    return count;
  };

  const lineChartData = filteredData.map((item) => ({
    date: item.taken_at,
    AST: parseFloat(item.ast),
    ALT: parseFloat(item.alt),
    GGT: parseFloat(item.ggt),
    ALP: parseFloat(item.alp),
  }));

  const albiChartData = filteredData.map((item) => ({
    date: item.taken_at,
    ALBI: parseFloat(item.albi),
  }));

  const plateletChartData = filteredData.map((item) => ({
    date: item.taken_at,
    Platelet: parseFloat(item.platelet),
  }));

  // 위험도 점수 계산 (B안: 가중치 + 단계점수 + 안전장치)
  const calculateRiskScore = () => {
    if (filteredData.length === 0) return { score: 0, level: '안전', hasGuardrail: false, afpAlert: false, details: [] };

    const latest = filteredData[filteredData.length - 1];
    let score = 0;
    let details = [];
    let guardrailTriggered = false;
    let criticalCount = 0;
    let afpAlert = false;

    // 가중치 2 지표들 (간 기능 핵심)
    // Albumin (정상: 3.5-5.5 g/dL)
    if (latest.albumin) {
      const albumin = parseFloat(latest.albumin);
      if (albumin < 2.0) {
        score += 2 * 2; // 매우위험
        details.push({ name: 'Albumin', level: '매우위험', value: albumin });
        criticalCount++;
        if (albumin < 2.0) guardrailTriggered = true;
      } else if (albumin < 3.5) {
        score += 2 * 1; // 위험
        details.push({ name: 'Albumin', level: '위험', value: albumin });
        criticalCount++;
      }
    }

    // INR (정상: 0.8-1.1)
    if (latest.inr) {
      const inr = parseFloat(latest.inr);
      if (inr >= 2.0) {
        score += 2 * 2; // 매우위험
        details.push({ name: 'INR', level: '매우위험', value: inr });
        criticalCount++;
        guardrailTriggered = true;
      } else if (inr > 1.1) {
        score += 2 * 1; // 위험
        details.push({ name: 'INR', level: '위험', value: inr });
        criticalCount++;
      }
    }

    // Total Bilirubin (정상: 0.1-1.2 mg/dL)
    if (latest.bilirubin) {
      const bilirubin = parseFloat(latest.bilirubin);
      if (bilirubin >= 2.5) {
        score += 2 * 2; // 매우위험
        details.push({ name: 'Bilirubin', level: '매우위험', value: bilirubin });
        criticalCount++;
        guardrailTriggered = true;
      } else if (bilirubin > 1.2) {
        score += 2 * 1; // 위험
        details.push({ name: 'Bilirubin', level: '위험', value: bilirubin });
        criticalCount++;
      }
    }

    // Platelet (정상: 150-450 천/µL)
    if (latest.platelet) {
      const platelet = parseFloat(latest.platelet);
      if (platelet < 75) {
        score += 2 * 2; // 매우위험
        details.push({ name: 'Platelet', level: '매우위험', value: platelet });
        criticalCount++;
        guardrailTriggered = true;
      } else if (platelet < 150) {
        score += 2 * 1; // 위험
        details.push({ name: 'Platelet', level: '위험', value: platelet });
        criticalCount++;
      }
    }

    // 가중치 1 지표들 (간 효소)
    // AST (정상: 5-40 U/L)
    if (latest.ast) {
      const ast = parseFloat(latest.ast);
      if (ast >= 120) {
        score += 1 * 2; // 매우위험 (정상 상한의 3배)
        details.push({ name: 'AST', level: '매우위험', value: ast });
      } else if (ast > 40) {
        score += 1 * 1; // 위험
        details.push({ name: 'AST', level: '위험', value: ast });
      }
    }

    // ALT (정상: 5-40 U/L)
    if (latest.alt) {
      const alt = parseFloat(latest.alt);
      if (alt >= 120) {
        score += 1 * 2; // 매우위험
        details.push({ name: 'ALT', level: '매우위험', value: alt });
      } else if (alt > 40) {
        score += 1 * 1; // 위험
        details.push({ name: 'ALT', level: '위험', value: alt });
      }
    }

    // ALP (정상: 30-120 U/L)
    if (latest.alp) {
      const alp = parseFloat(latest.alp);
      if (alp >= 360) {
        score += 1 * 2; // 매우위험
        details.push({ name: 'ALP', level: '매우위험', value: alp });
      } else if (alp > 120) {
        score += 1 * 1; // 위험
        details.push({ name: 'ALP', level: '위험', value: alp });
      }
    }

    // GGT (정상: 7-50 U/L)
    if (latest.ggt) {
      const ggt = parseFloat(latest.ggt);
      if (ggt >= 150) {
        score += 1 * 2; // 매우위험
        details.push({ name: 'GGT', level: '매우위험', value: ggt });
      } else if (ggt > 50) {
        score += 1 * 1; // 위험
        details.push({ name: 'GGT', level: '위험', value: ggt });
      }
    }

    // AFP (가중치 1, 별도 경보)
    if (latest.afp) {
      const afp = parseFloat(latest.afp);
      if (afp >= 100) {
        score += 1 * 2; // 매우위험
        details.push({ name: 'AFP', level: '매우위험', value: afp });
        afpAlert = true;
      } else if (afp > 20) {
        score += 1 * 1; // 위험
        details.push({ name: 'AFP', level: '위험', value: afp });
        afpAlert = true;
      }
    }

    // 안전장치: 핵심 4개 중 2개 이상 위험 이상
    if (criticalCount >= 2) {
      guardrailTriggered = true;
    }

    // 판정 기준
    let level = '안전';
    if (guardrailTriggered || score >= 8) {
      level = '위험';
    } else if (score >= 4) {
      level = '주의';
    }

    return {
      score,
      level,
      hasGuardrail: guardrailTriggered,
      afpAlert,
      details,
      criticalCount
    };
  };

  const riskAssessment = calculateRiskScore();

  if (loading) return <div className="dashboard2-container">로딩 중...</div>;
  if (error)
    return <div className="dashboard2-container error">{error}</div>;

  return (
    <div className="dashboard2-container" style={{
      backgroundImage: "url(/images/background.avif)",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundAttachment: "fixed",
      backgroundRepeat: "no-repeat"
    }}>
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "linear-gradient(to bottom right, rgba(250, 245, 255, 0.5), rgba(255, 255, 255, 0.5), rgba(239, 246, 255, 0.5))",
        zIndex: 0,
        pointerEvents: "none"
      }} />
      <div style={{ position: "relative", zIndex: 1 }}>
      <div className="dashboard2-header">
        <button className="back-button" onClick={() => navigate("/dashboard1")}>
          ← 뒤로가기
        </button>
        <h1>혈액 검사 전체 대시보드</h1>
        <div className="date-filter-wrapper">
          <button
            className="date-filter-button"
            onClick={() => setShowDatePicker(!showDatePicker)}
          >
            날짜 필터 ({selectedDates.length}/{availableDates.length})
          </button>
          {showDatePicker && (
            <div className="date-picker-dropdown">
              <div className="date-picker-actions">
                <button onClick={selectAllDates}>전체 선택</button>
                <button onClick={clearAllDates}>전체 해제</button>
              </div>
              <div className="date-list">
                {availableDates.map((date) => (
                  <label key={date} className="date-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedDates.includes(date)}
                      onChange={() => toggleDate(date)}
                    />
                    {date}
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="stats-cards">
        <div className="stat-card">
          <h3>총 검사 횟수</h3>
          <p className="stat-value">{totalTests}회</p>
        </div>
        <div className="stat-card">
          <h3>최근 검사일</h3>
          <p className="stat-value">{latestTestDate}</p>
        </div>
        <div className="stat-card">
          <h3>이상 수치 개수</h3>
          <p className="stat-value abnormal">{countAbnormal()}개</p>
        </div>
      </div>

      <div className="chart-section">
        <h2>간 효소 수치 추이 (AST, ALT, GGT, ALP)</h2>
        {filteredData.length >= 2 ? (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={lineChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis label={{ value: "U/L (IU/L)", angle: -90, position: "insideLeft" }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="AST" stroke="#e74c3c" strokeWidth={2} />
              <Line type="monotone" dataKey="ALT" stroke="#3498db" strokeWidth={2} />
              <Line type="monotone" dataKey="GGT" stroke="#2ecc71" strokeWidth={2} />
              <Line type="monotone" dataKey="ALP" stroke="#f39c12" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="no-data-message">
            검사 데이터가 2개 이상일 때 추이 그래프가 표시됩니다.
          </div>
        )}
      </div>

      <div className="chart-section-with-description">
        <div className="chart-area">
          <h2>ALBI 점수</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={albiChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="ALBI" fill="#9b59b6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="description-area">
          <h3>ALBI 점수란?</h3>
          <p>
            <strong>ALBI (Albumin-Bilirubin)</strong>는 간 기능을 평가하는 지표입니다.
          </p>
          <p>
            <strong>계산식:</strong> 0.66 × log₁₀(빌리루빈) - 0.085 × 알부민
          </p>
          <ul>
            <li><strong>알부민(Albumin):</strong> 간에서 생성되는 단백질로, 낮을수록 간 기능이 저하됨</li>
            <li><strong>빌리루빈(Bilirubin):</strong> 적혈구 분해 시 생성되는 색소로, 높을수록 간 기능 저하</li>
          </ul>
          <p>
            <strong>해석:</strong>
          </p>
          <ul>
            <li>Grade 1 (≤-2.60): 양호한 간 기능</li>
            <li>Grade 2 (-2.60 ~ -1.39): 중등도 간 기능</li>
            <li>Grade 3 (&gt;-1.39): 저하된 간 기능</li>
          </ul>
        </div>
      </div>

      <div className="chart-section-with-description">
        <div className="chart-area">
          <h2>혈소판 수치 (Platelet)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={plateletChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis label={{ value: "천/µL", angle: -90, position: "insideLeft" }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="Platelet" fill="#e67e22" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="description-area">
          <h3>혈소판(Platelet)이란?</h3>
          <p>
            <strong>혈소판</strong>은 혈액 응고에 중요한 역할을 하는 세포 조각입니다.
          </p>
          <p>
            <strong>정상 범위:</strong> 150,000 ~ 450,000/µL (150 ~ 450 천/µL)
          </p>
          <p>
            <strong>임상적 의의:</strong>
          </p>
          <ul>
            <li><strong>낮은 수치:</strong> 출혈 위험 증가, 간경변, 골수 질환 등</li>
            <li><strong>높은 수치:</strong> 혈전 형성 위험, 염증성 질환 등</li>
          </ul>
          <p>
            간 질환 환자의 경우 혈소판 수치가 낮아질 수 있으며, 이는 간경변의 진행 정도를 반영할 수 있습니다.
          </p>
        </div>
      </div>
<<<<<<< Updated upstream
=======

      {/* 종합 위험도 평가 섹션 */}
      <div className="risk-assessment-section">
        <div className="risk-score-box">
          <h2>종합 위험도 점수</h2>
          <div className={`risk-score-display risk-level-${riskAssessment.level}`}>
            <div className="score-number">{riskAssessment.score}</div>
            <div className="score-label">점</div>
          </div>
          <div className={`risk-level-badge ${riskAssessment.level}`}>
            {riskAssessment.level}
          </div>
          {riskAssessment.hasGuardrail && (
            <div className="guardrail-badge">
              ⚠️ 안전장치 작동
            </div>
          )}
          {riskAssessment.afpAlert && (
            <div className="afp-alert-badge">
              🔔 AFP 종양표지자 주의
            </div>
          )}
          {riskAssessment.details.length > 0 && (
            <div className="risk-details">
              <h4>이상 수치 항목</h4>
              <ul>
                {riskAssessment.details.map((detail, idx) => (
                  <li key={idx} className={`detail-item ${detail.level}`}>
                    <span className="detail-name">{detail.name}</span>
                    <span className="detail-level">{detail.level}</span>
                    <span className="detail-value">{detail.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="risk-explanation-box">
          <h2>위험도 판정 기준</h2>

          <div className="risk-level-info safe">
            <h3>✓ 안전 (점수 ≤ 3)</h3>
            <p>대부분의 간 기능 지표가 정상 범위에 있습니다.</p>
            <ul>
              <li>정기적인 건강 검진을 유지하세요</li>
              <li>건강한 생활 습관을 계속 실천하세요</li>
            </ul>
          </div>

          <div className="risk-level-info warning">
            <h3>⚠️ 주의 (점수 4-7)</h3>
            <p>일부 간 기능 지표에 주의가 필요합니다.</p>
            <ul>
              <li>의료진과 상담하여 추가 검사를 고려하세요</li>
              <li>생활 습관 개선이 필요할 수 있습니다</li>
              <li>정기 검진 주기를 단축하는 것을 권장합니다</li>
            </ul>
          </div>

          <div className="risk-level-info danger">
            <h3>🚨 위험 (점수 ≥ 8 또는 안전장치 작동)</h3>
            <p>심각한 간 기능 이상이 감지되었습니다.</p>
            <ul>
              <li><strong>즉시 의료진과 상담하세요</strong></li>
              <li>전문적인 치료가 필요할 수 있습니다</li>
              <li>간 기능 보호를 위한 조치가 시급합니다</li>
            </ul>
            <div className="guardrail-info">
              <h4>안전장치 작동 조건:</h4>
              <ul>
                <li>Albumin &lt; 2.0 g/dL</li>
                <li>INR ≥ 2.0</li>
                <li>Bilirubin ≥ 2.5 mg/dL</li>
                <li>Platelet &lt; 75,000/µL</li>
                <li>핵심 4개 지표 중 2개 이상 위험</li>
              </ul>
            </div>
          </div>

          {riskAssessment.afpAlert && (
            <div className="risk-level-info afp-warning">
              <h3>🔔 AFP 종양표지자 경고</h3>
              <p>AFP(알파태아단백) 수치가 높습니다.</p>
              <ul>
                <li>간암 가능성을 배제하기 위한 정밀 검사가 필요합니다</li>
                <li>복부 초음파 또는 CT 검사를 권장합니다</li>
                <li><strong>반드시 전문의와 상담하세요</strong></li>
              </ul>
            </div>
          )}

          <div className="scoring-methodology">
            <h4>점수 산정 방법</h4>
            <p><strong>가중치 시스템:</strong></p>
            <ul>
              <li>핵심 지표 (가중치 2): Albumin, INR, Bilirubin, Platelet</li>
              <li>효소 지표 (가중치 1): AST, ALT, ALP, GGT, AFP</li>
            </ul>
            <p><strong>단계 점수:</strong></p>
            <ul>
              <li>정상 = 0점, 위험 = 1점, 매우위험 = 2점</li>
              <li>총점 = Σ(가중치 × 단계점수)</li>
            </ul>
          </div>
        </div>
>>>>>>> Stashed changes
      </div>
    </div>
  );
};

export default Dashboard2;
