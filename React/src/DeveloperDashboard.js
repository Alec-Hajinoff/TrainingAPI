import React from "react";
import "./DeveloperDashboard.css";
import LogoutComponent from "./LogoutComponent";

function DeveloperDashboard() {
  return (
    <div className="container">
      <div className="d-flex justify-content-end mb-3">
        <LogoutComponent />
      </div>
      <div className="dashboard-content">
        <div className="getting-started-section mb-5">
          <h3 className="mb-4">Getting Started with TrainingApi</h3>

          <div className="card mb-4">
            <div className="card-body">
              <p className="card-text">
                Welcome to <strong>TrainingApi</strong> — a standardised API for
                discovering and retrieving professional training courses from
                multiple providers. This API allows you to integrate external
                courses directly into your Learning Management System (LMS) or
                internal tools with minimal effort.
              </p>
            </div>
          </div>

          <div className="mb-4">
            <h4>1. API Access Information</h4>

            <p>
              The TrainingApi endpoint is now publicly accessible. No API key is
              required to retrieve course data.
            </p>

            <div className="alert alert-info mt-4 mb-4">
              <strong>✨ Public API Access:</strong> The courses endpoint is now
              open to the public. You can access course data without any
              authentication.
            </div>
          </div>

          <div className="mb-4">
            <h4>2. Making Requests to the API</h4>

            <p>
              All requests to the API can be made without authentication. Simply
              make a GET request to the endpoint:
            </p>

            <div className="card mb-3">
              <div className="card-header bg-light">API Endpoint</div>
              <div className="card-body">
                <pre className="mb-0">
                  <code>https://trainingapi.com/TrainingAPI/courses.php</code>
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
                  <code>{`curl https://trainingapi.com/TrainingAPI/courses.php`}</code>
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
                  <code>{`fetch('https://trainingapi.com/TrainingAPI/courses.php')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));`}</code>
                </pre>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <h4>3. What to Expect in the Response</h4>

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
            <h4>4. Error Responses</h4>

            <p>Common errors include:</p>

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
              Always ensure your request is correctly formatted. Authentication
              is no longer required.
            </p>
          </div>

          <div className="mb-4">
            <h4>5. Need Help?</h4>

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
