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

  const countryOptions = [
    "Global",
    "Austria",
    "Belgium",
    "Bulgaria",
    "Canada",
    "Croatia",
    "Cyprus",
    "Czech Republic",
    "Denmark",
    "Estonia",
    "Finland",
    "France",
    "Germany",
    "Greece",
    "Hungary",
    "Ireland",
    "Italy",
    "Latvia",
    "Lithuania",
    "Luxembourg",
    "Malta",
    "Netherlands",
    "Poland",
    "Portugal",
    "Romania",
    "Slovakia",
    "Slovenia",
    "Spain",
    "Sweden",
    "United Kingdom",
    "United States",
  ];

  const subjectOptions = {
    "Accounting & Finance": [
      "AAT",
      "ACA",
      "ACCA",
      "Budgeting, Forecasting & Cost Control",
      "CFA",
      "CIMA",
      "Finance Business Partnering",
      "Financial Controls and Internal Audit",
      "Financial Modelling",
      "Financial Reporting",
      "Financial Statements",
    ],
    "Banking & Capital Markets": [
      "Bank Analysis",
      "Banking",
      "Capital Markets & Investment",
      "Chartered Banker Institute",
      "Corporate & Credit Banking",
      "Corporate Finance",
      "Energy Trading & Finance",
      "Financial Services",
      "FinTech",
      "Insurance Analysis",
      "London Metal Exchange Training",
      "Private Equity",
      "Project Finance",
      "Real Estate",
      "Specialist Qualifications",
      "Structured Finance",
      "Trade & Transaction Banking",
    ],
    Commercial: [
      "CIPS",
      "Commercial Awareness",
      "Contract Management",
      "Negotiating Skills",
      "Procurement",
      "Supply Chain",
      "Supplier Management",
    ],
    "Customer Service": ["Customer Service Excellence", "Marketing", "Sales"],
    "Data, Analytics & AI": [
      "Applied Finance",
      "AWS Data and Machine Learning",
      "Data Analysis",
      "Data Engineering",
      "Data Manipulation",
      "Data Science and AI",
      "Data Visualisation",
      "Google Cloud Platform Data",
      "Importing & Cleaning Data",
      "Microsoft Power BI",
      "Microsoft SQL Server",
      "Oracle Database",
      "Probability & Statistics",
      "Programming",
      "Reporting",
    ],
    ESG: [
      "Climate Change",
      "ESG Data and Technology",
      "ESG Risk Management",
      "Introduction to ESG",
      "Introduction to Sustainable Finance",
      "Investment and Asset Management",
      "Leadership Sustainability",
      "Sustainable Finance in Focus",
    ],
    "Health & Safety": ["First Aid", "IOSH", "NEBOSH"],
    HR: ["CIPD", "HR Essentials"],
    Insurance: [
      "Chartered Insurance Institute",
      "Commercial Lines",
      "Foundations of General Insurance",
      "Health and Protection",
      "Insurance Distribution Directive",
      "Introduction to Insurance",
      "Introduction to the London Market",
      "Personal Lines",
      "Specialist Industries",
    ],
    "Leadership & Management": [
      "Culture Change",
      "High Performing Teams",
      "Leadership Development",
      "Managing People",
      "Managing Change",
      "Performance Coaching",
      "Performance Environments",
    ],
    Legal: ["GDL", "Legal Finance", "LPC", "Professional Skills Course", "SQE"],
    Marketing: [
      "Brand and Product",
      "Copywriting and Creative",
      "Customer Experience",
      "Digital Marketing",
      "Marketing Communications",
      "Marketing Compliance",
      "Sales and Business Development",
      "Strategy and Planning",
      "Sustainability in Marketing",
    ],
    Operations: ["Operations Management", "Operational Excellence"],
    "Personal Effectiveness": [
      "Agility",
      "C-Suite & Board Education",
      "Collaboration",
      "Communication",
      "Diversity, Equality & Inclusion",
      "Emotional Intelligence",
      "Giving Feedback",
      "Goal Setting",
      "Having an Impact",
      "Having effective conversations",
      "Innovation",
      "Leading in Ambiguity",
      "Presentation",
      "Professional Development",
      "Stakeholder Management",
      "Storytelling",
      "Wellbeing & Resilience",
    ],
    "Project Management": [
      "Change Management",
      "Agile",
      "APM",
      "APMG",
      "MSP",
      "MoR",
      "MoV",
      "PRINCE2",
      "Project Management",
    ],
    "Risk & Regulatory": [
      "Consumer Duty",
      "Financial Crime",
      "Financial Risks",
      "Governance, Conduct & Compliance",
      "ICA",
      "Non-Financial Risks",
      "Rules & Regulations",
    ],
    "Service Management": ["LEAN", "Service Delivery"],
    "Technology, Digital & Cyber": [
      "Applications",
      "BCS",
      "Cloud & Visualisation",
      "Cyber Security",
      "DevOps",
      "Digital Productivity & Office Applications",
      "Enterprise Applications",
      "Enterprise Systems & Architecture",
      "Infrastructure & Networks",
      "IT Service Management",
      "Software Engineering",
    ],
    "Wealth & Asset Management": [
      "Alternatives",
      "Asset Management",
      "Asset Servicing",
      "CISI",
      "Wealth Management & Private Banking",
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

    // Email validation
    if (
      formData.contact_email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact_email)
    ) {
      newErrors.contact_email = "Please enter a valid email address";
    }

    // URL validation (accepts https://www.example.com, www.example.com, example.com)

    if (formData.provider_website) {
      const url = formData.provider_website.trim();

      const urlPattern =
        /^(https?:\/\/)?(www\.)?[a-zA-Z0-9][a-zA-Z0-9-]*(\.[a-zA-Z]{2,})+(\/[^\s]*)?$/;

      if (!urlPattern.test(url)) {
        newErrors.provider_website =
          "Please enter a valid URL (e.g., example.com, www.example.com, or https://example.com)";
      }
    }

    // Phone number validation (basic - allows numbers, spaces, dashes, parentheses)
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
    <form onSubmit={handleSubmit}>
      <div className="form-group mb-3">
        <label htmlFor="course_title" className="form-label">
          Course Title *
        </label>
        <textarea
          id="course_title"
          className={`form-control ${errors.course_title ? "is-invalid" : ""}`}
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
          <option value="Accounting & Finance">Accounting & Finance</option>
          <option value="Banking & Capital Markets">
            Banking & Capital Markets
          </option>
          <option value="Commercial">Commercial</option>
          <option value="Customer Service">Customer Service</option>
          <option value="Data, Analytics & AI">Data, Analytics & AI</option>
          <option value="ESG">ESG</option>
          <option value="Health & Safety">Health & Safety</option>
          <option value="HR">HR</option>
          <option value="Insurance">Insurance</option>
          <option value="Leadership & Management">
            Leadership & Management
          </option>
          <option value="Legal">Legal</option>
          <option value="Marketing">Marketing</option>
          <option value="Operations">Operations</option>
          <option value="Personal Effectiveness">Personal Effectiveness</option>
          <option value="Project Management">Project Management</option>
          <option value="Risk & Regulatory">Risk & Regulatory</option>
          <option value="Service Management">Service Management</option>
          <option value="Technology, Digital & Cyber">
            Technology, Digital & Cyber
          </option>
          <option value="Wealth & Asset Management">
            Wealth & Asset Management
          </option>
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
          Delivery Type *
        </label>
        <select
          id="delivery_type"
          className={`form-select ${errors.delivery_type ? "is-invalid" : ""}`}
          name="delivery_type"
          value={formData.delivery_type}
          onChange={handleChange}
          required
        >
          <option value="">Select Delivery Type</option>
          <option value="In-person">In-person</option>
          <option value="Virtual">Virtual</option>
          <option value="Digital">Digital</option>
          <option value="Blended">Blended</option>
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

      <div className="form-group mb-3">
        <label htmlFor="provider_name" className="form-label">
          Provider Name *
        </label>
        <input
          type="text"
          id="provider_name"
          className={`form-control ${errors.provider_name ? "is-invalid" : ""}`}
          name="provider_name"
          value={formData.provider_name}
          onChange={handleChange}
          required
          maxLength="255"
          placeholder="e.g., ABC Training Ltd"
        />
        {errors.provider_name && (
          <div className="invalid-feedback">{errors.provider_name}</div>
        )}
      </div>

      <div className="form-group mb-3">
        <label htmlFor="contact_email" className="form-label">
          Contact Email *
        </label>
        <input
          type="email"
          id="contact_email"
          className={`form-control ${errors.contact_email ? "is-invalid" : ""}`}
          name="contact_email"
          value={formData.contact_email}
          onChange={handleChange}
          required
          maxLength="255"
          placeholder="e.g., contact@example.com"
        />
        {errors.contact_email && (
          <div className="invalid-feedback">{errors.contact_email}</div>
        )}
      </div>

      <div className="form-group mb-3">
        <label htmlFor="contact_phone" className="form-label">
          Contact Phone *
        </label>
        <input
          type="tel"
          id="contact_phone"
          className={`form-control ${errors.contact_phone ? "is-invalid" : ""}`}
          name="contact_phone"
          value={formData.contact_phone}
          onChange={handleChange}
          required
          maxLength="50"
          placeholder="e.g., +44 20 7123 4567"
        />
        {errors.contact_phone && (
          <div className="invalid-feedback">{errors.contact_phone}</div>
        )}
      </div>

      <div className="form-group mb-3">
        <label htmlFor="provider_website" className="form-label">
          Provider Website *
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
          required
          maxLength="1024"
          placeholder="e.g., https://www.example.com"
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
          Submit
        </button>
      </div>
    </form>
  );
});

export default CourseSubmissionForm;
