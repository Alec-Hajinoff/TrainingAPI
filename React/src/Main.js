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
              TrainingAPI delivers virtual instructor-led technology workshops
              designed to help teams develop practical skills and adopt new
              tools and workflows.
            </p>
          </div>
        </div>
      </div>

      <div className="row mb-5">
        <div className="col-12">
          <h2 className="section-title">Why TrainingAPI?</h2>
        </div>
      </div>

      <div className="row mb-5">
        <div className="col-md-4 mb-4">
          <div className="benefit-card">
            <div className="benefit-icon">
              <i className="bi bi-display"></i>
            </div>
            <h3 className="benefit-title">Curated Workshops</h3>
            <p className="benefit-description">
              Access a structured catalogue of practical sessions in AI, Python,
              Cloud, and DevOps, delivered by experienced instructors.
            </p>
          </div>
        </div>

        <div className="col-md-4 mb-4">
          <div className="benefit-card">
            <div className="benefit-icon">
              <i className="bi bi-tools"></i>
            </div>
            <h3 className="benefit-title">Applied Learning</h3>
            <p className="benefit-description">
              Our programmes focus on impact, combining 30% conceptual
              understanding with 70% applied learning for immediate results.
            </p>
          </div>
        </div>

        <div className="col-md-4 mb-4">
          <div className="benefit-card">
            <div className="benefit-icon">
              <i className="bi bi-lightbulb-fill"></i>
            </div>
            <h3 className="benefit-title">Skill-Gap Requests</h3>
            <p className="benefit-description">
              If you don't see a programme that meets your needs, submit a
              request and we will coordinate a custom workshop for your team.
            </p>
          </div>
        </div>
      </div>

      <div className="row mb-5">
        <div className="col-12">
          <h2 className="section-title">How it works</h2>
        </div>
      </div>

      <div className="row">
        <div className="col-md-4 mb-4">
          <div className="step-card">
            <div className="step-number">1</div>
            <h3 className="step-title">Explore Catalogue</h3>
            <p className="step-description">
              Browse upcoming virtual sessions and filter by technology,
              duration, or price.
            </p>
          </div>
        </div>

        <div className="col-md-4 mb-4">
          <div className="step-card">
            <div className="step-number">2</div>
            <h3 className="step-title">Select or Request</h3>
            <p className="step-description">
              Enquire about existing workshops or submit a skill-gap request for
              a custom programme.
            </p>
          </div>
        </div>

        <div className="col-md-4 mb-4">
          <div className="step-card">
            <div className="step-number">3</div>
            <h3 className="step-title">Upskill Teams</h3>
            <p className="step-description">
              Integrate sessions into your planning or connect via API to your
              corporate LMS.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;
