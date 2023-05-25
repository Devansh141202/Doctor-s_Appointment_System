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
            <div className="book-appointment-card-header-name">Dr.</div>
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
                <div className="book-appointment-text-title">Phone Number</div>
                <div className="book-appointment-text-data">
                  doctor.phoneNumber
                </div>
              </div>
              <div className="address">
                <div className="book-appointment-text-title">Address</div>
                <div className="book-appointment-text-data">
                  doctor.phoneNumber
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
                    doctor.phoneNumber
                  </div>
                </div>
                <div className="charge-per-visit">
                  <div className="book-appointment-text-title">
                    Charge Per Visit
                  </div>
                  <div className="book-appointment-text-data">
                    doctor.phoneNumber ₹
                  </div>
                </div>
              </div>
              <div className="website">
                <div className="book-appointment-text-title">Website</div>
                <div className="book-appointment-text-data">
                  doctor.phoneNumber
                </div>
              </div>
              <button
                className="check-availability-button"
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
