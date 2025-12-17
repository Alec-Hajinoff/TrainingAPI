import React, { useState } from "react";
import "./DeveloperDashboard.css";
import LogoutComponent from "./LogoutComponent";
import { generateApiKey } from "./ApiService";

function DeveloperDashboard() {
  const [apiKey, setApiKey] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleGenerateApiKey = async () => {
    if (!showConfirmation) {
      setShowConfirmation(true);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await generateApiKey();
      if (result.success) {
        setApiKey(result.apiKey);
        setShowConfirmation(false);
      } else {
        setError(result.message || "Failed to generate API key");
      }
    } catch (err) {
      setError("An error occurred while generating the API key");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelGeneration = () => {
    setShowConfirmation(false);
    setError(null);
  };

  return (
    <div className="container">
      <div className="d-flex justify-content-end mb-3">
        <LogoutComponent />
      </div>
      <div className="dashboard-content">
        <h2>Developer Dashboard</h2>

        <div className="welcome-section mb-4">
          <p>
            Welcome to the developer dashboard. Here you can integrate API with
            LMS systems and manage your integrations.
          </p>
        </div>

        <div className="getting-started-section mb-5">
          <h3 className="mb-4">Getting Started with TrainingAPI</h3>

          <div className="card mb-4">
            <div className="card-body">
              <p className="card-text">
                Welcome to <strong>TrainingAPI</strong> — a standardised API for
                discovering and retrieving professional training courses from
                multiple providers. This API allows you to integrate external
                courses directly into your Learning Management System (LMS) or
                internal tools with minimal effort.
              </p>
            </div>
          </div>

          <div className="mb-4">
            <h4>1. Generate Your API Key</h4>
            <p>To access the API, you need an API key:</p>
            <ol>
              <li>
                Click <strong>Generate New API Key</strong> in the developer
                dashboard (see below).
              </li>
              <li>
                Make a note of the key — it will{" "}
                <strong>not be shown again</strong>.
              </li>
            </ol>

            <div className="api-key-section mt-4 mb-4 p-4 border rounded bg-light">
              <h5>Generate Your API Key Here:</h5>

              {showConfirmation && (
                <div className="mb-3 p-3 border rounded">
                  <p className="mb-3">
                    <strong>
                      Generating a new API key invalidates your previous key.
                    </strong>
                  </p>
                  <div className="mt-3">
                    <button
                      className="btn btn-danger me-2"
                      onClick={handleGenerateApiKey}
                      disabled={loading}
                    >
                      {loading ? "Generating..." : "Yes, Generate New Key"}
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={handleCancelGeneration}
                      disabled={loading}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {!showConfirmation && (
                <button
                  className="btn btn-primary mb-3"
                  onClick={handleGenerateApiKey}
                  disabled={loading}
                >
                  {loading ? "Generating..." : "Generate New API Key"}
                </button>
              )}

              {error && <div className="alert alert-danger">{error}</div>}

              {apiKey && (
                <div className="alert alert-success">
                  <strong>Your new API Key:</strong>
                  <div className="mt-2 p-2 bg-white border rounded">
                    <code>{apiKey}</code>
                  </div>
                  <small className="text-muted d-block mt-2">
                    Store this key securely. You won't be able to see it again.
                  </small>
                </div>
              )}
            </div>
          </div>

          <div className="mb-4">
            <h4>2. Include Your API Key in Requests</h4>
            <p>
              All requests to the API must include your API key in the{" "}
              <strong>Authorization header</strong>:
            </p>

            <div className="card mb-3">
              <div className="card-header bg-light">Authorization Header</div>
              <div className="card-body">
                <pre className="mb-0">
                  <code>Authorization: Bearer YOUR_API_KEY</code>
                </pre>
              </div>
            </div>

            <p>
              This ensures that only authenticated developers can access the
              course data.
            </p>
          </div>

          <div className="mb-4">
            <h4>3. Your First Request</h4>
            <p>To retrieve a list of all courses, make a GET request to:</p>

            <div className="card mb-3">
              <div className="card-header bg-light">API Endpoint</div>
              <div className="card-body">
                <pre className="mb-0">
                  <code>
                    https://trainingapi.com/TrainingAPI/training_api.php
                  </code>
                </pre>
              </div>
            </div>

            <p className="mt-3">
              Example using <strong>cURL</strong>:
            </p>
            <div className="card mb-3">
              <div className="card-header bg-light">cURL Example</div>
              <div className="card-body">
                <pre className="mb-0">
                  <code>{`curl -H "Authorization: Bearer YOUR_API_KEY" \\
  https://trainingapi.com/TrainingAPI/training_api.php`}</code>
                </pre>
              </div>
            </div>

            <p className="mt-3">
              Example using <strong>JavaScript (fetch)</strong>:
            </p>
            <div className="card mb-3">
              <div className="card-header bg-light">JavaScript Example</div>
              <div className="card-body">
                <pre className="mb-0">
                  <code>{`fetch('https://trainingapi.com/TrainingAPI/training_api.php', {
  headers: { 'Authorization': 'Bearer YOUR_API_KEY' }
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error(error));`}</code>
                </pre>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <h4>4. What to Expect in the Response</h4>
            <p>A successful response returns JSON in the following format:</p>

            <div className="card mb-3">
              <div className="card-header bg-light">Response Format</div>
              <div className="card-body">
                <pre className="mb-0">
                  <code>{`{
  "success": true,
  "courses": [
    {
      "id": 229,
      "course_title": "Introduction to Asset Management",
      "description": "This financial training course is designed to give delegates a thorough grounding in the themes, calculations, and practices behind the investment management industry...",
      "learning_outcomes": "* To demystify the jargon associated with the financial services industry;\\r\\n* To review the key functions and players within financial services;...",
      "subject_area": "Wealth & Asset Management",
      "subject": "Asset Management",
      "delivery_type": "In-person",
      "country_of_delivery": "United States",
      "duration": "8.0",
      "total_price": "3650.00",
      "provider_name": "Clearly Financial Markets",
      "contact_email": "mike.smith@clearlytraining.com",
      "contact_phone": "+442076482253",
      "provider_website": "www.clearlytraining.com"
    }
  ],
  "count": 1
}`}</code>
                </pre>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <h4>5. Error Responses</h4>
            <p>Common errors include:</p>

            <p className="mb-2">
              <strong>Missing or malformed API key:</strong>
            </p>
            <div className="card mb-3">
              <div className="card-body">
                <pre className="mb-0">
                  <code>{`{
  "success": false,
  "message": "Authorization header missing or malformed"
}`}</code>
                </pre>
              </div>
            </div>

            <p className="mb-2">
              <strong>Invalid API key:</strong>
            </p>
            <div className="card mb-3">
              <div className="card-body">
                <pre className="mb-0">
                  <code>{`{
  "success": false,
  "message": "Invalid API key"
}`}</code>
                </pre>
              </div>
            </div>

            <p className="mb-2">
              <strong>No courses found:</strong>
            </p>
            <div className="card mb-3">
              <div className="card-body">
                <pre className="mb-0">
                  <code>{`{
  "success": false,
  "message": "No courses found"
}`}</code>
                </pre>
              </div>
            </div>

            <p className="mt-3">
              Always ensure your request includes a valid key and correctly
              formatted query parameters.
            </p>
          </div>

          <div className="mb-4">
            <h4>6. Need Help?</h4>
            <p>
              If you encounter issues or have questions, contact the{" "}
              <strong>TrainingAPI team</strong> at:
            </p>
            <div className="alert alert-info">
              <strong>Email:</strong>{" "}
              <a href="mailto:team@trainingapi.com">team@trainingapi.com</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeveloperDashboard;
