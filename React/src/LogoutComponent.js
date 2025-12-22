import React from "react";
import { useNavigate } from "react-router-dom";
import "./LogoutComponent.css";
import { logoutUser } from "./ApiService";

const LogoutComponent = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate("/");
    } catch (error) {
      console.error(error?.message || "An unknown error occurred during logout");
    }
  };

  return (
    <button onClick={handleLogout} className="logout-button">
      Logout
    </button>
  );
};

export default LogoutComponent;