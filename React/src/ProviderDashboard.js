import React, { useState, useRef } from "react";
import "./ProviderDashboard.css";
import LogoutComponent from "./LogoutComponent";
import CourseSubmissionForm from "./CourseSubmissionForm";
import CourseList from "./CourseList";

function ProviderDashboard() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const submissionFormRef = useRef();

  const handleCourseAdded = () => {
    setRefreshTrigger((prev) => prev + 1);

    if (submissionFormRef.current) {
      submissionFormRef.current.resetForm();
    }
  };

  return (
    <div className="container provider-dashboard">
      <header className="dashboard-header">
        <div className="row">
          <div className="col-12">
            <h1 className="dashboard-title">Provider Dashboard</h1>
            <p className="dashboard-subtitle">
              Add and manage your training courses for corporate clients
            </p>
          </div>
        </div>
        <div className="row">
          <div className="col-12 d-flex justify-content-end">
            <LogoutComponent />
          </div>
        </div>
      </header>

      <main className="dashboard-content">
        <section className="form-section">
          <div className="section-header">
            <h2 className="section-title">Add New Course</h2>
            <p className="section-description">
              Fill in all required fields below and click Submit to add a new course to your catalogue.
            </p>
          </div>
          <CourseSubmissionForm
            ref={submissionFormRef}
            onCourseAdded={handleCourseAdded}
          />
        </section>

        <section className="list-section">
          <CourseList refreshTrigger={refreshTrigger} />
        </section>
      </main>
    </div>
  );
}

export default ProviderDashboard;


/*
import React, { useState, useRef } from "react";
import "./ProviderDashboard.css";
import LogoutComponent from "./LogoutComponent";
import CourseSubmissionForm from "./CourseSubmissionForm";
import CourseList from "./CourseList";

function ProviderDashboard() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const submissionFormRef = useRef();

  const handleCourseAdded = () => {
    setRefreshTrigger((prev) => prev + 1);

    if (submissionFormRef.current) {
      submissionFormRef.current.resetForm();
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

      <CourseSubmissionForm
        ref={submissionFormRef}
        onCourseAdded={handleCourseAdded}
      />

      <CourseList refreshTrigger={refreshTrigger} />
    </div>
  );
}

export default ProviderDashboard;
*/