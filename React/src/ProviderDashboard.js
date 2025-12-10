import React, { useState } from "react";
import "./ProviderDashboard.css";
import LogoutComponent from "./LogoutComponent";
import { inputDataFunction } from "./ApiService";

function ProviderDashboard() {
  const [formData, setFormData] = useState({
    course_title: "",
    description: "",
    learning_outcomes: "",
    subject_area: "",
    subject: "",
    delivery_type: "",
    country_of_delivery: "",
    duration: "",
    total_price: "",
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
    setSuccessMessage("");
    setGeneralError("");
  };

  const validateForm = () => {
    const newErrors = {};

    Object.keys(formData).forEach((key) => {
      if (!formData[key] || formData[key].trim() === "") {
        newErrors[key] = "This field is required";
      }
    });

    if (
      formData.duration &&
      (isNaN(formData.duration) || parseFloat(formData.duration) <= 0)
    ) {
      newErrors.duration = "Please enter a valid positive number";
    }

    if (
      formData.total_price &&
      (isNaN(formData.total_price) || parseFloat(formData.total_price) <= 0)
    ) {
      newErrors.total_price = "Please enter a valid positive number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setGeneralError("");
    setSuccessMessage("");

    const submitData = new FormData();

    Object.keys(formData).forEach((key) => {
      submitData.append(key, formData[key]);
    });

    try {
      const data = await inputDataFunction(submitData);

      if (data && data.success) {
        setFormData({
          course_title: "",
          description: "",
          learning_outcomes: "",
          subject_area: "",
          subject: "",
          delivery_type: "",
          country_of_delivery: "",
          duration: "",
          total_price: "",
        });
        setErrors({});
        setSuccessMessage("Course submitted successfully!");
        setTimeout(() => setSuccessMessage(""), 4000);
      } else {
        setGeneralError(
          data?.message || "Submission failed. Please try again."
        );
        setTimeout(() => setGeneralError(""), 4000);
      }
    } catch (error) {
      setGeneralError(error?.message || "Submission failed. Please try again.");
      setTimeout(() => setGeneralError(""), 4000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div>
        <p>
          To add a sustainability action or event, fill in all required fields
          below and click Submit.
        </p>
      </div>
      <div className="d-flex justify-content-end mb-3">
        <LogoutComponent />
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-group mb-3">
          <label htmlFor="course_title" className="form-label">
            Course Title *
          </label>
          <textarea
            id="course_title"
            className={`form-control ${
              errors.course_title ? "is-invalid" : ""
            }`}
            rows="3"
            name="course_title"
            value={formData.course_title}
            onChange={handleChange}
            required
            placeholder="For example: 'We installed solar panels' or 'We reduced waste by switching to recyclable packaging.'"
          />
          {errors.course_title && (
            <div className="invalid-feedback">{errors.course_title}</div>
          )}
        </div>

        <div className="form-group mb-3">
          <label htmlFor="description" className="form-label">
            Description *
          </label>
          <textarea
            id="description"
            className={`form-control ${errors.description ? "is-invalid" : ""}`}
            rows="10"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
          {errors.description && (
            <div className="invalid-feedback">{errors.description}</div>
          )}
        </div>

        <div className="form-group mb-3">
          <label htmlFor="learning_outcomes" className="form-label">
            Learning Outcomes *
          </label>
          <textarea
            id="learning_outcomes"
            className={`form-control ${
              errors.learning_outcomes ? "is-invalid" : ""
            }`}
            rows="10"
            name="learning_outcomes"
            value={formData.learning_outcomes}
            onChange={handleChange}
            required
          />
          {errors.learning_outcomes && (
            <div className="invalid-feedback">{errors.learning_outcomes}</div>
          )}
        </div>

        <div className="form-group mb-3">
          <label htmlFor="subject_area" className="form-label">
            Subject Area *
          </label>
          <select
            id="subject_area"
            className={`form-select ${errors.subject_area ? "is-invalid" : ""}`}
            name="subject_area"
            value={formData.subject_area}
            onChange={handleChange}
            required
          >
            <option value="">Select Subject Area</option>
            <option value="Subject Area 1">Subject Area 1</option>
            <option value="Subject Area 2">Subject Area 2</option>
          </select>
          {errors.subject_area && (
            <div className="invalid-feedback">{errors.subject_area}</div>
          )}
        </div>

        <div className="form-group mb-3">
          <label htmlFor="subject" className="form-label">
            Subject *
          </label>
          <select
            id="subject"
            className={`form-select ${errors.subject ? "is-invalid" : ""}`}
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
          >
            <option value="">Select Subject</option>
            <option value="Subject 1">Subject 1</option>
            <option value="Subject 2">Subject 2</option>
          </select>
          {errors.subject && (
            <div className="invalid-feedback">{errors.subject}</div>
          )}
        </div>

        <div className="form-group mb-3">
          <label htmlFor="delivery_type" className="form-label">
            Delivery Type *
          </label>
          <select
            id="delivery_type"
            className={`form-select ${
              errors.delivery_type ? "is-invalid" : ""
            }`}
            name="delivery_type"
            value={formData.delivery_type}
            onChange={handleChange}
            required
          >
            <option value="">Select Delivery Type</option>
            <option value="Delivery 1">Delivery 1</option>
            <option value="Delivery 2">Delivery 2</option>
          </select>
          {errors.delivery_type && (
            <div className="invalid-feedback">{errors.delivery_type}</div>
          )}
        </div>

        <div className="form-group mb-3">
          <label htmlFor="country_of_delivery" className="form-label">
            Country of Delivery *
          </label>
          <select
            id="country_of_delivery"
            className={`form-select ${
              errors.country_of_delivery ? "is-invalid" : ""
            }`}
            name="country_of_delivery"
            value={formData.country_of_delivery}
            onChange={handleChange}
            required
          >
            <option value="">Select Country</option>
            <option value="Country 1">Country 1</option>
            <option value="Country 2">Country 2</option>
          </select>
          {errors.country_of_delivery && (
            <div className="invalid-feedback">{errors.country_of_delivery}</div>
          )}
        </div>

        <div className="form-group mb-3">
          <label htmlFor="duration" className="form-label">
            Duration (hours) *
          </label>
          <input
            type="number"
            id="duration"
            className={`form-control ${errors.duration ? "is-invalid" : ""}`}
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            required
            min="0.1"
            max="999.9"
            step="0.1"
            placeholder="e.g., 2.5"
          />
          {errors.duration && (
            <div className="invalid-feedback">{errors.duration}</div>
          )}
        </div>

        <div className="form-group mb-3">
          <label htmlFor="total_price" className="form-label">
            Total Price (excluding VAT) *
          </label>
          <input
            type="number"
            id="total_price"
            className={`form-control ${errors.total_price ? "is-invalid" : ""}`}
            name="total_price"
            value={formData.total_price}
            onChange={handleChange}
            required
            min="0.01"
            max="99999999.99"
            step="0.01"
            placeholder="e.g., 99.99"
          />
          {errors.total_price && (
            <div className="invalid-feedback">{errors.total_price}</div>
          )}
        </div>

        <div className="d-flex flex-column align-items-end mb-3">
          {successMessage && (
            <div
              id="success-message"
              className="alert alert-success mb-2 w-100"
              role="status"
              aria-live="polite"
            >
              {successMessage}
            </div>
          )}

          {generalError && (
            <div
              id="error-message"
              className="alert alert-danger mb-2 w-100"
              role="alert"
              aria-live="polite"
            >
              {generalError}
            </div>
          )}

          {loading && (
            <div className="alert alert-info mb-2 w-100" role="status">
              Saving your course, please wait…
            </div>
          )}

          <button
            type="submit"
            className="btn btn-secondary"
            disabled={loading}
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProviderDashboard;
