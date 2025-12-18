import React from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./Main.css";

function Main() {
  return (
    <div className="container">
      <div className="row mb-4">
        <div className="col-12">
          <div className="value-proposition">
            <p className="main-description">
              TrainingApi standardises course data from multiple training providers so external courses can be discovered, enrolled in, and tracked directly within your LMS — without manual uploads or ongoing admin.
            </p>
            <p className="target-audience">
              The platform is designed for Learning and Development teams that work with multiple external training providers and want a cleaner, more scalable way to manage them within their LMS.
            </p>
          </div>
        </div>
      </div>
      
      <div className="row mb-5">
        <div className="col-12">
          <h2 className="section-title">Key Benefits</h2>
        </div>
      </div>
      
      <div className="row mb-5">
        <div className="col-md-4 mb-4">
          <div className="benefit-card">
            <div className="benefit-icon">
              <i className="bi bi-people-fill"></i>
            </div>
            <h3 className="benefit-title">Use your existing providers</h3>
            <p className="benefit-description">
              Ask your current training suppliers to publish their courses once to TrainingApi, keeping your LMS catalogue accurate and up to date without ongoing manual work.
            </p>
          </div>
        </div>
        
        <div className="col-md-4 mb-4">
          <div className="benefit-card">
            <div className="benefit-icon">
              <i className="bi bi-collection-fill"></i>
            </div>
            <h3 className="benefit-title">Expand your course options</h3>
            <p className="benefit-description">
              Access additional, ready-to-integrate courses from other providers on the platform and surface them directly inside your LMS.
            </p>
          </div>
        </div>
        
        <div className="col-md-4 mb-4">
          <div className="benefit-card">
            <div className="benefit-icon">
              <i className="bi bi-clipboard-data-fill"></i>
            </div>
            <h3 className="benefit-title">Keep data consistent</h3>
            <p className="benefit-description">
              All courses follow a common structure, making it easier to manage catalogues, compare options, and report consistently across providers.
            </p>
          </div>
        </div>
      </div>
      
      <div className="row mb-5">
        <div className="col-12">
          <h2 className="section-title">Get started in three steps</h2>
        </div>
      </div>
      
      <div className="row">
        <div className="col-md-4 mb-4">
          <div className="step-card">
            <div className="step-number">1</div>
            <h3 className="step-title">Connect your LMS</h3>
            <p className="step-description">
              Use a single, standard integration to access all courses.
            </p>
          </div>
        </div>
        
        <div className="col-md-4 mb-4">
          <div className="step-card">
            <div className="step-number">2</div>
            <h3 className="step-title">Invite providers</h3>
            <p className="step-description">
              Existing suppliers publish and maintain their courses directly on the platform.
            </p>
          </div>
        </div>
        
        <div className="col-md-4 mb-4">
          <div className="step-card">
            <div className="step-number">3</div>
            <h3 className="step-title">Publish to learners</h3>
            <p className="step-description">
              External courses appear in your LMS like any internal programme.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;
