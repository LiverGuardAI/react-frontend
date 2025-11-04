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
  const handleDelete = async (bloodResultId) => {
    if (!bloodResultId) {
      alert("삭제할 데이터의 ID가 없습니다.");
      return;
    }

    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      await deleteBloodResult(bloodResultId); // API 호출
      setRows(rows.filter(row => row.blood_result_id !== bloodResultId));
      alert("삭제되었습니다.");
    } catch (err) {
      console.error("삭제 실패:", err);
      alert("삭제에 실패했습니다.");
    }
  };

  // 새로운 데이터 추가 시 목록 갱신
  const handleCreate = (newData) => {
    setRows(prev => [...prev, newData]);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return dateString.split('T')[0];
  };

  return (
    <div className="blood-result-page">
      {/* 🔥 페이지 헤더 */}
      <div className="page-header">
        <button 
          className="btn-create"
          onClick={() => navigate("/bloodresult/create")}
        >
          + 새로운 검사 등록
        </button>
      </div>

      {loading ? (
        <div className="status-message">
          <p>데이터를 불러오는 중...</p>
        </div>
      ) : error ? (
        <div className="status-message error">
          <p>{error}</p>
        </div>
      ) : rows.length === 0 ? (
        <div className="status-message">
          <p>등록된 데이터가 없습니다.</p>
        </div>
      ) : (
        <div className="blood-table-card">
          {/* 🔥 카드 헤더 */}
          <div className="card-header">
            <div className="card-header-content">
              <div>
                <h3 className="card-title">혈액검사 목록</h3>
                <p className="card-subtitle">총 {rows.length}건의 검사 결과</p>
              </div>
            </div>
          </div>

          {/* 🔥 테이블 */}
          <div className="table-wrapper">
            <table className="blood-table">
              <thead>
                <tr>
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
                {rows.map(row => (
                  <tr key={row.blood_result_id}>
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
                    <td className="date-cell">{formatDate(row.taken_at)}</td>
                    <td className="date-cell">{formatDate(row.created_at)}</td>
                    <td>
                      <div className="action-cell">
                        <button 
                          className="btn btn-edit"
                          onClick={() => navigate(`/bloodresult/edit/${row.blood_result_id}`)}
                        >
                          Edit
                        </button>
                        <button 
                          className="btn btn-delete"
                          onClick={() => handleDelete(row.blood_result_id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      </div>
  );
};

export default Page2;