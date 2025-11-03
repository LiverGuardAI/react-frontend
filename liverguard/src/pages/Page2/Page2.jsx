import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getBloodResults, deleteBloodResult } from "../../api/bloodResultAPI";
import "./BloodResultTable.css";

const Page2 = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    const patient_id = localStorage.getItem("patient_id");
    if (!patient_id) {
      setError("환자 정보가 없습니다.");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const res = await getBloodResults();
      console.log("API Response:", res);
      // 현재 환자의 데이터만 필터링
      const filteredData = (Array.isArray(res) ? res : []).filter(
        item => item.patient === patient_id
      );
      setRows(filteredData);
      setError(null);
    } catch (err) {
      if (err.response?.status === 404) {
      setRows([]);
      setError(null);
    } else {
      setError("데이터를 불러오는데 실패했습니다.");
    }
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  // 삭제
  const handleDelete = async (id) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      await deleteBloodResult(id); // API 호출
      setRows(rows.filter(row => row.id !== id));
    } catch (err) {
      alert("삭제에 실패했습니다.");
    }
  };

  // 새로운 데이터 추가 시 목록 갱신
  const handleCreate = (newData) => {
    setRows(prev => [...prev, newData]);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>혈액검사 결과</h2>
      <button 
        onClick={() => navigate("/bloodresult/create")}
        style={{
          marginBottom: "10px",
          padding: "8px 16px",
          background: "#28a745",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer"
        }}
      >
        등록
      </button>
      {loading ? (
        <p>데이터를 불러오는 중...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : rows.length === 0 ? (
        <p>등록된 데이터가 없습니다.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #ccc" }}>
              <th>ID</th>
              <th>AST</th>
              <th>ALT</th>
              <th>ALP</th>
              <th>GGT</th>
              <th>Bilirubin</th>
              <th>Albumin</th>
              <th>INR</th>
              <th>Platelet</th>
              <th>AFP</th> 
              <th>ALBI</th>
              <th>검사일</th>
              <th>등록일</th>
              <th>작업</th>
          </tr>
          </thead>
          <tbody>
            {rows.map(row  => (
              <tr key={row.id} style={{ borderBottom: "1px solid #eee" }}>
                <td>{row.blood_result_id}</td>
                <td>{row.ast}</td>
                <td>{row.alt}</td>
                <td>{row.alp}</td>
                <td>{row.ggt}</td>
                <td>{row.bilirubin}</td>
                <td>{row.albumin}</td>
                <td>{row.inr}</td>
                <td>{row.platelet}</td>
                <td>{row.afp}</td>
                <td>{row.ALBI}</td>
                <td>{row.taken_at}</td>
                <td>{row.created_at}</td>
                <td style={{ display: "flex", gap: "5px" }}>

                  <button onClick={() => navigate(`/bloodresult/edit/${row.id}`)}>수정</button>
                  <button onClick={() => handleDelete(row.id)}>삭제</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Page2;