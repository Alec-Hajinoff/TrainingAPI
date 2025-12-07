import React from "react";
import "./AdminDashboard.css";
import LogoutComponent from "./LogoutComponent";

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
        <h2>Admin Dashboard</h2>
        <div className="features mt-4">
          <h4>Available Features:</h4>
          <ul className="list-group">
            <li className="list-group-item">User & Provider Management</li>
            <li className="list-group-item">Platform Analytics & Reports</li>
            <li className="list-group-item">System Configuration & Settings</li>
            <li className="list-group-item">Content Moderation Tools</li>
            <li className="list-group-item">Approval Workflows</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
