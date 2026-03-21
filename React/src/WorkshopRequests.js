import React, { useState } from "react";
import { workshopRequests } from "./ApiService";
import "./WorkshopRequests.css";

const WorkshopRequests = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organisation: "",
    requirement_description: "",
    technology_area: "",
    team_size: "",
    preferred_timing: "",
    additional_details: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [generalError, setGeneralError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
      "name",
      "email",
      "organisation",
      "requirement_description",
      "technology_area",
      "team_size",
      "preferred_timing",
    ];

    requiredFields.forEach((field) => {
      if (!formData[field] || formData[field].trim() === "") {
        newErrors[field] = "This field is required";
      }
    });

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setGeneralError("");
    setSuccessMessage("");

    const submitData = new FormData();

    Object.keys(formData).forEach((key) => {
      submitData.append(key, formData[key]);
    });

    try {
      const response = await workshopRequests(submitData);

      if (response && response.success) {
        setSuccessMessage(
          "Workshop request submitted successfully! We will be in touch soon.",
        );

        setFormData({
          name: "",
          email: "",
          organisation: "",
          requirement_description: "",
          technology_area: "",
          team_size: "",
          preferred_timing: "",
          additional_details: "",
        });
        setTimeout(() => setSuccessMessage(""), 5000);
      } else {
        setGeneralError(
          response?.message || "Submission failed. Please try again.",
        );
      }
    } catch (error) {
      setGeneralError("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="workshop-request-container">
      <div className="workshop-message">
        Don’t see the right workshop? Tell us what capability your team needs to
        develop and we may be able to design a workshop for you.
      </div>

      {successMessage && (
        <div className="alert alert-success">{successMessage}</div>
      )}
      {generalError && <div className="alert alert-danger">{generalError}</div>}

      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="name" className="form-label">
              Full name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className={`form-control ${errors.name ? "is-invalid" : ""}`}
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && (
              <div className="invalid-feedback">{errors.name}</div>
            )}
          </div>

          <div className="col-md-6 mb-3">
            <label htmlFor="email" className="form-label">
              Email address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && (
              <div className="invalid-feedback">{errors.email}</div>
            )}
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="organisation" className="form-label">
            Organisation name *
          </label>
          <input
            type="text"
            id="organisation"
            name="organisation"
            className={`form-control ${
              errors.organisation ? "is-invalid" : ""
            }`}
            value={formData.organisation}
            onChange={handleChange}
          />
          {errors.organisation && (
            <div className="invalid-feedback">{errors.organisation}</div>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="requirement_description" className="form-label">
            Training requirement description *
          </label>
          <textarea
            id="requirement_description"
            name="requirement_description"
            rows="3"
            className={`form-control ${
              errors.requirement_description ? "is-invalid" : ""
            }`}
            value={formData.requirement_description}
            onChange={handleChange}
            placeholder="For example: We want a practical course on deploying internal AI tools using Python and OpenAI APIs for our analytics team."
          ></textarea>
          {errors.requirement_description && (
            <div className="invalid-feedback">
              {errors.requirement_description}
            </div>
          )}
        </div>

        <div className="row">
          <div className="col-md-4 mb-3">
            <label htmlFor="technology_area" className="form-label">
              Technology area *
            </label>
            <select
              id="technology_area"
              name="technology_area"
              className={`form-select ${
                errors.technology_area ? "is-invalid" : ""
              }`}
              value={formData.technology_area}
              onChange={handleChange}
            >
              <option value="">Select Area</option>
              <option value="Artificial Intelligence / LLMs">
                Artificial Intelligence / LLMs
              </option>
              <option value="Python / Data Science">
                Python / Data Science
              </option>
              <option value="Cloud / AWS / Azure">Cloud / AWS / Azure</option>
              <option value="DevOps / Kubernetes">DevOps / Kubernetes</option>
              <option value="Data Engineering">Data Engineering</option>
              <option value="Cybersecurity">Cybersecurity</option>
              <option value="Other">Other</option>
            </select>
            {errors.technology_area && (
              <div className="invalid-feedback">{errors.technology_area}</div>
            )}
          </div>

          <div className="col-md-4 mb-3">
            <label htmlFor="team_size" className="form-label">
              Team size *
            </label>
            <select
              id="team_size"
              name="team_size"
              className={`form-select ${errors.team_size ? "is-invalid" : ""}`}
              value={formData.team_size}
              onChange={handleChange}
            >
              <option value="">Select Size</option>
              <option value="1–5">1–5</option>
              <option value="6–10">6–10</option>
              <option value="11–20">11–20</option>
              <option value="20+">20+</option>
            </select>
            {errors.team_size && (
              <div className="invalid-feedback">{errors.team_size}</div>
            )}
          </div>

          <div className="col-md-4 mb-3">
            <label htmlFor="preferred_timing" className="form-label">
              Preferred timing *
            </label>
            <select
              id="preferred_timing"
              name="preferred_timing"
              className={`form-select ${
                errors.preferred_timing ? "is-invalid" : ""
              }`}
              value={formData.preferred_timing}
              onChange={handleChange}
            >
              <option value="">Select Timing</option>
              <option value="Within 1 month">Within 1 month</option>
              <option value="1–3 months">1–3 months</option>
              <option value="3–6 months">3–6 months</option>
              <option value="Flexible">Flexible</option>
            </select>
            {errors.preferred_timing && (
              <div className="invalid-feedback">{errors.preferred_timing}</div>
            )}
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="additional_details" className="form-label">
            Additional context (optional)
          </label>
          <textarea
            id="additional_details"
            name="additional_details"
            rows="2"
            className="form-control"
            value={formData.additional_details}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="text-center mt-4">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Submitting..." : "Submit your workshop request"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default WorkshopRequests;
