import React, { useState } from "react";
import { deleteBloodResult } from "../../api/bloodResultAPI";

const DeleteBloodResultButton = ({ id, onDelete }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
      try {
        setLoading(true);
        await deleteBloodResult(id);
        alert("삭제되었습니다.");
        if (onDelete) onDelete(id);
      } catch (err) {
        console.error("삭제 실패:", err);
        alert("삭제에 실패했습니다.");
      } finally {
      setLoading(false);
      }
    };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      style={{
        padding: "5px 10px",
        background: loading ? "#6c757d" : "#dc3545",
        color: "white",
        border: "none",
        borderRadius: "3px",
        cursor: loading ? "not-allowed" : "pointer",
        fontSize: "14px"
      }}
    > 삭제
    </button>
  );
};

export default DeleteBloodResultButton ;