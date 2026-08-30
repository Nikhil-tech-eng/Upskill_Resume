import { useNavigate } from "react-router-dom";

function AboutUs({ onNavigate }) {
  const navigate = useNavigate();

  const handleNav = (pageKey) => {
    if (onNavigate) onNavigate(pageKey);
    const routes = {
      home: "/",
      "resume-analysis": "/resume-analysis",
      contact: "/contact",
    };
    navigate(routes[pageKey] || "/");
  };

  const workflowSteps = [
    {
      step: "01",
      title: "Upload or Create Resume",
      description: "Upload your existing PDF or DOCX resume to start optimizing your candidate profile.",
      emoji: "📄",
    },
    {
      step: "02",
      title: "AI ATS Resume Analysis",
      description: "Get an instant ATS compatibility score, executive summary, and structural feedback.",
      emoji: "📊",
    },
    {
      step: "03",
      title: "Identify Skills & Skill Gaps",
      description: "Discover detected technical skills and pinpoint missing qualifications required for your target roles.",
      emoji: "⚡",
    },
    {
      step: "04",
      title: "Job Fit Matching",
      description: "Compare your resume directly against any job description to evaluate keyword alignment.",
      emoji: "🎯",
    },
    {
      step: "05",
      title: "Tailored Interview Preparation",
      description: "Generate 10 customized technical, architectural, and behavioral interview questions.",
      emoji: "💬",
    },
    {
      step: "06",
      title: "Upskill via Learning Resources",
      description: "Access curated tutorials and documentation to master missing technologies and close skill gaps.",
      emoji: "📚",
    },
  ];

  const platformCapabilities = [
    {
      title: "AI-Powered Intelligence",
      description: "Leverages Google Gemini AI to deliver actionable resume insights and interview question sets.",
      icon: "🤖",
    },
    {
      title: "Targeted Skill Development",
      description: "Directly connects identified resume skill gaps with learning resources and tutorials.",
      icon: "⚡",
    },
    {
      title: "Candidate-Centric Design",
      description: "Built specifically for students, freshers, entry-level candidates, and career switchers.",
      icon: "🎯",
    },
    {
      title: "Secure & Scoped Access",
      description: "JWT-based authentication ensures your uploaded resumes and analyses remain private.",
      icon: "🛡️",
    },
  ];

  return (
    <div className="about-page">
      {/* BACK NAVIGATION */}
      <div className="ats-navigation">
        <button
          type="button"
          className="ats-back-btn"
          onClick={() => handleNav("home")}
        >
          ← Back to Home
        </button>
      </div>

      {/* HERO */}
      <div className="about-hero">
        <div className="hero-badge">About Upskill_Resume</div>
        <h1>AI-Powered Career & Resume Platform</h1>
        <p>
          Upskill_Resume is an intelligent career acceleration platform designed to help job seekers, students,
          and freshers optimize their resumes, analyze job fit, and prepare for interviews.
        </p>
      </div>

      <div className="about-container">
        {/* MISSION & PURPOSE */}
        <div className="about-mission-card">
          <div className="about-mission-icon">🚀</div>
          <h2>Our Purpose & Problem Solved</h2>
          <p>
            Navigating modern hiring processes can be challenging. Applicant Tracking Systems (ATS) automatically
            filter out resumes that lack key technical skills, while preparing for technical interviews often requires
            tailored guidance that traditional tools fail to provide.
          </p>
          <p>
            Upskill_Resume bridges this gap by combining automated ATS scoring, job description fit analysis, personalized
            interview question generation, and skill gap learning resources into one accessible, unified platform.
          </p>
        </div>

        {/* WORKFLOW STEPS */}
        <div className="about-section-card">
          <div className="about-section-header">
            <span className="results-badge">WORKFLOW</span>
            <h2>How Upskill_Resume Works</h2>
            <p>A step-by-step approach to building and elevating your career profile.</p>
          </div>

          <div className="about-workflow-grid">
            {workflowSteps.map((item, idx) => (
              <div key={idx} className="about-workflow-item">
                <div className="workflow-item-header">
                  <span className="workflow-step-num">{item.step}</span>
                  <span className="workflow-emoji">{item.emoji}</span>
                </div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* KEY CAPABILITIES */}
        <div className="about-section-card">
          <div className="about-section-header">
            <span className="results-badge">PLATFORM CAPABILITIES</span>
            <h2>Core Platform Features</h2>
            <p>Intelligent tools designed for entry-level candidates and job seekers.</p>
          </div>

          <div className="about-features-grid">
            {platformCapabilities.map((cap, i) => (
              <div key={i} className="about-feature-card">
                <div className="about-feature-emoji">{cap.icon}</div>
                <h3>{cap.title}</h3>
                <p>{cap.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* TECHNOLOGY STACK */}
        <div className="about-section-card">
          <div className="about-section-header">
            <span className="results-badge">ENGINEERING</span>
            <h2>Built With Modern Architecture</h2>
          </div>
          <div className="about-tech-grid">
            <div className="about-tech-item">
              <span className="about-tech-icon">⚡</span>
              <div>
                <h4>Google Gemini AI API</h4>
                <p>Generates ATS compatibility feedback and customized interview questions.</p>
              </div>
            </div>
            <div className="about-tech-item">
              <span className="about-tech-icon">🌱</span>
              <div>
                <h4>Java Spring Boot 3</h4>
                <p>Provides a RESTful backend with JWT authentication and Spring Security authorization.</p>
              </div>
            </div>
            <div className="about-tech-item">
              <span className="about-tech-icon">⚛️</span>
              <div>
                <h4>React 19 & React Router v7</h4>
                <p>Single Page Application (SPA) with declarative client-side routing and state management.</p>
              </div>
            </div>
            <div className="about-tech-item">
              <span className="about-tech-icon">🛡️</span>
              <div>
                <h4>Data Privacy & Scoping</h4>
                <p>SecurityContext-scoped backend controllers ensure user data remains isolated.</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA CARD */}
        <div className="about-cta-card">
          <h2>Ready to Elevate Your Resume?</h2>
          <p>Get instant AI feedback on your resume score and skill alignment in seconds.</p>
          <div className="about-cta-actions">
            <button
              type="button"
              className="primary-btn"
              onClick={() => handleNav("resume-analysis")}
            >
              Analyze My Resume →
            </button>
            <button
              type="button"
              className="secondary-btn"
              onClick={() => handleNav("contact")}
            >
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutUs;
