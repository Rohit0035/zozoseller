
import React, { useState } from "react";

const MyListTag = () => {
  const [selected, setSelected] = useState("All");

  return (
    <div>
      {["All", "ZOZO KART"].map((item) => (
        <button
          key={item}
          onClick={() => setSelected(item)}
          style={{
            padding: "8px 12px",
            border: "1px solid #e5e7eb",
            background: selected === item ? "#eff6ff" : "#fff",
            color: selected === item ? "#0875e1" : "#333",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            fontSize:'12px'
          }}
        >
          {selected === item && <span>✓</span>}
          {item}
        </button>
      ))}
    </div>
  );
};

export default MyListTag;
