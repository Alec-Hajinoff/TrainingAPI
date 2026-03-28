import React, { useState, forwardRef, useImperativeHandle } from "react";
import { inputDataFunction } from "./ApiService";
import "./CourseSubmissionForm.css";

const CourseSubmissionForm = forwardRef((props, ref) => {
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
    provider_name: "",
    contact_email: "",
    contact_phone: "",
    provider_website: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [generalError, setGeneralError] = useState("");

  useImperativeHandle(ref, () => ({
    resetForm: () => {
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
        provider_name: "",
        contact_email: "",
        contact_phone: "",
        provider_website: "",
      });
      setErrors({});
      setSuccessMessage("");
      setGeneralError("");
    },
  }));

  const countryOptions = ["Global"];

  const subjectOptions = {
    "Artificial Intelligence & Machine Learning": [
      "Applied Machine Learning",
      "Large Language Models (LLMs)",
      "AI Application Development",
      "Prompt Engineering",
      "Natural Language Processing",
      "AI for Business Applications",
      "Responsible & Ethical AI",
    ],
    "Data Engineering & Data Platforms": [
      "Modern Data Architecture",
      "Data Engineering with Python",
      "ETL / ELT Pipelines",
      "Apache Spark",
      "Data Warehousing",
      "Data Lakehouse Platforms",
    ],
    "Data Analysis & Visualisation": [
      "Python for Data Analysis",
      "SQL for Data Analysis",
      "Power BI",
      "Tableau",
      "Data Visualisation Techniques",
      "Exploratory Data Analysis",
    ],
    "Software Engineering": [
      "Python Programming",
      "JavaScript Development",
      "Backend API Development",
      "Software Architecture",
      "Testing & Test Automation",
      "Clean Code & Refactoring",
    ],
    "Cloud & Infrastructure": [
      "AWS Fundamentals",
      "Azure Fundamentals",
      "Google Cloud Platform",
      "Cloud Architecture",
      "Serverless Computing",
      "Infrastructure as Code",
    ],
    "DevOps & Platform Engineering": [
      "Docker",
      "Kubernetes",
      "CI/CD Pipelines",
      "DevOps Foundations",
      "Observability & Monitoring",
      "Platform Engineering",
    ],
    Cybersecurity: [
      "Cybersecurity Fundamentals",
      "Cloud Security",
      "Application Security",
      "Security Operations",
      "Threat Detection",
      "Secure Software Development",
    ],
    "Automation & Productivity Engineering": [
      "Python Automation",
      "Process Automation",
      "Low-Code / No-Code Platforms",
      "API Integrations",
      "Workflow Automation",
    ],
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "subject_area") {
      setFormData((prev) => ({
        ...prev,
        subject: "",
      }));

      if (errors.subject) {
        setErrors((prev) => ({
          ...prev,
          subject: "",
        }));
      }
    }

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

    if (
      formData.contact_email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact_email)
    ) {
      newErrors.contact_email = "Please enter a valid email address";
    }

    if (formData.provider_website) {
      const url = formData.provider_website.trim();

      const urlPattern =
        /^(https?:\/\/)?(www\.)?[a-zA-Z0-9][a-zA-Z0-9-]*(\.[a-zA-Z]{2,})+(\/[^\s]*)?$/;

      if (!urlPattern.test(url)) {
        newErrors.provider_website =
          "Please enter a valid URL (e.g., example.com, www.example.com, or https://example.com)";
      }
    }

    if (formData.contact_phone) {
      const phonePattern = /^[\d\s\-()+]{10,}$/;
      if (!phonePattern.test(formData.contact_phone)) {
        newErrors.contact_phone = "Please enter a valid phone number";
      }
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
        setSuccessMessage("Course submitted successfully!");
        setTimeout(() => setSuccessMessage(""), 4000);

        if (props.onCourseAdded) {
          props.onCourseAdded();
        }
      } else {
        setGeneralError(
          data?.message || "Submission failed. Please try again.",
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
    <form onSubmit={handleSubmit} noValidate>
      <div className="form-group mb-3">
        <label htmlFor="course_title" className="form-label">
          Workshop title *
        </label>
        <textarea
          id="course_title"
          className={`form-control ${errors.course_title ? "is-invalid" : ""}`}
          rows="3"
          name="course_title"
          value={formData.course_title}
          onChange={handleChange}
          placeholder="e.g. Building and Deploying Machine Learning Models with Python"
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
          placeholder="e.g. This hands-on workshop introduces participants to building and deploying machine learning models using Python. Through practical exercises, attendees will work with real datasets, develop models using libraries such as scikit-learn, and learn how to evaluate and deploy models into production environments…"
        />
        {errors.description && (
          <div className="invalid-feedback">{errors.description}</div>
        )}
      </div>

      <div className="form-group mb-3">
        <label htmlFor="learning_outcomes" className="form-label">
          Learning outcomes *
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
          placeholder="e.g. • Build and train machine learning models using Python • Work with real-world datasets and perform data preprocessing • Evaluate model performance using appropriate metrics • Deploy models into production environments • Apply best practices for scalable and maintainable ML workflows"
        />
        {errors.learning_outcomes && (
          <div className="invalid-feedback">{errors.learning_outcomes}</div>
        )}
      </div>

      <div className="form-group mb-3">
        <label htmlFor="subject_area" className="form-label">
          Subject area *
        </label>
        <select
          id="subject_area"
          className={`form-select ${errors.subject_area ? "is-invalid" : ""}`}
          name="subject_area"
          value={formData.subject_area}
          onChange={handleChange}
        >
          <option value="">Select Subject Area</option>
          {Object.keys(subjectOptions).map((area) => (
            <option key={area} value={area}>
              {area}
            </option>
          ))}
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
          disabled={!formData.subject_area}
        >
          <option value="">
            {formData.subject_area
              ? `Select ${formData.subject_area} Subject`
              : "Select Subject Area first"}
          </option>

          {formData.subject_area &&
            subjectOptions[formData.subject_area]?.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
        </select>
        {errors.subject && (
          <div className="invalid-feedback">{errors.subject}</div>
        )}
      </div>

      <div className="form-group mb-3">
        <label htmlFor="delivery_type" className="form-label">
          Delivery type *
        </label>
        <select
          id="delivery_type"
          className={`form-select ${errors.delivery_type ? "is-invalid" : ""}`}
          name="delivery_type"
          value={formData.delivery_type}
          onChange={handleChange}
        >
          <option value="">Select Delivery Type</option>

          <option value="Virtual">Virtual</option>
        </select>
        {errors.delivery_type && (
          <div className="invalid-feedback">{errors.delivery_type}</div>
        )}
      </div>

      <div className="form-group mb-3">
        <label htmlFor="country_of_delivery" className="form-label">
          Country of delivery *
        </label>
        <select
          id="country_of_delivery"
          className={`form-select ${
            errors.country_of_delivery ? "is-invalid" : ""
          }`}
          name="country_of_delivery"
          value={formData.country_of_delivery}
          onChange={handleChange}
        >
          <option value="">Select Country</option>
          {countryOptions.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
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
          min="0.1"
          max="999.9"
          step="0.1"
        />
        {errors.duration && (
          <div className="invalid-feedback">{errors.duration}</div>
        )}
      </div>

      <div className="form-group mb-3">
        <label htmlFor="total_price" className="form-label">
          Total price £ (excluding VAT) *
        </label>
        <input
          type="number"
          id="total_price"
          className={`form-control ${errors.total_price ? "is-invalid" : ""}`}
          name="total_price"
          value={formData.total_price}
          onChange={handleChange}
          min="0.01"
          max="99999999.99"
          step="0.01"
        />
        {errors.total_price && (
          <div className="invalid-feedback">{errors.total_price}</div>
        )}
      </div>

      <div className="form-group mb-3">
        <label htmlFor="provider_name" className="form-label">
          Provider or independent instructor name *
        </label>
        <input
          type="text"
          id="provider_name"
          className={`form-control ${errors.provider_name ? "is-invalid" : ""}`}
          name="provider_name"
          value={formData.provider_name}
          onChange={handleChange}
          maxLength="255"
        />
        {errors.provider_name && (
          <div className="invalid-feedback">{errors.provider_name}</div>
        )}
      </div>

      <div className="form-group mb-3">
        <label htmlFor="contact_email" className="form-label">
          Contact email *
        </label>
        <input
          type="email"
          id="contact_email"
          className={`form-control ${errors.contact_email ? "is-invalid" : ""}`}
          name="contact_email"
          value={formData.contact_email}
          onChange={handleChange}
          maxLength="255"
        />
        {errors.contact_email && (
          <div className="invalid-feedback">{errors.contact_email}</div>
        )}
      </div>

      <div className="form-group mb-3">
        <label htmlFor="contact_phone" className="form-label">
          Contact phone *
        </label>
        <input
          type="tel"
          id="contact_phone"
          className={`form-control ${errors.contact_phone ? "is-invalid" : ""}`}
          name="contact_phone"
          value={formData.contact_phone}
          onChange={handleChange}
          maxLength="50"
        />
        {errors.contact_phone && (
          <div className="invalid-feedback">{errors.contact_phone}</div>
        )}
      </div>

      <div className="form-group mb-3">
        <label htmlFor="provider_website" className="form-label">
          Provider or independent instructor website *
        </label>
        <input
          type="text"
          id="provider_website"
          className={`form-control ${
            errors.provider_website ? "is-invalid" : ""
          }`}
          name="provider_website"
          value={formData.provider_website}
          onChange={handleChange}
          maxLength="1024"
        />
        {errors.provider_website && (
          <div className="invalid-feedback">{errors.provider_website}</div>
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

        <button type="submit" className="btn btn-secondary" disabled={loading}>
          Submit your workshop
        </button>
      </div>
    </form>
  );
});

export default CourseSubmissionForm;
