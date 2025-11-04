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
      </div>
    </div>
  );
};

export default Dashboard2;
