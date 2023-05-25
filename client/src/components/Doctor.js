import React from "react";
import { useNavigate } from "react-router-dom";
import "./Doctor.css";

function Doctor({ doctor }) {
  const navigate = useNavigate();
  return (
    <>
      <div
        className="doctor-card-main-container"
        onClick={() => navigate(`/book-appointment/${doctor._id}`)}
      >
        <div className="card-header-name">
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
            <div className="text-title">Phone Number</div>
            <div className="text-data">{doctor.phoneNumber}</div>
          </div>
          <div className="address">
            <div className="text-title">Address</div>
            <div className="text-data">{doctor.address}</div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexDirection: "row",
              width: "100%",
            }}
          >
            <div className="timing">
              <div className="text-title">Timings</div>
              <div className="text-data">
                {doctor.timings[0]} - {doctor.timings[1]}
              </div>
            </div>
            <div className="charge-per-visit">
              <div className="text-title">Charge Per Visit</div>
              <div className="text-data"> {doctor.feePerCunsultation} ₹</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Doctor;
