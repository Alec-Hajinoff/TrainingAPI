import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UserLogin.css";
import { loginUser, passwordResetLink } from "./ApiService";

function UserLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [resetMessage, setResetMessage] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  const clearResetMessageAfterDelay = () => {
    setTimeout(() => {
      setResetMessage("");
    }, 5000);
  };

  const clearErrorMessageAfterDelay = () => {
    setTimeout(() => {
      setErrorMessage("");
    }, 5000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleForgotPassword = async () => {
    const email = formData.email;

    if (!email || !email.trim()) {
      setErrorMessage("Please enter your email address first");
      clearErrorMessageAfterDelay();
      return;
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      setErrorMessage(
        "Please enter a valid email address (e.g., name@domain.com)",
      );
      clearErrorMessageAfterDelay();
      return;
    }

    setResetLoading(true);
    setResetMessage("");
    setErrorMessage("");

    try {
      await passwordResetLink(email);

      setResetMessage(
        "If an account exists for that email, we've sent a password reset link.",
      );
      clearResetMessageAfterDelay();

      setFormData({
        ...formData,
        password: "",
      });
    } catch (error) {
      setResetMessage(
        "If an account exists for that email, we've sent a password reset link.",
      );
      clearResetMessageAfterDelay();

      setFormData({
        ...formData,
        password: "",
      });
    } finally {
      setResetLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(formData.email)) {
      setErrorMessage(
        "Please enter a valid email address (e.g., name@domain.com)",
      );
      clearErrorMessageAfterDelay();
      return;
    }

    if (formData.password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long");
      clearErrorMessageAfterDelay();
      return;
    }

    setLoading(true);
    try {
      const data = await loginUser(formData);
      if (data.status === "success") {
        switch (data.user_type) {
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
      } else {
        setErrorMessage("Sign in failed. Please try again.");
        clearErrorMessageAfterDelay();

        setFormData({
          ...formData,
          password: "",
        });
      }
    } catch (error) {
      setErrorMessage(error.message);
      clearErrorMessageAfterDelay();

      setFormData({
        ...formData,
        password: "",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="row g-2" onSubmit={handleSubmit} noValidate>
      <div className="form-group">
        <input
          autoComplete="off"
          type="email"
          className="form-control"
          id="yourEmailLogin"
          name="email"
          required
          placeholder="Email address"
          value={formData.email}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <input
          autoComplete="off"
          type="password"
          className="form-control"
          id="yourPasswordLogin"
          name="password"
          required
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />
      </div>
      <div id="error-message-one" className="error" aria-live="polite">
        {errorMessage}
      </div>

      {resetMessage && (
        <div id="reset-message" className="reset-message" aria-live="polite">
          {resetMessage}
        </div>
      )}
      <button
        type="submit"
        className="btn btn-secondary"
        id="loginBtn"
        disabled={loading}
      >
        Login
        <span
          className="spinner-border spinner-border-sm"
          role="status"
          aria-hidden="true"
          id="spinnerLogin"
          style={{ display: loading ? "inline-block" : "none" }}
        ></span>
      </button>

      <div className="forgot-password-link-container">
        <button
          type="button"
          className="forgot-password-link"
          onClick={handleForgotPassword}
          disabled={resetLoading}
        >
          Forgot your password?
          {resetLoading && (
            <span
              className="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
              id="spinnerReset"
              style={{ marginLeft: "0.5rem" }}
            ></span>
          )}
        </button>
      </div>
      <div id="liveAlertPlaceholder"></div>
    </form>
  );
}

export default UserLogin;
