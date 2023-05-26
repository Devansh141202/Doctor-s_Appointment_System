import { Button, Form, Input } from "antd";
import React, { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import { hideLoading, showLoading } from "../redux/alertsSlice";
import "./Register.css";
import ReCAPTCHA from "react-google-recaptcha";
import './VerifyEmail.css'
import mail_icon from './icon_mail.png'
import MainLogo from "../logo1.png";
// import icon_mail from '../../public/icon_mail.png';

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
    } catch (error) {
      dispatch(hideLoading());
      toast.error("Something went wrong");
    }
  };

  return (
    <>
      <div className="register-container outer">
        <div className="register-inside-container inner">
          <div className="register-data">
        <div>
          <img src={MainLogo} alt="logo" width={"100px"} height={"100px"} />
        </div>
            <div className="greeting-message text">Pleae Verify Your Email Address</div>
            <Form layout="vertical" onFinish={onFinish} className="verify">
               <img src={mail_icon} alt="Mail Icon" /> 
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
    </>
  );
}
