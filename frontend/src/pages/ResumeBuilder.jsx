import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const TEMPLATE_STORAGE_KEY = "resumeBuilderSelectedTemplate";
const RESUME_DRAFT_KEY = "resumeBuilderDraft";

const templates = [
  {
    id: "modern-minimal",
    name: "Modern Minimal",
    description: "Clean, confident, and highly readable for modern roles.",
    accent: "#7c6cf5",
    secondary: "#a78bfa",
    previewStyle: "modern",
  },
  {
    id: "classic-professional",
    name: "Classic Professional",
    description: "Traditional layout with strong ATS readability and structure.",
    accent: "#0f172a",
    secondary: "#475569",
    previewStyle: "classic",
  },
  {
    id: "executive-bold",
    name: "Executive Bold",
    description: "High-impact design built for leadership and senior profiles.",
    accent: "#f59e0b",
    secondary: "#fbbf24",
    previewStyle: "executive",
  },
];

const emptyEducation = () => ({
  school: "",
  degree: "",
  field: "",
  startDate: "",
  endDate: "",
  location: "",
});

const emptyExperience = () => ({
  company: "",
  role: "",
  location: "",
  startDate: "",
  endDate: "",
  description: "",
});

const emptyProject = () => ({
  name: "",
  description: "",
  link: "",
  technologies: "",
});

const emptyCertification = () => ({
  name: "",
  issuer: "",
  date: "",
});

const createInitialResumeData = () => ({
  personalInfo: {
    fullName: "",
    professionalTitle: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    portfolio: "",
  },
  summary: "",
  skills: [""],
  education: [emptyEducation()],
  experience: [emptyExperience()],
  projects: [emptyProject()],
  certifications: [emptyCertification()],
});

const getSavedTemplate = () => {
  try {
    const raw = localStorage.getItem(TEMPLATE_STORAGE_KEY);
    if (!raw) return templates[0];

    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.id) return templates[0];

    const match = templates.find((template) => template.id === parsed.id);
    return match || templates[0];
  } catch (error) {
    console.error("Failed to read saved template", error);
    return templates[0];
  }
};

const getSavedDraft = () => {
  try {
    const raw = localStorage.getItem(RESUME_DRAFT_KEY);
    if (!raw) return createInitialResumeData();

    const parsed = JSON.parse(raw);
    return {
      personalInfo: { ...createInitialResumeData().personalInfo, ...(parsed.personalInfo || {}) },
      summary: parsed.summary || "",
      skills: Array.isArray(parsed.skills) && parsed.skills.length ? parsed.skills : [""],
      education: Array.isArray(parsed.education) && parsed.education.length ? parsed.education : [emptyEducation()],
      experience: Array.isArray(parsed.experience) && parsed.experience.length ? parsed.experience : [emptyExperience()],
      projects: Array.isArray(parsed.projects) && parsed.projects.length ? parsed.projects : [emptyProject()],
      certifications: Array.isArray(parsed.certifications) && parsed.certifications.length ? parsed.certifications : [emptyCertification()],
    };
  } catch (error) {
    console.error("Failed to read saved resume draft", error);
    return createInitialResumeData();
  }
};

