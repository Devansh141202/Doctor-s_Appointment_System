import React, { useState } from "react";
import { RiEyeFill, RiEyeOffFill } from "react-icons/ri";
import "./ProfilePage.css";
import axios from "axios";
import toast from "react-hot-toast";
import { hideLoading, showLoading } from "../redux/alertsSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function ChangePasswordForm() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
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

    const handlePasswordChange = async () => {
        try {
            dispatch(showLoading());
            const { newPassword, confirmPassword } = passwords;
            if (newPassword.trim() === "" || confirmPassword.trim() === "") {
                toast.error("Please enter both the new password and confirm password");
                dispatch(hideLoading());
                return;
            }

            if (newPassword !== confirmPassword) {
                toast.error("Passwords do not match");
                dispatch(hideLoading());
                return;
            }

            const passwordRegex =
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            if (!passwordRegex.test(newPassword)) {
                toast.error(
                    "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character"
                );
                dispatch(hideLoading());
                return;
            }

            //api for change password
            const response = await axios.post(`http://34.131.197.1/api/user/change-password`, {
                password: newPassword,
            }, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                },
            }).catch((error) => {
                if (error.response.status) {
                    toast.error('Session Expired');
                    sessionStorage.clear();
                    navigate("/login");
                }
            });

            dispatch(hideLoading());
            if (response.data.success) {
                toast.success(response.data.message);
            } else {
                toast.error(response.data.message);
            }

            setPasswords({
                newPassword: "",
                confirmPassword: "",
            });
        } catch (error) {
            dispatch(hideLoading());
            toast.error("Something went wrong");
        }
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
