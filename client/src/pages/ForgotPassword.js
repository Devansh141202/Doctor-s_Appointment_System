import React from "react";

export default function ForgotPassword() {
  return (
    <>
      <div
        className="forgot-password-main-container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100vh",
          backgroundColor: "#0066bb",
        }}
      >
        <div
          style={{
            background: " #ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "80%",
            height: "80%",

            boxShadow:
              "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <div style={{ fontWeight: "800", fontSize: "60px" }}>
              Forgot Password ?
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
