import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBloodResult } from "../../api/bloodResultAPI";

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
        <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
            <h2>혈액검사 결과 등록</h2>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <input type="number" step="0.01" name="ast" value={form.ast} onChange={handleChange} placeholder="AST" required />
                <input type="number" step="0.01" name="alt" value={form.alt} onChange={handleChange} placeholder="ALT" required />
                <input type="number" step="0.01" name="alp" value={form.alp} onChange={handleChange} placeholder="ALP" />
                <input type="number" step="0.01" name="ggt" value={form.ggt} onChange={handleChange} placeholder="GGT" />
                <input type="number" step="0.01" name="bilirubin" value={form.bilirubin} onChange={handleChange} placeholder="Bilirubin" required />
                <input type="number" step="0.01" name="albumin" value={form.albumin} onChange={handleChange} placeholder="Albumin" required />
                <input type="number" step="0.01" name="inr" value={form.inr} onChange={handleChange} placeholder="INR" />
                <input type="number" step="0.01" name="platelet" value={form.platelet} onChange={handleChange} placeholder="Platelet" />
                <input type="number" step="0.01" name="afp" value={form.afp} onChange={handleChange} placeholder="AFP" required />
    
                <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                    <button type="submit" disabled={loading} style={{ 
                        padding: "10px 20px", 
                        background: loading ? "#6c757d" : "#28a745", 
                        color: "white", 
                        border: "none", 
                        borderRadius: "4px",
                        cursor: loading ? "not-allowed" : "pointer"
                    }}>
                        {loading ? "등록중..." : "등록"}
                    </button>
                    <button type="button" onClick={() => navigate("/page2")} style={{ 
                        padding: "10px 20px", 
                        background: "#6c757d", 
                        color: "white", 
                        border: "none", 
                        borderRadius: "4px",
                        cursor: "pointer"
                    }}>취소</button>
                </div>
            </form>
        </div>
    );
};

export default CreateBloodResultForm;