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
