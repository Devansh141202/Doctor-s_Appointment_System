import React, { useState } from "react";
import "../layout.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Badge, Modal } from "antd";
import { setUser } from "../redux/userSlice";
import "../pages/Login.css";
import { IoIosNotifications } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";

function Layout({ children }) {
    const [collapsed, setCollapsed] = useState(false);
    const [isModalOpen, setIsModelOpen] = useState(false);
    const { user } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const userMenu = [
        {
            name: "Home",
            path: "/",
            icon: "ri-home-line",
        },
        {
            name: "Appointments",
            path: "/appointments",
            icon: "ri-file-list-line",
        },
        {
            name: "Apply Doctor",
            path: "/user/apply-doctor",
            icon: "ri-hospital-line",
        },
    ];

    const doctorMenu = [
        {
            name: "Home",
            path: "/",
            icon: "ri-home-line",
        },
        {
            name: "Appointments",
            path: "/doctor/appointments",
            icon: "ri-file-list-line",
        },
        {
            name: "Profile",
            path: `/doctor/profile/${user?._id}`,
            icon: "ri-user-line",
        },
    ];

    const adminMenu = [
        {
            name: "Home",
            path: "/",
            icon: "ri-home-line",
        },
        {
            name: "Users",
            path: "/admin/userslist",
            icon: "ri-user-line",
        },
        {
            name: "Doctors",
            path: "/admin/doctorslist",
            icon: "ri-user-star-line",
        },
        {
            name: "Profile",
            path: "/profile",
            icon: "ri-user-line",
        },
    ];

    const menuToBeRendered = user?.role === "admin"
        ? adminMenu
        : user?.role === "doctor"
            ? doctorMenu
            : userMenu;
    const role = (user?.role);

    const conformLogout =() => {
        setIsModelOpen(false);
        sessionStorage.clear();
        dispatch(setUser(null));
        navigate("/login");
    }

    return (
        <div className="main">
            <div className="d-flex layout">
                <div
                    style={{ backgroundColor: "#0066bb" }}
                    onMouseEnter={() => setCollapsed(false)}
                    onMouseLeave={() => setCollapsed(true)}
                    className="sidebar"
                >
                    <div className="sidebar-header">
                        <h1 className="logo">SH</h1>
                        <h1 className="role" style={{ textTransform: 'uppercase' }}>{role}</h1>
                    </div>

                    <div className="menu">
                        {menuToBeRendered.map((menu) => {
                            const isActive = location.pathname === menu.path;
                            return (
                                <div
                                    className={`d-flex menu-item ${isActive && "active-menu-item"
                                        }`}
                                >
                                    <i className={menu.icon}></i>
                                    {!collapsed && <Link to={menu.path}>{menu.name}</Link>}
                                </div>
                            );
                        })}
                        <div
                            className={`d-flex menu-item `}
                        >
                            <i className="ri-logout-circle-line"></i>
                            {!collapsed && <div 
                            style={{
                                cursor: "pointer",
                            }}>
                                <div 
                                    style={{
                                        color: "rgba(255, 255, 255, 0.716)",
                                        textDecoration: "none",
                                        fontSize: "18px",
                                        padding: "0 10px"
                                    }}
                                    onClick={()=>setIsModelOpen(true)}
                                >
                                    Logout
                                </div>
                                <Modal
                                    title="Are you sure ?"
                                    visible={isModalOpen} 
                                    onOk={()=>{conformLogout()}}
                                    onCancel={()=>setIsModelOpen(false)}   
                                >
                                </Modal>
                            </div>}
                        </div>
                    </div>
                </div>

                <div className="content">
                    <div className="header">
                        {collapsed ? (
                            <>
                                {/* <i
                  className="ri-menu-2-fill header-action-icon"
                  onClick={() => setCollapsed(false)}
                ></i> */}
                                <GiHamburgerMenu
                                    onClick={() => setCollapsed(false)}
                                    style={{
                                        fontSize: "25px",
                                        cursor: "pointer",
                                        margin: "10px",
                                    }}
                                />
                            </>
                        ) : (
                            <i
                                className="ri-close-fill header-action-icon"
                                onClick={() => setCollapsed(true)}
                            ></i>
                        )}

                        <div className="d-flex align-items-center px-4">
                            <Badge
                                style={{ marginRight: "20px" }}
                                count={user?.unseenNotifications.length}
                                onClick={() => navigate("/notifications")}
                            >
                                <IoIosNotifications
                                    style={{
                                        width: "50px",
                                        fontSize: "25px",
                                        marginRight: "10px",
                                        cursor: "pointer"
                                    }}
                                />
                            </Badge>
                            <Link
                                style={{
                                    borderLeft: "2px solid black",
                                    padding: "5px",
                                }}
                                to="/profile-page"
                            >
                                <FaUserCircle style={{ margin: "5px", fontSize: "25px" }} />
                                {user?.name}
                            </Link>
                        </div>
                    </div>

                    <div className="body">{children}</div>
                </div>
            </div>
        </div>
    );
}

export default Layout;
