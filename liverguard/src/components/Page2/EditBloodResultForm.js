import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBloodResultById, updateBloodResult } from "../../api/bloodResultAPI";
import "./EditBloodResultForm.css";

const EditBloodResultForm  = ({ onUpdate }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    ast: "", alt: "", alp: "",
    ggt: "", bilirubin: "" , albumin: "",
    inr: "", platelet: "", afp: "",
    taken_at: "",
  });
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setDataLoading(true);
        const data = await getBloodResultById(id);
        const takenAt  = data.taken_at ? data.taken_at.split('T')[0] : "";
        const createAt = data.creat_at
        
        setForm({
          ast: data.ast ?? "",
          alt: data.alt ?? "",
          alp: data.alp ?? "",
          ggt: data.ggt ?? "",
          bilirubin: data.bilirubin ?? "",
          albumin: data.albumin ?? "",
          inr: data.inr ?? "",
          platelet: data.platelet ?? "",
          afp: data.afp ?? "",
          taken_at: takenAt,
        });
      } catch (err) {
        console.error("데이터 로드 실패:", err);
        alert("데이터를 불러오지 못했습니다.");
        navigate("/page2");
    } finally {
      setDataLoading(false);
    }
  };
  fetchData();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const calcALBI = (bilirubinStr, albuminStr) => {
    const bil = parseFloat(bilirubinStr);
    const alb = parseFloat(albuminStr);
    if (Number.isNaN(bil) || Number.isNaN(alb)) return null;
    const albi = (bil * 0.66) + (alb * -0.085);
    return Number(albi).toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.ast || !form.alt || !form.bilirubin || !form.albumin || !form.afp) {
      alert("AST, ALT, Bilirubin, Albumin, AFP는 필수 입력입니다.");
      return;
    }

    const patient_id = localStorage.getItem("patient_id");
    if (!patient_id) {
      alert("환자 정보가 없습니다. 다시 로그인해주세요.");
      navigate("/login");
      return;
    }

    const ALBI = calcALBI(form.bilirubin, form.albumin);

    const takenAtDate = form.taken_at.split('T')[0];

    const updatedForm = {
      patient: patient_id,  
      ast: parseFloat(form.ast),
      alt: parseFloat(form.alt),
      alp: form.alp ? parseFloat(form.alp) : null,
      ggt: form.ggt ? parseFloat(form.ggt) : null,
      bilirubin: parseFloat(form.bilirubin),
      albumin: parseFloat(form.albumin),
      inr: form.inr ? parseFloat(form.inr) : null,
      platelet: form.platelet ? parseFloat(form.platelet) : null,
      afp: parseFloat(form.afp),
      ALBI: ALBI ? parseFloat(ALBI) : null,
      taken_at: takenAtDate   
    };

    console.log("전송할 데이터:", updatedForm);

    try {
      setLoading(true);
      await updateBloodResult(id, updatedForm);
      alert("혈액검사 결과가 수정되었습니다.");

      if (onUpdate) {
        onUpdate(id, updatedForm);
      } else {
        navigate("/page2");
      }
    } catch (err) {
      console.error("수정 실패:", err);
      console.error("에러 응답:", err.response?.data);
      alert(`수정에 실패했습니다: ${JSON.stringify(err.response?.data)}`);
    } finally {
      setLoading(false);
    }
  };

  if (dataLoading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h2>데이터를 불러오는 중...</h2>
        <p>잠시만 기다려주세요.</p>
      </div>
    );
  }

  return (
    <div className="edit-form-page">
      <div className="form-page-header">
      </div>
      
      <div className="form-card">
        {/* 카드 헤더 */}
        <div className="form-card-header">
          <div className="form-card-header-content">
            <h3 className="form-card-title">검사 정보 수정</h3>
            <p className="form-card-subtitle">필수 항목을 입력해주세요</p>
          </div>
        </div>

        {/* 카드 바디 */}
        <div className="form-card-body">
          <form className="blood-result-form" onSubmit={handleSubmit}>
            {/* 검사일 */}
            <div className="form-group">
              <label className="form-label required">검사일</label>
              <input 
                type="date"
                name="taken_at" 
                value={form.taken_at} 
                onChange={handleChange} 
                required
                className="form-input"
              />
            </div>

            {/* AST, ALT */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label required">AST</label>
                <input 
                  type="number"
                  step="0.01"
                  name="ast" 
                  value={form.ast} 
                  onChange={handleChange} 
                  placeholder="AST"
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label required">ALT</label>
                <input 
                  type="number"
                  step="0.01"
                  name="alt" 
                  value={form.alt} 
                  onChange={handleChange} 
                  placeholder="ALT"
                  required
                  className="form-input"
                />
              </div>
            </div>

            {/* ALP, GGT */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">ALP</label>
                <input 
                  type="number"
                  step="0.01"
                  name="alp" 
                  value={form.alp} 
                  onChange={handleChange} 
                  placeholder="ALP"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">GGT</label>
                <input 
                  type="number"
                  step="0.01"
                  name="ggt" 
                  value={form.ggt} 
                  onChange={handleChange} 
                  placeholder="GGT"
                  className="form-input"
                />
              </div>
            </div>

            {/* Bilirubin, Albumin */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label required">Bilirubin</label>
                <input 
                  type="number"
                  step="0.01"
                  name="bilirubin" 
                  value={form.bilirubin} 
                  onChange={handleChange} 
                  placeholder="Bilirubin"
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label required">Albumin</label>
                <input 
                  type="number"
                  step="0.01"
                  name="albumin" 
                  value={form.albumin} 
                  onChange={handleChange} 
                  placeholder="Albumin"
                  required
                  className="form-input"
                />
              </div>
            </div>

            {/* INR, Platelet */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">INR</label>
                <input 
                  type="number"
                  step="0.01"
                  name="inr" 
                  value={form.inr} 
                  onChange={handleChange} 
                  placeholder="INR"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Platelet</label>
                <input 
                  type="number"
                  step="0.01"
                  name="platelet" 
                  value={form.platelet} 
                  onChange={handleChange} 
                  placeholder="Platelet"
                  className="form-input"
                />
              </div>
            </div>

            {/* AFP */}
            <div className="form-group">
              <label className="form-label required">AFP</label>
              <input 
                type="number"
                step="0.01"
                name="afp" 
                value={form.afp} 
                onChange={handleChange} 
                placeholder="AFP"
                required
                className="form-input"
              />
            </div>

            {/* 버튼 그룹 */}
            <div className="form-actions">
              <button 
                type="submit" 
                disabled={loading}
                className="btn-submit"
              >
                {loading ? "수정 중..." : "수정 완료"}
              </button>
              <button 
                type="button"
                onClick={() => navigate("/page2")}
                className="btn-cancel"
              >
                취소
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditBloodResultForm;