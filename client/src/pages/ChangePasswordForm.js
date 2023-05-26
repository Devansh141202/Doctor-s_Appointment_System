import React, { useState } from "react";
import { RiEyeFill, RiEyeOffFill } from "react-icons/ri";
import "./ProfilePage.css";

export default function ChangePasswordForm() {
  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setPasswords((prevPasswords) => ({
      ...prevPasswords,
      [name]: value,
    }));
  };

  const toggleShowPassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handlePasswordChange = () => {
    const { newPassword, confirmPassword } = passwords;
    if (newPassword.trim() === "" || confirmPassword.trim() === "") {
      alert("Please enter both the new password and confirm password");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      alert(
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character"
      );
      return;
    }

    //api for change password

    setPasswords({
      newPassword: "",
      confirmPassword: "",
    });
  };

  return (
    <div className="change-password-container">
      <div className="form-container">
        <div>
          <div>Enter new password</div>
          <div
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <input
              className="new-password-input"
              type={showPassword ? "text" : "password"}
              name="newPassword"
              value={passwords.newPassword}
              onChange={handleInputChange}
            />
            {!showPassword ? (
              <RiEyeOffFill
                className="password-toggle-icon"
                onClick={toggleShowPassword}
              />
            ) : (
              <RiEyeFill
                className="password-toggle-icon"
                onClick={toggleShowPassword}
              />
            )}
          </div>
        </div>
        <div>
          <div>Confirm new password</div>
          <div
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <input
              className="confirm-new-password-input"
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              value={passwords.confirmPassword}
              onChange={handleInputChange}
            />
            {!showPassword ? (
              <RiEyeOffFill
                className="password-toggle-icon"
                onClick={toggleShowPassword}
              />
            ) : (
              <RiEyeFill
                className="password-toggle-icon"
                onClick={toggleShowPassword}
              />
            )}
          </div>
        </div>
        <div>
          <button
            className="change-password-button"
            onClick={handlePasswordChange}
          >
            Change Password
          </button>
        </div>
      </div>
      <div style={{ color: "red", marginTop: "20px" }}>
        * Password must be at least 8 characters long and contain at least one
        uppercase letter, one lowercase letter, one digit, and one special
        character
      </div>
    </div>
  );
}
