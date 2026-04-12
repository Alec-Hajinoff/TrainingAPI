import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { myAccountLink } from "./ApiService";
import "./MyAccountLink.css";

function MyAccountLink() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [sessionData, setSessionData] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await myAccountLink();
      if (data.logged_in === true) {
        setSessionData(data);
      } else {
        setSessionData(null);
      }
    } catch (err) {
      console.error("Session check failed:", err);
      setError(true);
      setSessionData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleMyAccountClick = () => {
    if (!sessionData) return;

    switch (sessionData.user_type) {
      case "provider":
        navigate("/ProviderDashboard");
        break;
      case "developer":
        navigate("/DeveloperDashboard");
        break;
      case "admin":
        navigate("/AdminDashboard");
        break;
      default:
        navigate("/");
        break;
    }
  };

  const formatUserType = (type) => {
    switch (type) {
      case "provider":
        return "Training Provider";
      case "developer":
        return "Developer";
      case "admin":
        return "Administrator";
      default:
        return type;
    }
  };

  if (loading) {
    return (
      <div className="my-account-loading">
        <div className="spinner-my-account"></div>
        <p>Checking your session...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-account-error">
        <p>Unable to verify session status.</p>
        <button className="retry-button" onClick={checkSession}>
          Retry
        </button>
      </div>
    );
  }

  if (!sessionData) {
    return null;
  }

  return (
    <div className="my-account-container">
      <button
        className="btn-my-account"
        onClick={handleMyAccountClick}
        aria-label="Go to your dashboard"
      >
        My Account →
      </button>
    </div>
  );
}

export default MyAccountLink;
