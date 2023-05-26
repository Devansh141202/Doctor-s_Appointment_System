import { Button, Form, Input } from "antd";
import React, { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import { hideLoading, showLoading } from "../redux/alertsSlice";
import "./Register.css";
import registerImage from "./login-image.png";

export default function ForgotPassword() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const onFinish = async (values) => {
        try {
            dispatch(showLoading());
            if (values.password !== values["confirm-new-password"]) {
                dispatch(hideLoading());
                return toast.error("Passwords do not match");
            }
            else {
                delete values["confirm-new-password"];
            }
            console.log(`/api/user${window.location.pathname}`);
            const response = await axios.post(`/api/user${window.location.pathname}`, values);
            dispatch(hideLoading());
            if (response.data.success) {
                toast.success(response.data.message);
                navigate("/login");
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
                                <div className="greeting-message">Reset Password</div>
                                <Form layout="vertical" onFinish={onFinish}>
                                    <Form.Item label="New Password" name="password">
                                        <Input placeholder="New Password" />
                                    </Form.Item>
                                    <Form.Item label="Confirm New Password" name="confirm-new-password">
                                        <Input placeholder="Confirm New Password" />
                                    </Form.Item>

                                    <button className="register-button" htmlType="submit">
                                        Reset Password
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
