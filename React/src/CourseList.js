import React, { useState, useEffect } from "react";
import { fetchUserCourses, updateCourse, deleteCourse } from "./ApiService";
import "./CourseList.css";

function CourseList({ refreshTrigger }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [updateMessage, setUpdateMessage] = useState({ type: "", text: "" });
  const [deleteMessage, setDeleteMessage] = useState({ type: "", text: "" });

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

  useEffect(() => {
    loadCourses();
  }, [refreshTrigger]);

  const loadCourses = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchUserCourses();
      if (data.success) {
        setCourses(data.courses || []);
      } else {
        setError(data.message || "Failed to load courses");
      }
    } catch (err) {
      setError("Failed to load courses. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (course) => {
    setEditingCourseId(course.id);
    setEditFormData({ ...course });
    setUpdateMessage({ type: "", text: "" });
    setDeleteMessage({ type: "", text: "" });
  };

  const handleCancelEdit = () => {
    setEditingCourseId(null);
    setEditFormData({});
    setUpdateMessage({ type: "", text: "" });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value,
    });
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setUpdateMessage({ type: "", text: "" });

    const submitData = new FormData();

    Object.keys(editFormData).forEach((key) => {
      if (key !== "id" && key !== "provider_users_id") {
        submitData.append(key, editFormData[key]);
      }
    });

    submitData.append("course_id", editingCourseId);

    try {
      const data = await updateCourse(submitData);
      if (data.success) {
        setUpdateMessage({
          type: "success",
          text: "Course updated successfully!",
        });

        setCourses(
          courses.map((course) =>
            course.id === editingCourseId
              ? { ...course, ...editFormData }
              : course
          )
        );

        setTimeout(() => {
          setEditingCourseId(null);
          setEditFormData({});
          setUpdateMessage({ type: "", text: "" });
        }, 3000);
      } else {
        setUpdateMessage({
          type: "error",
          text: data.message || "Update failed",
        });
      }
    } catch (err) {
      setUpdateMessage({
        type: "error",
        text: "Failed to update course. Please try again.",
      });
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm("Are you sure you want to delete this course?")) {
      return;
    }

    setDeleteMessage({ type: "", text: "" });

    try {
      const data = await deleteCourse(courseId);
      if (data.success) {
        setCourses(courses.filter((course) => course.id !== courseId));
        setDeleteMessage({
          type: "success",
          text: "Course deleted successfully!",
        });
        setTimeout(() => setDeleteMessage({ type: "", text: "" }), 3000);
      } else {
        setDeleteMessage({
          type: "error",
          text: data.message || "Failed to delete course",
        });
      }
    } catch (err) {
      setDeleteMessage({
        type: "error",
        text: "Failed to delete course. Please try again.",
      });
    }
  };

  if (loading) {
    return (
      <div className="mt-4">
        <h2>Your Courses</h2>
        <div className="alert alert-info">Loading courses...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-4">
        <h2>Your Courses</h2>
        <div className="alert alert-danger">{error}</div>
        <button className="btn btn-secondary" onClick={loadCourses}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="mt-5">
      <h2>Your Courses ({courses.length})</h2>

      {courses.length === 0 ? (
        <div className="alert alert-info mt-3">
          You haven't created any courses yet.
        </div>
      ) : (
        <div className="mt-3">
          {courses.map((course) => (
            <div key={course.id} className="card mb-3">
              <div className="card-body">
                {editingCourseId === course.id ? (
                  // Edit mode
                  <form onSubmit={handleUpdateSubmit}>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group mb-2">
                          <label className="form-label">Course Title *</label>
                          <textarea
                            className="form-control"
                            rows="2"
                            name="course_title"
                            value={editFormData.course_title || ""}
                            onChange={handleEditChange}
                            required
                          />
                        </div>

                        <div className="form-group mb-2">
                          <label className="form-label">Subject Area *</label>
                          <select
                            className="form-select"
                            name="subject_area"
                            value={editFormData.subject_area || ""}
                            onChange={handleEditChange}
                            required
                          >
                            <option value="">Select Subject Area</option>
                            {Object.keys(subjectOptions).map((area) => (
                              <option key={area} value={area}>
                                {area}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="form-group mb-2">
                          <label className="form-label">Subject *</label>
                          <select
                            className="form-select"
                            name="subject"
                            value={editFormData.subject || ""}
                            onChange={handleEditChange}
                            required
                            disabled={!editFormData.subject_area}
                          >
                            <option value="">
                              {editFormData.subject_area
                                ? `Select ${editFormData.subject_area} Subject`
                                : "Select Subject Area first"}
                            </option>
                            {editFormData.subject_area &&
                              subjectOptions[editFormData.subject_area]?.map(
                                (subject) => (
                                  <option key={subject} value={subject}>
                                    {subject}
                                  </option>
                                )
                              )}
                          </select>
                        </div>

                        <div className="form-group mb-2">
                          <label className="form-label">Delivery Type *</label>
                          <select
                            className="form-select"
                            name="delivery_type"
                            value={editFormData.delivery_type || ""}
                            onChange={handleEditChange}
                            required
                          >
                            <option value="">Select Delivery Type</option>
                            <option value="In-person">In-person</option>
                            <option value="Virtual">Virtual</option>
                            <option value="Digital">Digital</option>
                            <option value="Blended">Blended</option>
                          </select>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="form-group mb-2">
                          <label className="form-label">
                            Country of Delivery *
                          </label>
                          <select
                            className="form-select"
                            name="country_of_delivery"
                            value={editFormData.country_of_delivery || ""}
                            onChange={handleEditChange}
                            required
                          >
                            <option value="">Select Country</option>
                            {countryOptions.map((country) => (
                              <option key={country} value={country}>
                                {country}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="form-group mb-2">
                          <label className="form-label">
                            Duration (hours) *
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            name="duration"
                            value={editFormData.duration || ""}
                            onChange={handleEditChange}
                            required
                            min="0.1"
                            step="0.1"
                          />
                        </div>

                        <div className="form-group mb-2">
                          <label className="form-label">
                            Total Price (excluding VAT) *
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            name="total_price"
                            value={editFormData.total_price || ""}
                            onChange={handleEditChange}
                            required
                            min="0.01"
                            step="0.01"
                          />
                        </div>
                      </div>

                      <div className="col-12">
                        <div className="form-group mb-2">
                          <label className="form-label">Description *</label>
                          <textarea
                            className="form-control"
                            rows="3"
                            name="description"
                            value={editFormData.description || ""}
                            onChange={handleEditChange}
                            required
                          />
                        </div>

                        <div className="form-group mb-3">
                          <label className="form-label">
                            Learning Outcomes *
                          </label>
                          <textarea
                            className="form-control"
                            rows="3"
                            name="learning_outcomes"
                            value={editFormData.learning_outcomes || ""}
                            onChange={handleEditChange}
                            required
                          />
                        </div>
                      </div>

                      {/* New Provider Information Fields in Edit Mode */}
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group mb-2">
                            <label className="form-label">
                              Provider Name *
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              name="provider_name"
                              value={editFormData.provider_name || ""}
                              onChange={handleEditChange}
                              required
                              maxLength="255"
                            />
                          </div>

                          <div className="form-group mb-2">
                            <label className="form-label">
                              Contact Email *
                            </label>
                            <input
                              type="email"
                              className="form-control"
                              name="contact_email"
                              value={editFormData.contact_email || ""}
                              onChange={handleEditChange}
                              required
                              maxLength="255"
                            />
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="form-group mb-2">
                            <label className="form-label">
                              Contact Phone *
                            </label>
                            <input
                              type="tel"
                              className="form-control"
                              name="contact_phone"
                              value={editFormData.contact_phone || ""}
                              onChange={handleEditChange}
                              required
                              maxLength="50"
                            />
                          </div>

                          <div className="form-group mb-2">
                            <label className="form-label">
                              Provider Website *
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              name="provider_website"
                              value={editFormData.provider_website || ""}
                              onChange={handleEditChange}
                              required
                              maxLength="1024"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {updateMessage.text && (
                      <div
                        className={`alert ${
                          updateMessage.type === "success"
                            ? "alert-success"
                            : "alert-danger"
                        } mb-3`}
                      >
                        {updateMessage.text}
                      </div>
                    )}

                    <div className="d-flex justify-content-end gap-2">
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary">
                        Save Changes
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h5 className="card-title">{course.course_title}</h5>
                        <h6 className="card-subtitle mb-2 text-muted">
                          {course.subject_area} &gt; {course.subject}
                        </h6>
                      </div>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleEditClick(course)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDeleteCourse(course.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    <div className="row mt-3">
                      <div className="col-md-6">
                        <p className="mb-1">
                          <strong>Delivery:</strong> {course.delivery_type}
                        </p>
                        <p className="mb-1">
                          <strong>Country:</strong> {course.country_of_delivery}
                        </p>
                        <p className="mb-1">
                          <strong>Duration:</strong> {course.duration} hours
                        </p>
                        <p className="mb-1">
                          <strong>Price:</strong> £
                          {parseFloat(course.total_price).toFixed(2)} (excl.
                          VAT)
                        </p>
                      </div>
                      <div className="col-md-6">
                        <p className="mb-1">
                          <strong>Description:</strong>
                        </p>
                        <p className="text-muted small">{course.description}</p>
                      </div>
                    </div>

                    <div className="mt-2">
                      <p className="mb-1">
                        <strong>Learning Outcomes:</strong>
                      </p>
                      <p className="text-muted small">
                        {course.learning_outcomes}
                      </p>
                    </div>

                    {/* New Provider Information in Display Mode */}
                    <div className="mt-3 pt-3 border-top">
                      <h6 className="mb-2">Provider Information</h6>
                      <div className="row">
                        <div className="col-md-6">
                          <p className="mb-1">
                            <strong>Provider:</strong> {course.provider_name}
                          </p>
                          <p className="mb-1">
                            <strong>Email:</strong> {course.contact_email}
                          </p>
                        </div>
                        <div className="col-md-6">
                          <p className="mb-1">
                            <strong>Phone:</strong> {course.contact_phone}
                          </p>
                          <p className="mb-1">
                            <strong>Website:</strong>{" "}
                            <a
                              href={
                                course.provider_website &&
                                course.provider_website.startsWith("http")
                                  ? course.provider_website
                                  : `https://${course.provider_website}`
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {course.provider_website}
                            </a>
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {deleteMessage.text && (
        <div
          className={`alert ${
            deleteMessage.type === "success" ? "alert-success" : "alert-danger"
          } mt-3`}
        >
          {deleteMessage.text}
        </div>
      )}
    </div>
  );
}

export default CourseList;
