import React, { useState } from "react";
import "./UserRegistration.css";
import { useNavigate } from "react-router-dom";
import { registerUser } from "./ApiService";

function UserRegistration() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    userType: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const userTypeTooltips = {
    provider: "Submit and manage training courses",
    developer: "Integrate API with LMS systems",
    admin: "Manage platform and providers",
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.userType) {
      setErrorMessage("Please select a user type");
      return;
    }

    if (formData.password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long");
      return;
    }

    setLoading(true);
    try {
      const data = await registerUser(formData);
      if (data.success) {
        navigate("/RegisteredPage");
      } else {
        setErrorMessage("Registration failed. Please try again.");
      }
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="row g-2" onSubmit={handleSubmit}>
      <div className="radio-group-simple mb-3">
        {["provider", "developer", "admin"].map((type) => (
          <div key={type} className="radio-simple">
            <label className="radio-label-simple">
              <input
                type="radio"
                name="userType"
                value={type}
                checked={formData.userType === type}
                onChange={handleChange}
                required
                className="radio-input-simple"
              />
              <span className="radio-text-simple">
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </span>
              <span
                className="question-mark-simple"
                title={userTypeTooltips[type]}
              >
                ?
              </span>
            </label>
          </div>
        ))}
      </div>

      <div className="form-group">
        <input
          autoComplete="off"
          type="text"
          pattern="[a-zA-Z ]+"
          className="form-control"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="Organisation name"
        />
      </div>
      <div className="form-group">
        <input
          autoComplete="off"
          type="email"
          pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
          className="form-control"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="Email address"
        />
      </div>
      <div className="form-group">
        <input
          autoComplete="off"
          type="password"
          className="form-control"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          minLength="8"
          placeholder="Choose a strong password"
        />
      </div>
      <div id="error-message" className="error" aria-live="polite">
        {errorMessage}
      </div>
      <button type="submit" className="btn btn-secondary">
        Register
        <span
          className="spinner-border spinner-border-sm"
          role="status"
          aria-hidden="true"
          id="spinnerRegister"
          style={{ display: loading ? "inline-block" : "none" }}
        ></span>
      </button>
      <div id="registerPlaceholder"></div>
    </form>
  );
}

export default UserRegistration;
