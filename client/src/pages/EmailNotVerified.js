import { Button, Form, Input } from "antd";
import React, { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import { hideLoading, showLoading } from "../redux/alertsSlice";
import "./Register.css";
import registerImage from "./login-image.png";
import ReCAPTCHA from "react-google-recaptcha";

export default function EmailNotVerified() {
    console.log("verify email");
    const captchaRef = useRef(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const onFinish = async () => {
        try {
            dispatch(showLoading());
            console.log(`/api/user${window.location.pathname}`);
            const response = await axios.get(`/api/user/resend-verification-email`, {
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
                dispatch(showLoading());
                setTimeout(() => {
                    navigate("/login");
                    dispatch(hideLoading());
                }, 3000);
            } else {
                toast.error(response.data.message);
            }
        }
        catch (error) {
            dispatch(hideLoading());
            toast.error("Something went wrong");
        }
    };

    return (
        <>
            <div className="register-container" style={{
                height: "100vh"
            }}>
                <div className="register-inside-container" style={{
                    height: "70vh"
                }}>
                    <div className="register-main-container">
                        <div className="register-image-container">
                            <img src={registerImage} alt="register" />
                        </div>
                        <div className="register-main-part-container">
                            <div className="register-data">
                                <div className="register-logo">logo</div>
                                <div className="greeting-message" style={{
                                    height: "90px",
                                    fontSize: "14px"
                                }}>Email verification link is sent to your email address.<br/>Click on below button to resend the link.</div>
                                <Form layout="vertical" onFinish={onFinish}>

                                    <button className="register-button" htmlType="submit" style={{
                                        margin: "10px auto"
                                    }}>
                                        Resend Verification Email
                                    </button>
                                </Form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
