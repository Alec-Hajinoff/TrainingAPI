import React, { useState, useEffect } from "react";
import { coursesGet } from "./ApiService";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./Courses.css";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await coursesGet();
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

  const handleDownloadCSV = () => {
    if (courses.length === 0) return;

    const headers = Object.keys(courses[0]);

    const csvRows = [
      headers.join(","),

      ...courses.map((course) =>
        headers
          .map((header) => {
            const val =
              course[header] === null || course[header] === undefined
                ? ""
                : String(course[header]);

            const escaped = val.replace(/"/g, '""');
            return `"${escaped}"`;
          })
          .join(","),
      ),
    ];

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `courses_catalog_${new Date().toISOString().split("T")[0]}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="mt-4">
        <h2>Available workshops</h2>
        <div className="alert alert-info">Loading catalog...</div>
      </div>
    );
  }

  return (
    <div className="mt-5 text-start">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Available workshops ({courses.length})</h2>
        <button
          className="btn btn-outline-success btn-sm"
          onClick={handleDownloadCSV}
          disabled={courses.length === 0}
          title="Download all courses as CSV"
        >
          <i className="bi bi-download me-2"></i> Download CSV
        </button>
      </div>

      {courses.length === 0 ? (
        <div className="alert alert-info mt-3">
          No workshops available at the moment. You can request a custom
          programme.
        </div>
      ) : (
        <div className="mt-3">
          {courses.map((course) => (
            <div key={course.id} className="card mb-3">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h5 className="card-title">{course.course_title}</h5>
                    <h6 className="card-subtitle mb-2 text-muted">
                      {course.subject_area} &gt; {course.subject}
                    </h6>
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
                      {parseFloat(course.total_price).toFixed(2)} (excl. VAT)
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
                  <p className="text-muted small">{course.learning_outcomes}</p>
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
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Courses;
