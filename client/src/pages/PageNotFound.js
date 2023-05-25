import React from "react";
import { useNavigate } from "react-router-dom";

export default function PageNotFound() {
  const navigate = useNavigate();
  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          flexDirection: "column",
          height: "100vh",
        }}
      >
        <div style={{ fontSize: "30px", fontWeight: "700" }}>Whoops !</div>
        <div style={{ fontSize: "300px", fontWeight: "700" }}>
          4<span style={{ color: "#0066bb " }}>0</span>4
        </div>
        <div style={{ fontSize: "30px", fontWeight: "700" }}>
          Page Not Found
        </div>
        <button onClick={() => navigate(`/`)} className="back-to-login-button">
          {" "}
          Back To Login
        </button>
      </div>
    </>
  );
}
