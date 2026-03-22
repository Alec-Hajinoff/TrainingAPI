import React from "react";
import "./AdminDashboard.css";
import LogoutComponent from "./LogoutComponent";
import WorkshopsRequested from "./WorkshopsRequested";
import CoursesAdmin from "./CoursesAdmin";

function AdminDashboard() {
  return (
    <div className="container">
      <div>
        <p>
          Welcome to the admin dashboard. Here you can manage the platform,
          providers, and system configurations.
        </p>
      </div>
      <div className="d-flex justify-content-end mb-3">
        <LogoutComponent />
      </div>
      <div className="dashboard-content">
        <WorkshopsRequested />
        <CoursesAdmin />
      </div>
    </div>
  );
}

export default AdminDashboard;