export default function ResumeBuilder() {
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState(getSavedTemplate);
  const [formData, setFormData] = useState(getSavedDraft);
  const [errors, setErrors] = useState({});
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    localStorage.setItem(
      TEMPLATE_STORAGE_KEY,
      JSON.stringify({
        id: selectedTemplate.id,
        name: selectedTemplate.name,
        accent: selectedTemplate.accent,
        secondary: selectedTemplate.secondary,
      })
    );
  }, [selectedTemplate]);

  useEffect(() => {
    localStorage.setItem(RESUME_DRAFT_KEY, JSON.stringify(formData));
  }, [formData]);

  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template);
  };

  const updatePersonalField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value,
      },
    }));

    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const updateArrayItem = (section, index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: prev[section].map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const updateSkills = (index, value) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.map((skill, skillIndex) =>
        skillIndex === index ? value : skill
      ),
    }));
  };

  const addArrayItem = (section, factory) => {
    setFormData((prev) => ({
      ...prev,
      [section]: [...prev[section], factory()],
    }));
  };

  const removeArrayItem = (section, index) => {
    setFormData((prev) => {
      const nextItems = prev[section].filter((_, itemIndex) => itemIndex !== index);
      return {
        ...prev,
        [section]: nextItems.length ? nextItems : [factoryForSection(section)],
      };
    });
  };

  const factoryForSection = (section) => {
    if (section === "education") return emptyEducation();
    if (section === "experience") return emptyExperience();
    if (section === "projects") return emptyProject();
    if (section === "certifications") return emptyCertification();
    return "";
  };

  const validateForm = () => {
    const nextErrors = {};
    const trimmedName = formData.personalInfo.fullName.trim();
    const trimmedEmail = formData.personalInfo.email.trim();

    if (!trimmedName) nextErrors.fullName = "Full name is required.";
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      nextErrors.email = "A valid email is required.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      setSaveMessage("Please fix the required fields before saving.");
      return;
    }

    localStorage.setItem(RESUME_DRAFT_KEY, JSON.stringify(formData));
    setSaveMessage("Resume draft saved successfully.");
  };

  const handleContinue = () => {
    if (!validateForm()) {
      setSaveMessage("Please complete the required fields to continue.");
      return;
    }

    localStorage.setItem(RESUME_DRAFT_KEY, JSON.stringify(formData));
    setSaveMessage("Resume draft is ready for the next phase.");
  };

  return (
    <div className="page-wrapper resume-builder-page">
      <div className="page-back-bar">
        <button
          type="button"
          className="back-btn-inline"
          onClick={() => navigate("/")}
        >
          ← Back to Home
        </button>
      </div>

      <div className="resume-builder-shell">
        <div className="resume-builder-header">
          <div className="hero-badge">Free Resume Builder</div>
          <h1>Choose a Resume Template</h1>
          <p>
            Pick a layout that fits your experience and start building a polished,
            professional resume.
          </p>
        </div>

        <div className="template-grid">
          {templates.map((template) => {
            const isSelected = selectedTemplate.id === template.id;

            return (
              <div
                key={template.id}
                className={`template-card ${isSelected ? "template-card-selected" : ""}`}
              >
                <div
                  className={`template-preview template-preview-${template.previewStyle}`}
                  style={{
                    "--template-accent": template.accent,
                    "--template-secondary": template.secondary,
                  }}
                >
                  <div className="preview-header">
                    <span className="preview-name">Your Name</span>
                    <span className="preview-role">Product Designer</span>
                  </div>

                  <div className="preview-body">
                    <div className="preview-column preview-column-main">
                      <div className="preview-section preview-section-line" />
                      <div className="preview-section preview-section-short" />
                      <div className="preview-section preview-section-medium" />
                      <div className="preview-section preview-section-short" />
                    </div>

                    <div className="preview-column preview-column-side">
                      <div className="preview-chip" />
                      <div className="preview-chip" />
                      <div className="preview-chip" />
                    </div>
                  </div>
                </div>

                <div className="template-card-body">
                  <div className="template-title-row">
                    <h3>{template.name}</h3>
                    {isSelected && <span className="selected-badge">Selected</span>}
                  </div>
                  <p>{template.description}</p>
                  <button
                    type="button"
                    className="template-select-btn"
                    onClick={() => handleSelectTemplate(template)}
                  >
                    {isSelected ? "Selected" : "Use Template"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="resume-builder-summary">
          <div className="selected-template-pill">
            <span>Current selection</span>
            <strong>{selectedTemplate.name}</strong>
          </div>
          <p>
            This template choice is saved and will be reused for the form, preview,
            and DOCX generation in later phases.
          </p>
        </div>

        <form className="resume-form-panel" onSubmit={(event) => event.preventDefault()}>
          <div className="resume-form-header">
            <h2>Manual Resume Details</h2>
            <p>Complete your profile details to shape the resume content.</p>
          </div>

          <div className="form-section">
            <h3>Profile</h3>
            <div className="field-grid two-col">
              <div className="field-group">
                <label>Full name</label>
                <input
                  type="text"
                  value={formData.personalInfo.fullName}
                  onChange={(e) => updatePersonalField("fullName", e.target.value)}
                />
                {errors.fullName && <span className="field-error">{errors.fullName}</span>}
              </div>

              <div className="field-group">
                <label>Professional title</label>
                <input
                  type="text"
                  value={formData.personalInfo.professionalTitle}
                  onChange={(e) => updatePersonalField("professionalTitle", e.target.value)}
                />
              </div>

              <div className="field-group">
                <label>Email</label>
                <input
                  type="email"
                  value={formData.personalInfo.email}
                  onChange={(e) => updatePersonalField("email", e.target.value)}
                />
                {errors.email && <span className="field-error">{errors.email}</span>}
              </div>

              <div className="field-group">
                <label>Phone</label>
                <input
                  type="tel"
                  value={formData.personalInfo.phone}
                  onChange={(e) => updatePersonalField("phone", e.target.value)}
                />
              </div>

              <div className="field-group">
                <label>Location</label>
                <input
                  type="text"
                  value={formData.personalInfo.location}
                  onChange={(e) => updatePersonalField("location", e.target.value)}
                />
              </div>

              <div className="field-group">
                <label>LinkedIn</label>
                <input
                  type="url"
                  value={formData.personalInfo.linkedin}
                  onChange={(e) => updatePersonalField("linkedin", e.target.value)}
                />
              </div>

              <div className="field-group full-width">
                <label>GitHub / Portfolio</label>
                <input
                  type="url"
                  value={formData.personalInfo.portfolio}
                  onChange={(e) => updatePersonalField("portfolio", e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Professional Summary</h3>
            <textarea
              rows="5"
              value={formData.summary}
              onChange={(e) => setFormData((prev) => ({ ...prev, summary: e.target.value }))}
            />
          </div>

          <div className="form-section">
            <h3>Skills</h3>
            <div className="list-block">
              {formData.skills.map((skill, index) => (
                <div key={`skill-${index}`} className="list-row skill-row">
                  <input
                    type="text"
                    value={skill}
                    placeholder="e.g. Java, React, SQL"
                    onChange={(e) => updateSkills(index, e.target.value)}
                  />
                  {formData.skills.length > 1 && (
                    <button type="button" className="mini-btn danger" onClick={() => setFormData((prev) => ({ ...prev, skills: prev.skills.filter((_, idx) => idx !== index) || [""] }))}>
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button type="button" className="secondary-btn" onClick={() => setFormData((prev) => ({ ...prev, skills: [...prev.skills, ""] }))}>
              Add Skill
            </button>
          </div>

          <div className="form-section">
            <h3>Education</h3>
            {formData.education.map((entry, index) => (
              <div key={`education-${index}`} className="entry-card">
                <div className="entry-header">
                  <span>Education #{index + 1}</span>
                  {formData.education.length > 1 && (
                    <button type="button" className="mini-btn danger" onClick={() => removeArrayItem("education", index)}>
                      Remove
                    </button>
                  )}
                </div>

                <div className="field-grid two-col">
                  <div className="field-group"><label>School</label><input type="text" value={entry.school} onChange={(e) => updateArrayItem("education", index, "school", e.target.value)} /></div>
                  <div className="field-group"><label>Degree</label><input type="text" value={entry.degree} onChange={(e) => updateArrayItem("education", index, "degree", e.target.value)} /></div>
                  <div className="field-group"><label>Field of study</label><input type="text" value={entry.field} onChange={(e) => updateArrayItem("education", index, "field", e.target.value)} /></div>
                  <div className="field-group"><label>Location</label><input type="text" value={entry.location} onChange={(e) => updateArrayItem("education", index, "location", e.target.value)} /></div>
                  <div className="field-group"><label>Start date</label><input type="text" value={entry.startDate} onChange={(e) => updateArrayItem("education", index, "startDate", e.target.value)} /></div>
                  <div className="field-group"><label>End date</label><input type="text" value={entry.endDate} onChange={(e) => updateArrayItem("education", index, "endDate", e.target.value)} /></div>
                </div>
              </div>
            ))}
            <button type="button" className="secondary-btn" onClick={() => addArrayItem("education", emptyEducation)}>
              Add Education
            </button>
          </div>

          <div className="form-section">
            <h3>Work Experience</h3>
            {formData.experience.map((entry, index) => (
              <div key={`experience-${index}`} className="entry-card">
                <div className="entry-header">
                  <span>Experience #{index + 1}</span>
                  {formData.experience.length > 1 && (
                    <button type="button" className="mini-btn danger" onClick={() => removeArrayItem("experience", index)}>
                      Remove
                    </button>
                  )}
                </div>

                <div className="field-grid two-col">
                  <div className="field-group"><label>Company</label><input type="text" value={entry.company} onChange={(e) => updateArrayItem("experience", index, "company", e.target.value)} /></div>
                  <div className="field-group"><label>Role</label><input type="text" value={entry.role} onChange={(e) => updateArrayItem("experience", index, "role", e.target.value)} /></div>
                  <div className="field-group"><label>Location</label><input type="text" value={entry.location} onChange={(e) => updateArrayItem("experience", index, "location", e.target.value)} /></div>
                  <div className="field-group"><label>Start date</label><input type="text" value={entry.startDate} onChange={(e) => updateArrayItem("experience", index, "startDate", e.target.value)} /></div>
                  <div className="field-group"><label>End date</label><input type="text" value={entry.endDate} onChange={(e) => updateArrayItem("experience", index, "endDate", e.target.value)} /></div>
                  <div className="field-group full-width"><label>Key responsibilities / achievements</label><textarea rows="4" value={entry.description} onChange={(e) => updateArrayItem("experience", index, "description", e.target.value)} /></div>
                </div>
              </div>
            ))}
            <button type="button" className="secondary-btn" onClick={() => addArrayItem("experience", emptyExperience)}>
              Add Experience
            </button>
          </div>

          <div className="form-section">
            <h3>Projects</h3>
            {formData.projects.map((entry, index) => (
              <div key={`project-${index}`} className="entry-card">
                <div className="entry-header">
                  <span>Project #{index + 1}</span>
                  {formData.projects.length > 1 && (
                    <button type="button" className="mini-btn danger" onClick={() => removeArrayItem("projects", index)}>
                      Remove
                    </button>
                  )}
                </div>

                <div className="field-grid two-col">
                  <div className="field-group"><label>Project name</label><input type="text" value={entry.name} onChange={(e) => updateArrayItem("projects", index, "name", e.target.value)} /></div>
                  <div className="field-group"><label>Project link</label><input type="url" value={entry.link} onChange={(e) => updateArrayItem("projects", index, "link", e.target.value)} /></div>
                  <div className="field-group full-width"><label>Description</label><textarea rows="4" value={entry.description} onChange={(e) => updateArrayItem("projects", index, "description", e.target.value)} /></div>
                  <div className="field-group full-width"><label>Technologies</label><input type="text" value={entry.technologies} placeholder="React, Node.js, PostgreSQL" onChange={(e) => updateArrayItem("projects", index, "technologies", e.target.value)} /></div>
                </div>
              </div>
            ))}
            <button type="button" className="secondary-btn" onClick={() => addArrayItem("projects", emptyProject)}>
              Add Project
            </button>
          </div>

          <div className="form-section">
            <h3>Certifications</h3>
            {formData.certifications.map((entry, index) => (
              <div key={`cert-${index}`} className="entry-card">
                <div className="entry-header">
                  <span>Certification #{index + 1}</span>
                  {formData.certifications.length > 1 && (
                    <button type="button" className="mini-btn danger" onClick={() => removeArrayItem("certifications", index)}>
                      Remove
                    </button>
                  )}
                </div>

                <div className="field-grid two-col">
                  <div className="field-group"><label>Name</label><input type="text" value={entry.name} onChange={(e) => updateArrayItem("certifications", index, "name", e.target.value)} /></div>
                  <div className="field-group"><label>Issuer</label><input type="text" value={entry.issuer} onChange={(e) => updateArrayItem("certifications", index, "issuer", e.target.value)} /></div>
                  <div className="field-group full-width"><label>Date</label><input type="text" value={entry.date} onChange={(e) => updateArrayItem("certifications", index, "date", e.target.value)} /></div>
                </div>
              </div>
            ))}
            <button type="button" className="secondary-btn" onClick={() => addArrayItem("certifications", emptyCertification)}>
              Add Certification
            </button>
          </div>

          <div className="resume-form-actions">
            <button type="button" className="secondary-btn" onClick={handleSave}>
              Save Draft
            </button>
            <button type="button" className="primary-btn" onClick={handleContinue}>
              Continue
            </button>
          </div>

          {saveMessage && <p className="save-status">{saveMessage}</p>}
        </form>
      </div>
    </div>
  );
}
