import React from "react";
import "./ProfilePage.css";
export default function ChangePasswordForm() {
  return (
    <div className="change-password-container">
      <div className="form-container">
        <div>
          <div>enter new password</div>
          <div>
            <input />
          </div>
        </div>
        <div>
          <div>confirm new password</div>
          <input />
        </div>
        <div
          style={{
            display: "flex",
            // justifyContent: "flex-end",
            alignItems: "flex-end",
            flexDirection: "row",
            height: "100%",
          }}
        >
          <button>Change Password</button>
        </div>
      </div>
    </div>
  );
}
