import { Button, Form, Input } from "antd";
import React, { useRef } from "react";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { hideLoading, showLoading } from "../redux/alertsSlice";
import "./Login.css";
import LoginImage from "./login-image.png";
import ForgotPassword from "./ForgotPassword";
import ReCAPTCHA from "react-google-recaptcha";

function Login() {
    const captchaRef = useRef(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const onFinish = async (values) => {
        try {
            dispatch(showLoading());
            const token = captchaRef.current.getValue();
            if (!token) {
                dispatch(hideLoading());
                captchaRef.current.reset();
                return toast.error("Please verify that you are not a robot");
            }
            values.token = token;
            const response = await axios.post("/api/user/login", values);
            dispatch(hideLoading());
            if (response.data.success) {
                toast.success(response.data.message);
                sessionStorage.setItem("token", response.data.data);
                navigate("/");
            } else {
                toast.error(response.data.message);
            } captchaRef.current.reset();

        } catch (error) {
            dispatch(hideLoading());
            toast.error("Something went wrong");
        }
    };

    return (
        <>
            <div className="login-container">
                <div className="login-inside-container">
                    <div className="login-main-container">
                        <div className="login-image-container">
                            <img src={LoginImage} alt="login" />
                        </div>
                        <div className="login-main-part-container">
                            <div className="login-data">
                                <div className="login-logo">logo</div>
                                <div className="greeting-message">Welcome back</div>
                                <Form layout="vertical" onFinish={onFinish}>
                                    <Form.Item label="Email" name="email">
                                        <Input placeholder="Your Email" />
                                    </Form.Item>
                                    <Form.Item label="Password" name="password">
                                        <Input placeholder="Your Password" type="password" />
                                    </Form.Item>
                                    <ReCAPTCHA
                                        sitekey={process.env.REACT_APP_SITE_KEY}
                                        ref={captchaRef} />
                                    <Link
                                        className="link-for-forgot-password"
                                        to="/forgot-password/"
                                    >
                                        <span> forgot password ?</span>
                                    </Link> 
                                    <button className="login-button" htmlType="submit">
                                        LOGIN
                                    </button>
                                    <Link className="link-for-register" to="/register">
                                        <span> Don’t have an account ?</span>
                                        <span> Register here</span>
                                    </Link>
                                </Form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Login;
