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

export default function VerifyEmail() {
    console.log("verify email");
    const captchaRef = useRef(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const onFinish = async () => {
        try {
            dispatch(showLoading());
            console.log(`/api/user${window.location.pathname}`);
            const response = await axios.get(`/api/user${window.location.pathname}`);
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
            <div className="register-container">
                <div className="register-inside-container">
                    <div className="register-main-container">
                        <div className="register-image-container">
                            <img src={registerImage} alt="register" />
                        </div>
                        <div className="register-main-part-container">
                            <div className="register-data">
                                <div className="register-logo">logo</div>
                                <div className="greeting-message">Nice To Meet You</div>
                                <Form layout="vertical" onFinish={onFinish}>

                                    <button className="register-button" htmlType="submit">
                                        Verify Email
                                    </button>

                                    <Link to="/login" className="link-for-login">
                                        <span> Already have an account ?</span>
                                        <span> Login here</span>
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
