import { Button, Form, Input } from "antd";
import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import { hideLoading, showLoading } from "../redux/alertsSlice";
import "./Register.css";

import ReCAPTCHA from "react-google-recaptcha";
import { RiEyeLine, RiEyeOffLine } from "react-icons/ri";

function Register() {
    const captchaRef = useRef(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const onFinish = async (values) => {
        console.log(values);
        const {
            name,
            username,
            mobileNumber,
            whatsappNumber,
            email,
            password,
            confirmPassword,
        } = values;

        if (!name || !name.trim()) {
            return toast.error("Name cannot be empty");
        }

        if (!username || !username.trim()) {
            return toast.error("Username cannot be empty");
        }
        if (!email || !email.trim()) {
            return toast.error("Email cannot be empty");
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return toast.error("Invalid email format");
        }
        if (!mobileNumber || !mobileNumber.trim()) {
            return toast.error("Mobile number cannot be empty");
        }

        const mobileNumberRegex = /^[6-9]\d{9}$/;

        if (!mobileNumberRegex.test(mobileNumber)) {
            return toast.error("Invalid mobile number");
        }

        // if (!whatsappNumber || !whatsappNumber.trim()) {
        //     return toast.error("WhatsApp number cannot be empty");
        // }

        // if (!mobileNumberRegex.test(whatsappNumber)) {
        //     return toast.error("Invalid Indian Whatsapp number");
        // }

        if (password.length < 6) {
            return toast.error("Password should be at least 6 characters long");
        }

        const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
        if (!passwordRegex.test(password)) {
            return toast.error(
                "Password should contain at least one lowercase letter, one uppercase letter, one digit, and one special character"
            );
        }
        if (password !== confirmPassword) {
            return toast.error("Passwords do not match ");
        }

        try {
            dispatch(showLoading());
            const token = captchaRef.current.getValue();
            if (!token) {
                dispatch(hideLoading());
                captchaRef.current.reset();
                return toast.error("Please verify that you are not a robot");
            }
            values.token = token;
            delete values.confirmPassword;
            const response = await axios.post("/api/user/register", values);
            dispatch(hideLoading());
            if (response.data.success) {
                toast.success(response.data.message);
                navigate("/login");
            } else {
                toast.error(response.data.message);
            }
            captchaRef.current.reset();
        } catch (error) {
            dispatch(hideLoading());
            toast.error("Something went wrong");
        }
    };

    return (
        <>
            <div className="register-container">
                <div className="register-inside-container">
                    <div className="title">REGISTER</div>
                    <hr style={{ width: "100%", borderBottom: "3px solid black" }} />
                    <div className="register-data">
                        <Form layout="vertical" onFinish={onFinish}>
                            <div
                                style={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    padding: "30px",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    gap: "30px",
                                }}
                            >
                                <Form.Item
                                    style={{
                                        minWidth: "300px",
                                        display: "flex",
                                        flexDirection: "column",
                                    }}
                                    label="Name"
                                    name="name"
                                >
                                    <Input placeholder="Name" type="text" />
                                </Form.Item>
                                <Form.Item
                                    style={{ minWidth: "300px" }}
                                    label="Username"
                                    name="username"
                                >
                                    <Input placeholder="Username" />
                                </Form.Item>
                                <Form.Item
                                    style={{ minWidth: "300px" }}
                                    label="Email"
                                    name="email"
                                >
                                    <Input placeholder="Email" type="text" />
                                </Form.Item>
                                <Form.Item
                                    style={{ minWidth: "300px" }}
                                    label="MobileNumber"
                                    name="mobileNumber"
                                >
                                    <Input placeholder="MobileNumber" type="number" />
                                </Form.Item>
                                <Form.Item
                                    style={{ minWidth: "300px" }}
                                    label="WhatsappNumber"
                                    name="whatsappNumber"
                                >
                                    <Input placeholder="WhatsappNumber" type="number" />
                                </Form.Item>
                            </div>
                            <hr style={{ width: "100%", borderBottom: "1px solid black" }} />
                            <div
                                style={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    padding: "30px",
                                    gap: "30px",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <Form.Item
                                    style={{ minWidth: "300px" }}
                                    label="Password"
                                    name="password"
                                >
                                    <Input
                                        placeholder="Password"
                                        type={showPassword ? "text" : "password"}
                                    />
                                </Form.Item>

                                {/* <button
                  className="toggle-button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <RiEyeOffLine /> : <RiEyeLine />}
                </button> */}

                                <Form.Item
                                    style={{ minWidth: "300px" }}
                                    label="ConfirmPassword"
                                    name="confirmPassword"
                                >
                                    <Input placeholder="ConfirmPassword" type="password" />
                                </Form.Item>
                                <ReCAPTCHA
                                    style={{ marginTop: "10px" }}
                                    sitekey={process.env.REACT_APP_SITE_KEY}
                                    ref={captchaRef}
                                />
                            </div>

                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    flexDirection: "column",
                                }}
                            >
                                <button className="register-button" type="submit">
                                    REGISTER
                                </button>
                                <Link to="/login" className="link-for-login">
                                    <span> Already have an account ?</span>
                                    <span> Login here</span>
                                </Link>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Register;
