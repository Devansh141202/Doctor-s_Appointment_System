import { Button, Col, Form, Input, Row, TimePicker } from "antd";
import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { useDispatch, useSelector } from "react-redux";
import { showLoading, hideLoading } from "../../redux/alertsSlice";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import DoctorFormAdmin from "../../components/DoctorFormAdmin";

function DoctorProfile() {
    const { user } = useSelector((state) => state.user);
    const params = useParams();
    const [doctor, setDoctor] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const getDoctorData = async () => {
        try {
            dispatch(showLoading());
            const response = await axios.post(
                "http://34.131.197.1/api/doctor/get-doctor-info-by-user-id",
                {
                    userId1: params.userId,
                },
                {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                    },
                }
            ).catch((error) => {
                if (error.response.status) {
                    toast.error('Session Expired');
                    sessionStorage.clear();
                    navigate("/login");
                }
            });

            dispatch(hideLoading());
            if (response.data.success) {
                console.log(response.data);
                setDoctor(response.data.data);
            }
        } catch (error) {
            console.log(error);
            dispatch(hideLoading());
        }
    };

    useEffect(() => {
        getDoctorData();
    }, []);
    return (
        <Layout>
            <h1 className="page-title">Doctor Profile</h1>
            <hr />
            {console.log(doctor)}
            {doctor && <DoctorFormAdmin initivalValues={doctor} />}
        </Layout>
    );
}

export default DoctorProfile;
