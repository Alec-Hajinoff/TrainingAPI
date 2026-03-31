import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { verifyEmail } from "./ApiService";
import "./VerifyEmail.css"; // NEW: CSS file for styling

function VerifyEmail() {
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const verifyToken = async () => {
      const queryParams = new URLSearchParams(location.search);
      const token = queryParams.get("token");

      if (!token) {
        setStatus("error");
        setMessage("No verification token provided.");
        return;
      }

      try {
        const data = await verifyEmail(token);

        if (data.success) {
          navigate("/RegisteredPage");
        } else {
          setStatus("error");
          setMessage(data.message || "Verification failed. Please try again.");
        }
      } catch (error) {
        setStatus("error");
        setMessage(error.message || "An error occurred during verification.");
      }
    };

    verifyToken();
  }, [location, navigate]);

  const handleRegisterClick = () => {
    navigate("/");
  };

  return (
    <div className="verify-email-container">
      <div className="verify-email-card">
        {status === "loading" && (
          <>
            <div className="spinner-container">
              <div className="spinner" role="status"></div>
            </div>
            <p className="verify-message">Verifying your email address...</p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="error-message" aria-live="polite">
              {message}
            </div>
            <button
              className="btn-secondary verify-button"
              onClick={handleRegisterClick}
            >
              Register a new account
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default VerifyEmail;
