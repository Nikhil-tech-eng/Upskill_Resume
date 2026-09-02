const getSafeText = (value) => (typeof value === "string" ? value.trim() : value?.toString?.().trim?.() || "");

const getVisibleSkills = (skills) => (Array.isArray(skills) ? skills.filter((skill) => getSafeText(skill).length > 0) : []);
const filterEmptyItems = (items) => items.filter((item) => item && Object.values(item).some((value) => getSafeText(String(value)).length > 0));

export default function ModernMinimalTemplate({ template, personal = {}, summary = "", skills = [], education = [], experience = [], projects = [], certifications = [] }) {
  const visibleSkills = getVisibleSkills(skills);
  const safeEducation = filterEmptyItems(education);
  const safeExperience = filterEmptyItems(experience);
  const safeProjects = filterEmptyItems(projects);
  const safeCertifications = filterEmptyItems(certifications);

  return (
    <div className="resume-preview-page modern-preview" style={{ "--template-accent": template.accent, "--template-secondary": template.secondary }}>
      <div className="resume-preview-header">
        <div>
          <h1>{getSafeText(personal.fullName) || "Your Name"}</h1>
          {personal.professionalTitle && <p className="resume-preview-title">{personal.professionalTitle}</p>}
        </div>
        <div className="resume-preview-contact">
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>{personal.phone}</span>}
          {personal.location && <span>{personal.location}</span>}
          {personal.linkedin && <span>{personal.linkedin}</span>}
          {personal.portfolio && <span>{personal.portfolio}</span>}
        </div>
      </div>

      {summary && (
        <section className="resume-preview-section">
          <h3>Professional Summary</h3>
          <p>{summary}</p>
        </section>
      )}

      {visibleSkills.length > 0 && (
        <section className="resume-preview-section">
          <h3>Skills</h3>
          <div className="resume-skill-list">
            {visibleSkills.map((skill, index) => (
              <span key={`${skill}-${index}`} className="resume-skill-pill">{skill}</span>
            ))}
          </div>
        </section>
      )}

      {safeExperience.length > 0 && (
        <section className="resume-preview-section">
          <h3>Experience</h3>
          {safeExperience.map((item, index) => (
            <div key={`exp-${index}`} className="resume-entry">
              <div className="resume-entry-header">
                <strong>{item.role || "Role"}</strong>
                <span>{item.startDate || "Start"} - {item.endDate || "Present"}</span>
              </div>
              <div className="resume-entry-meta">
                <span>{item.company || "Company"}</span>
                {item.location && <span>{item.location}</span>}
              </div>
              {item.description && <p>{item.description}</p>}
            </div>
          ))}
        </section>
      )}

      {safeEducation.length > 0 && (
        <section className="resume-preview-section">
          <h3>Education</h3>
          {safeEducation.map((item, index) => (
            <div key={`edu-${index}`} className="resume-entry">
              <div className="resume-entry-header">
                <strong>{item.degree || "Degree"}</strong>
                <span>{item.startDate || "Start"} - {item.endDate || "End"}</span>
              </div>
              <div className="resume-entry-meta">
                <span>{item.school || "School"}</span>
                {item.location && <span>{item.location}</span>}
              </div>
            </div>
          ))}
        </section>
      )}

      {safeProjects.length > 0 && (
        <section className="resume-preview-section">
          <h3>Projects</h3>
          {safeProjects.map((item, index) => (
            <div key={`project-${index}`} className="resume-entry">
              <div className="resume-entry-header">
                <strong>{item.name || "Project"}</strong>
                {item.link && (
                  <a href={item.link} target="_blank" rel="noreferrer">
                    Link
                  </a>
                )}
              </div>
              {item.description && <p>{item.description}</p>}
              {item.technologies && <p className="resume-tech">{item.technologies}</p>}
            </div>
          ))}
        </section>
      )}

      {safeCertifications.length > 0 && (
        <section className="resume-preview-section">
          <h3>Certifications</h3>
          {safeCertifications.map((item, index) => (
            <div key={`cert-${index}`} className="resume-entry compact-entry">
              <div className="resume-entry-header">
                <strong>{item.name || "Certification"}</strong>
                <span>{item.date || "Date"}</span>
              </div>
              {item.issuer && <p>{item.issuer}</p>}
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
