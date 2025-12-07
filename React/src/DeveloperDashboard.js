import React from "react";
import "./DeveloperDashboard.css";
import LogoutComponent from "./LogoutComponent";

function DeveloperDashboard() {
  return (
    <div className="container">
      <div>
        <p>
          Welcome to the developer dashboard. Here you can integrate API with
          LMS systems and manage your integrations.
        </p>
      </div>
      <div className="d-flex justify-content-end mb-3">
        <LogoutComponent />
      </div>
      <div className="dashboard-content">
        <h2>Developer Dashboard</h2>
        <div className="features mt-4">
          <h4>Available Features:</h4>
          <ul className="list-group">
            <li className="list-group-item">
              API Documentation & Integration Guides
            </li>
            <li className="list-group-item">API Key Management</li>
            <li className="list-group-item">Integration Testing Tools</li>
            <li className="list-group-item">Usage Analytics & Reports</li>
            <li className="list-group-item">LMS System Configuration</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default DeveloperDashboard;
