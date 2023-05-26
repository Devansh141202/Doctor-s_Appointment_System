import { Button, Form, Input } from "antd";
import React, { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import { hideLoading, showLoading } from "../redux/alertsSlice";
import "./Register.css";
import registerImage from "./login-image.png";

export default function ResetPassword() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onFinish = async (values) => {
    try {
      dispatch(showLoading());

      if (!values.password) {
        dispatch(hideLoading());
        return toast.error("Please enter a password");
      }
      if (!values["confirm-new-password"]) {
        dispatch(hideLoading());
        return toast.error("Please enter a confirm password");
      }
      if (values.password !== values["confirm-new-password"]) {
        dispatch(hideLoading());
        return toast.error("Passwords do not match");
      }

      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(values.password)) {
        dispatch(hideLoading());
        return toast.error(
          "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one digit, and one special character."
        );
      }

      delete values["confirm-new-password"];

      console.log(`/api/user${window.location.pathname}`);
      const response = await axios.post(
        `/api/user${window.location.pathname}`,
        values
      );
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/login");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error("Something went wrong");
    }
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          width: "100%",
          gap: "10px",
          marginTop: "10px",
          padding: "10px",
        }}
      >
        <div
          style={{
            fontSize: "40px",
            fontWeight: "bold",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            width: "100%",
          }}
        >
          Reset Password
        </div>
        <div
          style={{
            marginTop: "20px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            width: "100%",
            fontSize: "15px",
          }}
        >
          In order to protect your account, make sure your password :
          <ul>
            <li>contain at least 8 characters</li>
            <li>contain at least one uppercase letter</li>
            <li>contain at least one lowercase letter</li>
            <li>contain at least one digit</li>
            <li>contain at least one special character</li>
          </ul>
        </div>
        <div className="forgot-password-card">
          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item label="New Password" name="password">
              <Input placeholder="New Password" type="password" />
            </Form.Item>
            <Form.Item label="Confirm New Password" name="confirm-new-password">
              <Input placeholder="Confirm New Password" type="password" />
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
    </>
  );
}
