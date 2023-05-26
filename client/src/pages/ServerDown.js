import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setServerStatus } from "../redux/serverStatusSlice";

export default function ServerDown() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    return (
        <>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    flexDirection: "column",
                    height: "100vh",
                }}
            >
                <div style={{ fontSize: "30px", fontWeight: "700" }}>Whoops !</div>
                <div style={{ fontSize: "100px", fontWeight: "700" }}>
                    SERVER DOWN
                </div>
                <div style={{ fontSize: "30px", fontWeight: "700" }}>
                    Page Not Found
                </div>
                <button onClick={() => {
                    navigate(`/`);
                    dispatch(setServerStatus(true));
                }}
                    className="back-to-login-button">
                    {" "}
                    Back To Home
                </button>
            </div>
        </>
    );
}
