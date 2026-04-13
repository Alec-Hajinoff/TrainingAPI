import React from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./ForProviders.css";

function ForProviders() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="providers-container">
      <div className="container">
        <div className="row mb-4">
          <div className="col-12">
            <div className="providers-hero">
              <h1 className="providers-main-title">
                Deliver your workshops under a single, trusted training brand
              </h1>
              <p className="providers-main-description">
                TrainingApi works with providers to deliver high-quality,
                instructor-led technology workshops to organisations.
              </p>
              <p className="providers-main-description">
                All workshops are presented and delivered under the TrainingApi
                brand, ensuring consistency, quality, and a reliable experience
                for clients.
              </p>
            </div>
          </div>
        </div>

        <div className="row mb-5">
          <div className="col-12">
            <h3 className="providers-section-title">How the model works</h3>
          </div>
        </div>

        <div className="row mb-5">
          <div className="col-12">
            <div className="model-description">
              <p className="model-text">
                TrainingApi is not an open marketplace. We operate a curated
                model where providers work with us to deliver workshops under a
                unified standard.
              </p>
              <ul className="model-list">
                <li>Workshops are presented under the TrainingApi brand</li>
                <li>Organisations engage directly with TrainingApi</li>
                <li>
                  Delivery is coordinated to ensure consistency and reliability
                </li>
                <li>Providers focus on delivering high-quality sessions</li>
              </ul>
              <p className="model-text">
                This allows us to maintain a clear, consistent experience for
                organisations while working with trusted instructors.
              </p>
            </div>
          </div>
        </div>

        <div className="row mb-5">
          <div className="col-12">
            <h3 className="providers-section-title">
              Why work with TrainingApi
            </h3>
          </div>
        </div>

        <div className="row mb-5">
          <div className="col-md-3 mb-4">
            <div className="providers-benefit-card">
              <div className="providers-benefit-icon">
                <i className="bi bi-chat-dots"></i>
              </div>
              <h3 className="providers-benefit-title">
                Focus on delivery, not sales
              </h3>
              <p className="providers-benefit-description">
                We handle positioning, catalogue structure, and client
                engagement so you can focus on delivering strong sessions.
              </p>
            </div>
          </div>

          <div className="col-md-3 mb-4">
            <div className="providers-benefit-card">
              <div className="providers-benefit-icon">
                <i className="bi bi-eye"></i>
              </div>
              <h3 className="providers-benefit-title">
                Structured, ongoing visibility
              </h3>
              <p className="providers-benefit-description">
                Your workshops are included in a standardised catalogue used by
                training managers and, where applicable, integrated into
                internal learning systems.
              </p>
            </div>
          </div>

          <div className="col-md-3 mb-4">
            <div className="providers-benefit-card">
              <div className="providers-benefit-icon">
                <i className="bi bi-graph-up"></i>
              </div>
              <h3 className="providers-benefit-title">
                Access to organisational demand
              </h3>
              <p className="providers-benefit-description">
                We are building a catalogue aligned with real skill gaps across
                organisations.
              </p>
            </div>
          </div>

          <div className="col-md-3 mb-4">
            <div className="providers-benefit-card">
              <div className="providers-benefit-icon">
                <i className="bi bi-check-circle"></i>
              </div>
              <h3 className="providers-benefit-title">
                Operate within a clear standard
              </h3>
              <p className="providers-benefit-description">
                All workshops follow consistent expectations around structure,
                delivery, and outcomes.
              </p>
            </div>
          </div>
        </div>

        <div className="row mb-5">
          <div className="col-12">
            <h3 className="providers-section-title">What we look for</h3>
          </div>
        </div>

        <div className="row mb-5">
          <div className="col-12">
            <div className="criteria-content">
              <p className="criteria-intro">
                We work with providers who can deliver practical, high-quality
                workshops. You should have:
              </p>
              <ul className="criteria-list">
                <li>
                  Experience delivering <strong>instructor-led training</strong>
                </li>
                <li>
                  Ability to run <strong>hands-on, practical sessions</strong>
                </li>
                <li>Clearly structured workshops with defined outcomes</li>
                <li>
                  Strong delivery standards (communication, timing, materials)
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="row mb-5">
          <div className="col-12">
            <h3 className="providers-section-title">Our assessment process</h3>
          </div>
        </div>

        <div className="row mb-5">
          <div className="col-md-3 mb-4">
            <div className="providers-step-card">
              <div className="providers-step-number">1</div>
              <h3 className="providers-step-title">Initial review</h3>
              <p className="providers-step-description">
                Review of your workshop proposal
              </p>
            </div>
          </div>

          <div className="col-md-3 mb-4">
            <div className="providers-step-card">
              <div className="providers-step-number">2</div>
              <h3 className="providers-step-title">Discovery call</h3>
              <p className="providers-step-description">
                Short call to understand your approach and experience
              </p>
            </div>
          </div>

          <div className="col-md-3 mb-4">
            <div className="providers-step-card">
              <div className="providers-step-number">3</div>
              <h3 className="providers-step-title">Mock delivery</h3>
              <p className="providers-step-description">
                Review of sample materials and mock session delivery
              </p>
            </div>
          </div>

          <div className="col-md-3 mb-4">
            <div className="providers-step-card">
              <div className="providers-step-number">4</div>
              <h3 className="providers-step-title">Approval & onboarding</h3>
              <p className="providers-step-description">
                Approval and onboarding into the platform
              </p>
            </div>
          </div>
        </div>

        <div className="row mb-5">
          <div className="col-12">
            <p className="assessment-note">
              This ensures that all workshops meet a consistent standard before
              being presented to organisations.
            </p>
          </div>
        </div>

        <div className="row mb-5">
          <div className="col-12">
            <h3 className="providers-section-title">Current areas of focus</h3>
          </div>
        </div>

        <div className="row mb-5">
          <div className="col-md-6 col-lg-4 mb-4">
            <div className="focus-card">
              <div className="focus-icon">
                <i className="bi bi-robot"></i>
              </div>
              <h4 className="focus-title">AI for Business Applications</h4>
              <p className="focus-description">
                Practical use of AI tools across business functions, with a
                focus on productivity, automation, and safe adoption.
              </p>
            </div>
          </div>

          <div className="col-md-6 col-lg-4 mb-4">
            <div className="focus-card">
              <div className="focus-icon">
                <i className="bi bi-bar-chart-steps"></i>
              </div>
              <h4 className="focus-title">
                Python for Data Analysis and Power BI
              </h4>
              <p className="focus-description">
                Accessible, hands-on training enabling teams to work with data,
                automate tasks, and build reporting capability.
              </p>
            </div>
          </div>

          <div className="col-md-6 col-lg-4 mb-4">
            <div className="focus-card">
              <div className="focus-icon">
                <i className="bi bi-cloud"></i>
              </div>
              <h4 className="focus-title">Cloud Fundamentals (AWS & Azure)</h4>
              <p className="focus-description">
                Introductory, practical understanding of cloud infrastructure,
                cost, scalability, and security fundamentals.
              </p>
            </div>
          </div>

          <div className="col-md-6 col-lg-4 mb-4">
            <div className="focus-card">
              <div className="focus-icon">
                <i className="bi bi-shield-lock"></i>
              </div>
              <h4 className="focus-title">Cybersecurity Fundamentals</h4>
              <p className="focus-description">
                Core security awareness and practices relevant to all
                organisations.
              </p>
            </div>
          </div>

          <div className="col-md-6 col-lg-4 mb-4">
            <div className="focus-card">
              <div className="focus-icon">
                <i className="bi bi-code-slash"></i>
              </div>
              <h4 className="focus-title">Python Programming</h4>
              <p className="focus-description">
                Foundational programming skills applicable across automation,
                data, and general problem-solving.
              </p>
            </div>
          </div>

          <div className="col-md-6 col-lg-4 mb-4">
            <div className="focus-card">
              <div className="focus-icon">
                <i className="bi bi-chat-square-quote"></i>
              </div>
              <h4 className="focus-title">Prompt Engineering</h4>
              <p className="focus-description">
                Practical use of AI tools for day-to-day business tasks.
              </p>
            </div>
          </div>

          <div className="col-md-6 col-lg-4 mb-4 mx-auto">
            <div className="focus-card">
              <div className="focus-icon">
                <i className="bi bi-gear-wide-connected"></i>
              </div>
              <h4 className="focus-title">
                Automation & Workflow Optimisation
              </h4>
              <p className="focus-description">
                Using Python and related tools to reduce manual work and
                streamline processes.
              </p>
            </div>
          </div>
        </div>

        <div className="row mb-5">
          <div className="col-12">
            <h3 className="providers-section-title">How to express interest</h3>
          </div>
        </div>

        <div className="row mb-5">
          <div className="col-12">
            <div className="interest-content">
              <p className="interest-text">
                If this model is of interest, email us with a brief overview
                including:
              </p>
              <ul className="interest-list">
                <li>Your background and experience</li>
                <li>Workshop topics you deliver</li>
                <li>Format and level of your sessions</li>
              </ul>
              <p className="interest-text">
                If there is a fit, we will follow up to explore this further.
              </p>
              <p className="interest-email">
                <i className="bi bi-envelope-fill"></i>{" "}
                <a
                  href="mailto:team@trainingapi.com"
                  className="providers-email-link"
                >
                  team@trainingapi.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForProviders;
