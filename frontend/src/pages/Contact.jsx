import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Contact({ onNavigate }) {
  const navigate = useNavigate();

  const handleNav = (pageKey) => {
    if (onNavigate) onNavigate(pageKey);
    const routes = {
      home: "/",
    };
    navigate(routes[pageKey] || "/");
  };

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      newErrors.name = "Please enter your name (at least 2 characters).";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.subject.trim() || formData.subject.trim().length < 3) {
      newErrors.subject = "Please enter a subject (at least 3 characters).";
    }

    if (!formData.message.trim() || formData.message.trim().length < 10) {
      newErrors.message = "Please enter a message (at least 10 characters).";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for field on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setSubmitting(true);

    // Simulate clean form handling for project demo
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 800);
  };

  const platformDetails = [
    {
      icon: "🌐",
      label: "Platform",
      value: "Upskill_Resume",
      sub: "AI-Powered Career Platform",
    },
    {
      icon: "🎓",
      label: "Project Scope",
      value: "Academic & Career Demo",
      sub: "Built with React & Spring Boot",
    },
    {
      icon: "⚡",
      label: "AI Technology",
      value: "Google Gemini AI",
      sub: "Resume analysis & interview prep",
    },
  ];

  return (
    <div className="contact-page">
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
      <div className="contact-hero">
        <div className="hero-badge">Get in Touch</div>
        <h1>Contact & Feedback</h1>
        <p>
          Have questions, feedback, or suggestions about Upskill_Resume? Send us a message below.
        </p>
      </div>

      <div className="contact-container">
        {/* PLATFORM DETAILS */}
        <div className="contact-info-section">
          {platformDetails.map((item, i) => (
            <div key={i} className="contact-info-card">
              <div className="contact-info-icon">{item.icon}</div>
              <div>
                <span className="contact-info-label">{item.label}</span>
                <p className="contact-info-value">{item.value}</p>
                <small className="contact-info-sub">{item.sub}</small>
              </div>
            </div>
          ))}
        </div>

        {/* DEMO NOTICE BANNER */}
        <div className="contact-notice-banner">
          <span className="notice-icon">💡</span>
          <p>
            <strong>Project Note:</strong> Upskill_Resume is an AI-powered career project platform.
            Messages submitted through this form are validated and logged for project feedback.
          </p>
        </div>

        {/* FORM CARD */}
        <div className="contact-form-card">
          {submitted ? (
            <div className="contact-success-state">
              <div className="contact-success-icon">✅</div>
              <h2>Feedback Received!</h2>
              <p>
                Thank you, <strong>{formData.name}</strong>. Your feedback regarding "
                <strong>{formData.subject}</strong>" has been recorded.
              </p>
              <button
                type="button"
                className="primary-btn"
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ name: "", email: "", subject: "", message: "" });
                  setErrors({});
                }}
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <>
              <div className="contact-form-header">
                <span className="results-badge">FEEDBACK FORM</span>
                <h2>Send Us a Message</h2>
                <p>Fill out the required fields below to share your feedback or inquiry.</p>
              </div>

              <form onSubmit={handleSubmit} className="contact-form" noValidate>
                <div className="contact-form-row">
                  <div className="form-group">
                    <label htmlFor="contact-name">
                      Full Name <span className="required-star">*</span>
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      name="name"
                      placeholder="Your full name"
                      value={formData.name}
                      onChange={handleChange}
                      className={errors.name ? "input-error" : ""}
                    />
                    {errors.name && <span className="error-text">{errors.name}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="contact-email">
                      Email Address <span className="required-star">*</span>
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      name="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className={errors.email ? "input-error" : ""}
                    />
                    {errors.email && <span className="error-text">{errors.email}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="contact-subject">
                    Subject <span className="required-star">*</span>
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    name="subject"
                    placeholder="e.g. Feature Feedback, Question, Suggestion"
                    value={formData.subject}
                    onChange={handleChange}
                    className={errors.subject ? "input-error" : ""}
                  />
                  {errors.subject && <span className="error-text">{errors.subject}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="contact-message">
                    Message <span className="required-star">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    placeholder="Share your detailed feedback or question..."
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className={errors.message ? "input-error" : ""}
                  />
                  {errors.message && <span className="error-text">{errors.message}</span>}
                </div>

                <button
                  type="submit"
                  className={`primary-btn ${submitting ? "btn-loading" : ""}`}
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <span className="ats-spinner" />
                      Submitting Feedback...
                    </>
                  ) : (
                    "Submit Feedback →"
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Contact;
