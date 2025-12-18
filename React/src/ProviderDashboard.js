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
            <p className="dashboard-subtitle">
              Create and maintain your corporate training catalogue
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
