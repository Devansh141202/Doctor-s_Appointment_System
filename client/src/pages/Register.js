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

function Register() {
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
      // values.username = 'ketan'
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
    // <div className="authentication">
    //   <div className="authentication-form card p-3">
    //     <h1 className="card-title">Nice To Meet U</h1>

    //   </div>
    // </div>
    <>
      {" "}
      <div className="register-container">
        <div className="register-inside-container">
          <div className="register-main-container">
            <div className="register-image-container">
              <img src={registerImage} alt="register" />
            </div>
            <div className="register-main-part-container">
              <div className="register-data">
                <div className="register-logo">logo</div>
                <div className="greeting-message">Nice To Meet You </div>
                <Form layout="vertical" onFinish={onFinish}>
                  <Form.Item label="Name" name="name">
                    <Input placeholder="Name" />
                  </Form.Item>
                  <Form.Item label="Email" name="email">
                    <Input placeholder="Email" />
                  </Form.Item>
                  <Form.Item label="Password" name="password">
                    <Input placeholder="Password" type="password" />
                  </Form.Item>
                  <ReCAPTCHA
                    sitekey={process.env.REACT_APP_SITE_KEY}
                    ref={captchaRef}
                  />

                  <button className="register-button" htmlType="submit">
                    REGISTER
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

export default Register;
