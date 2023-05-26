import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Button } from "antd";
import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import Home from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import ApplyDoctor from "./pages/ApplyDoctor";
import Notifications from "./pages/Notifications";
import Userslist from "./pages/Admin/Userslist";
import DoctorsList from "./pages/Admin/DoctorsList";
import Profile from "./pages/Doctor/Profile";
import BookAppointment from "./pages/BookAppointment";
import Appointments from "./pages/Appointments";
import DoctorAppointments from "./pages/Doctor/DoctorAppointments";
import PageNotFound from "./pages/PageNotFound";
import ForgotPassword from "./pages/ForgotPassword";
import ProfilePage from "./pages/ProfilePage";
import ResetPassword from "./pages/ResetPassword";
import ServerDown from "./pages/ServerDown";
import axios from "axios";
import { setServerStatus } from "./redux/serverStatusSlice";
import VerifyEmail from "./pages/VerifyEmail";
import EmailNotVerified from "./pages/EmailNotVerified";

function App() {
  const { isUp } = useSelector((state) => state.serverStatus);
  const { loading } = useSelector((state) => state.alerts);
  const dispatch = useDispatch();
  async function checkServer() {
    try {
      const response = await axios.get("/api/").catch((err) => {
        console.log(err);
        dispatch(setServerStatus(false));
      });
      if (response.data.success) {
        console.log("Server is up and running");
        dispatch(setServerStatus(true));
      }
    } catch (error) {
      console.log("Server is down");
      dispatch(setServerStatus(false));
    }
  }
  checkServer();

  return (
    <BrowserRouter>
      {loading && (
        <div className="spinner-parent">
          <div class="spinner-border" role="status"></div>
        </div>
      )}
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route
          path="/login"
          element={
            isUp ? (
              <PublicRoute>
                <Login />
              </PublicRoute>
            ) : (
              <Navigate replace to={"/server-down"} />
            )
          }
        />
        <Route
          path="/register"
          element={
            isUp ? (
              <PublicRoute>
                <Register />
              </PublicRoute>
            ) : (
              <Navigate replace to={"/server-down"} />
            )
          }
        />
        <Route
          path="/"
          element={
            isUp ? (
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            ) : (
              <Navigate replace to={"/server-down"} />
            )
          }
        />
        <Route
          path="/user/apply-doctor"
          element={
            isUp ? (
              <ProtectedRoute>
                <ApplyDoctor />
              </ProtectedRoute>
            ) : (
              <Navigate replace to={"/server-down"} />
            )
          }
        />
        <Route
          path="/notifications"
          element={
            isUp ? (
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            ) : (
              <Navigate replace to={"/server-down"} />
            )
          }
        />
        <Route
          path="/admin/userslist"
          element={
            isUp ? (
              <ProtectedRoute>
                <Userslist />
              </ProtectedRoute>
            ) : (
              <Navigate replace to={"/server-down"} />
            )
          }
        />

        <Route
          path="/admin/doctorslist"
          element={
            isUp ? (
              <ProtectedRoute>
                <DoctorsList />
              </ProtectedRoute>
            ) : (
              <Navigate replace to={"/server-down"} />
            )
          }
        />

        <Route
          path="/doctor/profile/:userId"
          element={
            isUp ? (
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            ) : (
              <Navigate replace to={"/server-down"} />
            )
          }
        />

        <Route
          path="/book-appointment/:doctorId"
          element={
            isUp ? (
              <ProtectedRoute>
                <BookAppointment />
              </ProtectedRoute>
            ) : (
              <Navigate replace to={"/server-down"} />
            )
          }
        />
        <Route
          path="/appointments"
          element={
            isUp ? (
              <ProtectedRoute>
                <Appointments />
              </ProtectedRoute>
            ) : (
              <Navigate replace to={"/server-down"} />
            )
          }
        />

        <Route
          path="/doctor/appointments"
          element={
            isUp ? (
              <ProtectedRoute>
                <DoctorAppointments />
              </ProtectedRoute>
            ) : (
              <Navigate replace to={"/server-down"} />
            )
          }
        />
        <Route
          path="/forgot-password"
          element={
            isUp ? (
              <PublicRoute>
                <ForgotPassword />
              </PublicRoute>
            ) : (
              <Navigate replace to={"/server-down"} />
            )
          }
        />
        <Route
          path="/reset-password/:token"
          element={
            isUp ? (
              <PublicRoute>
                <ResetPassword />
              </PublicRoute>
            ) : (
              <Navigate replace to={"/server-down"} />
            )
          }
        />
        <Route
          path="/profile-page"
          element={
            isUp ? (
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            ) : (
              <Navigate replace to={"/server-down"} />
            )
          }
        />
        <Route
          path="/email-not-verified"
          element={
            isUp ? (
              <ProtectedRoute>
                <EmailNotVerified />
              </ProtectedRoute>
            ) : (
              <Navigate replace to={"/server-down"} />
            )
          }
        />
        <Route
          path="/verify-email/:token"
          element={
            isUp ? (
              <PublicRoute>
                <VerifyEmail />
              </PublicRoute>
            ) : (
              <Navigate replace to={"/server-down"} />
            )
          }
        />
        <Route
          path="/server-down"
          element={
            !isUp ? (
              <PublicRoute>
                <ServerDown />
              </PublicRoute>
            ) : (
              <Navigate replace to={"/"} />
            )
          }
        />

        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
