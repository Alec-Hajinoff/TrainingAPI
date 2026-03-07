import React, { useState, useEffect } from "react";
import { coursesGet } from "./ApiService";
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

  if (loading) {
    return (
      <div className="mt-4">
        <h2>Available Courses</h2>
        <div className="alert alert-info">Loading catalog...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-4">
        <h2>Available Courses</h2>
        <div className="alert alert-danger">{error}</div>
        <button className="btn btn-secondary" onClick={loadCourses}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="mt-5 text-start">
      <h2>Available Courses ({courses.length})</h2>

      {courses.length === 0 ? (
        <div className="alert alert-info mt-3">
          No courses are currently available in the directory.
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
                      {course.subject_area} > {course.subject}
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
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Courses;
