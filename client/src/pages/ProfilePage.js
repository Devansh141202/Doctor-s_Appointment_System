import React, { useState } from "react";
import Layout from "../components/Layout";
import ChangePasswordForm from "./ChangePasswordForm";
import "./ProfilePage.css";
import { useSelector } from "react-redux";
export default function ProfilePage() {
    const [wantChangePassword, setWantChangePassword] = useState(false);
    const changePasswordButtonHandler = () => {
        setWantChangePassword(!wantChangePassword);
    };
    const { user } = useSelector((state) => state.user);
    console.log(user);
    return (
        <>
            <Layout>
                <div className="profile-page-main-container">
                    <div className="profile-page">
                        <div className="book-appointment-card-header-name">
                            {user?.role === 'doctor' ? 'Dr.' : ''} {user?.name}
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
                                <div className="book-appointment-text-title">username</div>
                                <div className="book-appointment-text-data">
                                    {user?.username}
                                </div>
                            </div>
                            <div className="address">
                                <div className="book-appointment-text-title">Email</div>
                                <div className="book-appointment-text-data">{user?.email}</div>
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "flex-start",
                                    flexWrap: "wrap",
                                    gap: "200px",
                                    width: "100%",
                                }}
                            >
                                <div className="timing">
                                    <div className="book-appointment-text-title">
                                        Phone Number
                                    </div>
                                    <div className="book-appointment-text-data">
                                        {user?.mobileNumber || `+91`}
                                    </div>
                                </div>
                                <div className="charge-per-visit">
                                    <div className="book-appointment-text-title">
                                        Whatsapp Number
                                    </div>
                                    <div className="book-appointment-text-data">
                                        {user?.whatsappNumber || `+91`}
                                    </div>
                                </div>
                            </div>
                            <div className="website">
                                <div className="book-appointment-text-title">Password</div>
                                <div className="book-appointment-text-data">
                                    ********************
                                </div>
                            </div>
                            <button
                                className="change-password-button"
                                onClick={changePasswordButtonHandler}
                            >
                                Change Password
                            </button>

                            {wantChangePassword && (
                                <>
                                    <ChangePasswordForm />
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    );
}
