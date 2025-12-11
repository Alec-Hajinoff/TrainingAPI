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
            <option value="Personal Effectiveness">
              Personal Effectiveness
            </option>
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
            className={`form-select ${
              errors.delivery_type ? "is-invalid" : ""
            }`}
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
