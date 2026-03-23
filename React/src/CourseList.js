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
              : course,
          ),
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
        <h2>Your workshops</h2>
        <div className="alert alert-info">Loading workshops...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-4">
        <h2>Your workshops</h2>
        <div className="alert alert-danger">{error}</div>
        <button className="btn btn-secondary" onClick={loadCourses}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="mt-5">
      <h2>Your workshops ({courses.length})</h2>

      {courses.length === 0 ? (
        <div className="alert alert-info mt-3">
          Get started by creating your first workshop.
        </div>
      ) : (
        <div className="mt-3">
          {courses.map((course) => (
            <div key={course.id} className="card mb-3">
              <div className="card-body">
                {editingCourseId === course.id ? (
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
                                ),
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
