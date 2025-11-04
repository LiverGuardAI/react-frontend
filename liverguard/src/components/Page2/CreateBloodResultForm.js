import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBloodResult } from "../../api/bloodResultAPI";
import "./CreateBloodResultForm.css";

const CreateBloodResultForm  = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        ast: "", alt: "", alp: "",
        ggt: "", bilirubin: "" , albumin: "",
        inr: "", platelet: "", afp: ""
     });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
     };
    // ALBI 계산
    const calcALBI = (bilirubinStr, albuminStr) => {
        const bil = parseFloat(bilirubinStr);
        const alb = parseFloat(albuminStr);
        if (isNaN(bil) || isNaN(alb)) return "";
        return Number((0.66 * bil - 0.085 * alb)).toFixed(2);
    };
    // taken_at
    const makeTakenAtRandom = () => {
        const now = new Date();

        let randomDate;
        do {
            const year = now.getFullYear();
            const month = Math.floor(Math.random() * 12);
            const day = Math.floor(Math.random() * 28) + 1;
            randomDate = new Date(year, month, day);
        }   while (randomDate.getTime() > now.getTime());

        return randomDate.toISOString().split("T")[0];
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.bilirubin || !form.albumin || !form.afp || !form.ast || !form.alt) {
            alert("반드시 입력해야 합니다.");
            return;
        }

        const albi = calcALBI(form.bilirubin, form.albumin);
        const taken_at = makeTakenAtRandom();
        const patient_id = localStorage.getItem("patient_id");

        const payload = {
            ...form,
            albi: parseFloat(albi),  // ALBI → albi (소문자)
            taken_at,
            patient: patient_id,  // patient_id → patient, UUID 문자열 그대로
        };
        
        try {
            setLoading(true);
            await createBloodResult(payload);
            alert("혈액검사 결과가 등록되었습니다.");
            navigate("/page2");
        }   catch (err) {
            console.error(err);
            alert("등록에 실패했습니다 : " + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
     };

     return (
    <div className="create-form-page">
      {/* 페이지 헤더 */}
      <div className="form-page-header">
      </div>

      <div className="form-card">
        {/* 카드 헤더 */}
        <div className="form-card-header">
          <div className="form-card-header-content">
            <h3 className="form-card-title">새로운 검사 등록</h3>
          </div>
        </div>

        {/* 카드 바디 */}
        <div className="form-card-body">
          <form className="blood-result-form" onSubmit={handleSubmit}>
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
              <button type="submit" disabled={loading} className="btn-submit">
                {loading ? "등록 중..." : "등록"}
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

export default CreateBloodResultForm;