import { Button, Col, DatePicker, Form, Input, Row, TimePicker } from "antd";
import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { useDispatch, useSelector } from "react-redux";
import { showLoading, hideLoading } from "../redux/alertsSlice";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import DoctorForm from "../components/DoctorForm";
import moment from "moment";
import "./BookAppointment.css";
import BookingImage from "./bookingImage.jpeg";

function BookAppointment() {
  const [isAvailable, setIsAvailable] = useState(false);
  const navigate = useNavigate();
  const [date, setDate] = useState();
  const [time, setTime] = useState();
  const { user } = useSelector((state) => state.user);
  const [doctor, setDoctor] = useState(null);
  const params = useParams();
  const dispatch = useDispatch();

  const getDoctorData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/doctor/get-doctor-info-by-id",
        {
          doctorId: params.doctorId,
        },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );

      dispatch(hideLoading());
      if (response.data.success) {
        setDoctor(response.data.data);
      }
    } catch (error) {
      console.log(error);
      dispatch(hideLoading());
    }
  };
  const checkAvailability = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/user/check-booking-avilability",
        {
          doctorId: params.doctorId,
          date: date,
          time: time,
        },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        setIsAvailable(true);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error booking appointment");
      dispatch(hideLoading());
    }
  };
  const bookNow = async () => {
    setIsAvailable(false);
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/user/book-appointment",
        {
          doctorId: params.doctorId,
          userId: user._id,
          doctorInfo: doctor,
          userInfo: user,
          date: date,
          time: time,
        },
        // "/api/user/email",
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );

      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/appointments");
      }
    } catch (error) {
      toast.error("Error booking appointment");
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    getDoctorData();
  }, []);
  return (
    <Layout>
      {doctor && (
        <>
          <div className="book-appointment-card-main-container">
            <div className="book-appointment-part-one">
              <img src={BookingImage} alt="" width="100%" height="400" />
            </div>
            <div className="book-appointment-part-two">
              <div className="book-appointment-card-header-name">
                Dr. {doctor.firstName} {doctor.lastName}
              </div>
              <hr style={{ width: "100%", borderBottom: "1px solid black" }} />
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "center",
                  width: "100%",
                  flexDirection: "column",
                  gap: "20px",
                }}
              >
                <div className="phone-number">
                  <div className="book-appointment-text-title">
                    Phone Number
                  </div>
                  <div className="book-appointment-text-data">
                    {doctor.phoneNumber}
                  </div>
                </div>
                <div className="address">
                  <div className="book-appointment-text-title">Address</div>
                  <div className="book-appointment-text-data">
                    {doctor.address}
                  </div>
                </div>
                <div className="website">
                  <div className="book-appointment-text-title">Website</div>
                  <div className="book-appointment-text-data">
                    {doctor.website}
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: "20px",
                    width: "100%",
                  }}
                >
                  <div className="timing">
                    <div className="book-appointment-text-title">Timings</div>
                    <div className="book-appointment-text-data">
                      {doctor.timings[0]} - {doctor.timings[1]}
                    </div>
                  </div>
                  <div className="charge-per-visit">
                    <div className="book-appointment-text-title">
                      Charge Per Visit
                    </div>
                    <div className="book-appointment-text-data">
                      {doctor.feePerCunsultation} ₹
                    </div>
                  </div>
                </div>
                <hr
                  style={{ width: "100%", borderBottom: "1px solid black" }}
                />
                <DatePicker
                  style={{ width: "100%" }}
                  format="DD-MM-YYYY"
                  onChange={(value) => {
                    setDate(moment(value).format("DD-MM-YYYY"));
                    setIsAvailable(false);
                  }}
                />
                <TimePicker
                  style={{ width: "100%" }}
                  format="HH:mm"
                  onChange={(value) => {
                    setIsAvailable(false);
                    setTime(moment(value).format("HH:mm"));
                  }}
                />
                {!isAvailable && (
                  <button
                    className="check-availability-button"
                    onClick={checkAvailability}
                  >
                    Check Availability
                  </button>
                )}

                {isAvailable && (
                  <button className="book-now-button" onClick={bookNow}>
                    Book Now
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </Layout>
  );
}

export default BookAppointment;
