import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  return (
    <div className="landing-page-content">
      {/* HERO */}
      <section className="landing-hero">
        <div className="hero-badge">AI-Powered Career Platform</div>

        <h1>
          Build Your Career
          <br />
          <span>With AI</span>
        </h1>

        <p>
          Create a professional resume or check how ATS-ready your resume
          really is.
        </p>

        {/* TWO MAIN OPTIONS */}
        <div className="landing-options">
          <div className="landing-option-card landing-option-card-primary">
            <div className="landing-option-icon">📄</div>
            <h2>Create Resume</h2>
            <p>
              Build a professional, ATS-friendly resume with AI-powered
              assistance and modern templates.
            </p>
            <button
              type="button"
              onClick={() => {
                if (isLoggedIn) {
                  navigate("/resume-builder");
                } else {
                  navigate("/login", { state: { from: { pathname: "/resume-builder" } } });
                }
              }}
            >
              Create My Resume →
            </button>
          </div>

          <div className="landing-option-card">
            <div className="landing-option-icon">📊</div>
            <h2>ATS Check</h2>
            <p>
              Upload your existing resume and discover your ATS score,
              skills, gaps and improvements.
            </p>
            <button
              type="button"
              onClick={() => {
                if (isLoggedIn) {
                  navigate("/resume-analysis");
                } else {
                  navigate("/login", { state: { from: { pathname: "/resume-analysis" } } });
                }
              }}
            >
              Check My Resume →
            </button>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="landing-features">
        <h2>Everything You Need for Your Career</h2>
        <p className="section-description">
          Go beyond your resume with AI-powered career tools.
        </p>

        <div className="landing-feature-grid">
          <div
            className="landing-feature-card interactive-card"
            onClick={() => navigate("/job-matching")}
            role="button"
            tabIndex={0}
          >
            <div>🎯</div>
            <h3>Job Matching</h3>
            <p>
              Find out how well your resume matches a specific job
              description.
            </p>
          </div>

          <div
            className="landing-feature-card interactive-card"
            onClick={() => navigate("/interview-preparation")}
            role="button"
            tabIndex={0}
          >
            <div>💬</div>
            <h3>Interview Preparation</h3>
            <p>
              Generate personalized interview questions based on your
              resume.
            </p>
          </div>

          <div
            className="landing-feature-card interactive-card"
            onClick={() => navigate("/learning-resources")}
            role="button"
            tabIndex={0}
          >
            <div>📚</div>
            <h3>Learning Resources</h3>
            <p>
              Discover resources to improve your missing skills and close
              your skill gaps.
            </p>
          </div>

          <div
            className="landing-feature-card interactive-card"
            onClick={() => navigate("/resume-analysis")}
            role="button"
            tabIndex={0}
          >
            <div>🤖</div>
            <h3>AI Career Insights</h3>
            <p>
              Get intelligent recommendations to improve your career
              profile.
            </p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="landing-workflow">
        <h2>Your Career Journey Starts Here</h2>

        <div className="workflow-items">
          <div className="workflow-item">
            <span>01</span>
            <h3>Create or Upload</h3>
            <p>Start with a new resume or upload your existing one.</p>
          </div>

          <div className="workflow-item">
            <span>02</span>
            <h3>Analyze</h3>
            <p>AI analyzes your resume, skills and career profile.</p>
          </div>

          <div className="workflow-item">
            <span>03</span>
            <h3>Improve</h3>
            <p>Identify gaps and improve your resume.</p>
          </div>

          <div className="workflow-item">
            <span>04</span>
            <h3>Prepare</h3>
            <p>Match jobs and prepare for interviews.</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="landing-footer">
        <h3>Upskill_Resume</h3>
        <p>AI-powered tools to build, improve and grow your career.</p>
        <div>© 2026 Upskill_Resume. All rights reserved.</div>
      </footer>
    </div>
  );
}
