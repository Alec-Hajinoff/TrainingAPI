import React, { useState } from "react";
import "./DeveloperDashboard.css";
import LogoutComponent from "./LogoutComponent";
import { generateApiKey } from "./ApiService";

function DeveloperDashboard() {
  const [apiKey, setApiKey] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerateApiKey = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await generateApiKey();
      if (result.success) {
        setApiKey(result.apiKey);
      } else {
        setError(result.message || "Failed to generate API key");
      }
    } catch (err) {
      setError("An error occurred while generating the API key");
    } finally {
      setLoading(false);
    }
  };

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

        {/* API Key Generation Section */}
        <div className="api-key-section mt-4">
          <h4>API Key Management</h4>
          <button
            className="btn btn-primary mb-3"
            onClick={handleGenerateApiKey}
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate New API Key"}
          </button>

          {error && <div className="alert alert-danger">{error}</div>}

          {apiKey && (
            <div className="alert alert-success">
              <strong>Your new API Key:</strong>
              <div className="mt-2 p-2 bg-light border rounded">
                <code>{apiKey}</code>
              </div>
              <small className="text-muted d-block mt-2">
                Store this key securely. You won't be able to see it again.
              </small>
            </div>
          )}
        </div>

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
