import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBloodResultById, updateBloodResult } from "../../api/bloodResultAPI";

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
          taken_at: data.taken_at ?? "",
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

    const ALBI = calcALBI(form.bilirubin, form.albumin);

    const updatedForm = {
      ...form,
      ALBI: ALBI ? parseFloat(ALBI) : null
    };

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
      alert("수정에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h2>혈액검사 결과 수정</h2>
      
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <div>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
            검사일 *
          </label>
          <input 
            type="date"
            name="taken_at" 
            value={form.taken_at} 
            onChange={handleChange} 
            required
            style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "4px" }}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
            AST *
          </label>
          <input 
            type="number"
            step="0.01"
            name="ast" 
            value={form.ast} 
            onChange={handleChange} 
            placeholder="AST"
            required
            style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "4px" }}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
            ALT *
          </label>
          <input 
            type="number"
            step="0.01"
            name="alt" 
            value={form.alt} 
            onChange={handleChange} 
            placeholder="ALT"
            required
            style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "4px" }}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
            ALP
          </label>
          <input 
            type="number"
            step="0.01"
            name="alp" 
            value={form.alp} 
            onChange={handleChange} 
            placeholder="ALP"
            style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "4px" }}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
            GGT
          </label>
          <input 
            type="number"
            step="0.01"
            name="ggt" 
            value={form.ggt} 
            onChange={handleChange} 
            placeholder="GGT"
            style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "4px" }}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
            Bilirubin *
          </label>
          <input 
            type="number"
            step="0.01"
            name="bilirubin" 
            value={form.bilirubin} 
            onChange={handleChange} 
            placeholder="Bilirubin"
            required
            style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "4px" }}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
            Albumin *
          </label>
          <input 
            type="number"
            step="0.01"
            name="albumin" 
            value={form.albumin} 
            onChange={handleChange} 
            placeholder="Albumin"
            required
            style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "4px" }}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
            INR
          </label>
          <input 
            type="number"
            step="0.01"
            name="inr" 
            value={form.inr} 
            onChange={handleChange} 
            placeholder="INR"
            style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "4px" }}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
            Platelet
          </label>
          <input 
            type="number"
            step="0.01"
            name="platelet" 
            value={form.platelet} 
            onChange={handleChange} 
            placeholder="Platelet"
            style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "4px" }}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
            AFP *
          </label>
          <input 
            type="number"
            step="0.01"
            name="afp" 
            value={form.afp} 
            onChange={handleChange} 
            placeholder="AFP"
            required
            style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "4px" }}
          />
        </div>
        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              padding: "10px 20px", 
              background: loading ? "#6c757d" : "#007bff", 
              color: "white", 
              border: "none", 
              borderRadius: "4px",
              cursor: loading ? "not-allowed" : "pointer",
              fontWeight: "bold"
            }}
          >
            수정
          </button>
          <button 
            type="button"
            onClick={() => navigate("/page2")}
            style={{ 
                  padding: "10px 20px", 
                  background: "#6c757d", 
                  color: "white", 
                  border: "none", 
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontWeight: "bold"
                }}
              >
                취소
            </button>
        </div>
      </form>
    </div>
  );
};
export default EditBloodResultForm;