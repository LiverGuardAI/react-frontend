import React, { useState, useEffect } from "react";
import axios from "axios";
import "./dashboard_1.css";

// 각 지표에 대한 설명
const INDICATOR_INFO = {
  bilirubin: {
    title: "Total Bilirubin (총 빌리루빈)",
    description: "빌리루빈은 적혈구가 분해될 때 생성되는 노란색 색소입니다. 간 기능을 평가하는 중요한 지표입니다.",
    normalRange: "정상 범위: 0.1-1.2 mg/dL",
    risks: [
      "1.2-2.5 mg/dL: 경미한 간 기능 저하 가능성",
      "2.5 mg/dL 이상: 심각한 간 손상 위험",
    ],
  },
  albumin: {
    title: "Albumin (알부민)",
    description: "알부민은 간에서 생성되는 주요 단백질로, 혈액의 삼투압을 유지하고 영양소를 운반합니다.",
    normalRange: "정상 범위: 3.5-5.5 g/dL",
    risks: [
      "2.0-3.5 g/dL: 중등도 간 기능 저하",
      "2.0 g/dL 미만: 심각한 영양 부족 또는 간 기능 장애",
    ],
  },
  inr: {
    title: "INR (국제정규화비율)",
    description: "INR은 혈액 응고 시간을 측정하는 지표로, 간의 혈액 응고 인자 생성 능력을 평가합니다.",
    normalRange: "정상 범위: 0.8-1.1",
    risks: [
      "1.1-2.0: 경미한 응고 장애",
      "2.0 이상: 출혈 위험 증가, 심각한 간 기능 저하",
    ],
  },
  platelet: {
    title: "Platelet (혈소판)",
    description: "혈소판은 혈액 응고에 중요한 역할을 합니다. 간경화가 진행되면 혈소판 수치가 감소합니다.",
    normalRange: "정상 범위: 150,000-450,000 /µL",
    risks: [
      "75,000-150,000: 경미한 혈소판 감소증",
      "75,000 미만: 출혈 위험 증가, 심각한 간 손상",
    ],
  },
};

const Dashboard1 = () => {
  const [graphs, setGraphs] = useState({
    bilirubin: null,
    albumin: null,
    inr: null,
    platelet: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasData, setHasData] = useState(true);
  const [testDate, setTestDate] = useState(null);
  const [patientName, setPatientName] = useState(null);

  useEffect(() => {
    const fetchGraphs = async () => {
      try {
        setLoading(true);

        // 로컬 스토리지에서 JWT 토큰 가져오기
        const accessToken = localStorage.getItem("access_token");

        if (!accessToken) {
          setError("로그인이 필요합니다.");
          setLoading(false);
          return;
        }

        // 백엔드 API에서 모든 그래프 데이터 가져오기
        const response = await axios.get(
          "http://localhost:8000/api/dashboard/graphs/",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        // 응답 데이터에서 그래프 및 메타데이터 추출
        const { graphs: graphData, test_date, patient_name } = response.data;

        // base64 데이터만 추출 (data:image/png;base64, 제거)
        const processedGraphs = {};
        Object.entries(graphData).forEach(([indicator, dataUrl]) => {
          if (dataUrl) {
            // "data:image/png;base64," 제거
            processedGraphs[indicator] = dataUrl.replace(
              "data:image/png;base64,",
              ""
            );
          } else {
            processedGraphs[indicator] = null;
          }
        });

        setGraphs(processedGraphs);
        setTestDate(test_date);
        setPatientName(patient_name);
        setHasData(true);
        setLoading(false);
      } catch (err) {
        console.error("그래프 로딩 실패:", err);
        if (err.response?.status === 401) {
          setError("로그인이 만료되었습니다. 다시 로그인해주세요.");
        } else if (err.response?.status === 404) {
          setHasData(false);
          setError(null);
        } else {
          setError("그래프를 불러오는데 실패했습니다.");
        }
        setLoading(false);
      }
    };

    fetchGraphs();
  }, []);

  if (loading) {
    return <div className="dashboard-loading">그래프를 불러오는 중...</div>;
  }

  if (error) {
    return <div className="dashboard-error">{error}</div>;
  }

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">혈액 검사 위험도 대시보드</h1>

      {!hasData ? (
        <div className="no-data-container">
          <div className="no-data-message">혈액검사 결과가 없습니다.</div>
        </div>
      ) : (
        <>
          {testDate && (
            <div className="test-info">
              <p className="test-date">
                최근 검사 날짜: {new Date(testDate).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          )}
          <div className="dashboard-content">
          {/* 왼쪽: 그래프 영역 */}
          <div className="graphs-section">
            {Object.entries(graphs).map(([indicator, imageData]) => (
              <div key={indicator} className="graph-item">
                {imageData && (
                  <img
                    src={`data:image/png;base64,${imageData}`}
                    alt={`${indicator} 그래프`}
                    className="graph-image"
                  />
                )}
              </div>
            ))}
          </div>

          {/* 오른쪽: 설명 영역 */}
          <div className="info-section">
            {Object.entries(INDICATOR_INFO).map(([indicator, info]) => (
              <div key={indicator} className="info-card">
                <h3 className="info-title">{info.title}</h3>
                <p className="info-description">{info.description}</p>
                <p className="info-normal-range">{info.normalRange}</p>
                <div className="info-risks">
                  <h4>위험도:</h4>
                  <ul>
                    {info.risks.map((risk, index) => (
                      <li key={index}>{risk}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
        </>
      )}
    </div>
  );
};

export default Dashboard1;