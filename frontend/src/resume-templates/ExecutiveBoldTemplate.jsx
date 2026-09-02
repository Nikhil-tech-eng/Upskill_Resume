const getSafeText = (value) => (typeof value === "string" ? value.trim() : value?.toString?.().trim?.() || "");

const getVisibleSkills = (skills) => (Array.isArray(skills) ? skills.filter((skill) => getSafeText(skill).length > 0) : []);
const filterEmptyItems = (items) => items.filter((item) => item && Object.values(item).some((value) => getSafeText(String(value)).length > 0));

export default function ExecutiveBoldTemplate({ template, personal = {}, summary = "", skills = [], education = [], experience = [], projects = [], certifications = [] }) {
  const visibleSkills = getVisibleSkills(skills);
  const safeEducation = filterEmptyItems(education);
  const safeExperience = filterEmptyItems(experience);
  const safeProjects = filterEmptyItems(projects);
  const safeCertifications = filterEmptyItems(certifications);

  return (
    <div className="resume-preview-page executive-preview" style={{ "--template-accent": template.accent, "--template-secondary": template.secondary }}>
      <div className="executive-side-panel">
        <h2>{getSafeText(personal.fullName) || "Your Name"}</h2>
        {personal.professionalTitle && <p className="executive-role">{personal.professionalTitle}</p>}

        {visibleSkills.length > 0 && (
          <div className="executive-block">
            <h4>Core Skills</h4>
            <ul>
              {visibleSkills.map((skill, index) => <li key={`${skill}-${index}`}>{skill}</li>)}
            </ul>
          </div>
        )}

        {safeCertifications.length > 0 && (
          <div className="executive-block">
            <h4>Certifications</h4>
            <ul>
              {safeCertifications.map((item, index) => <li key={`cert-${index}`}>{item.name || "Certification"}</li>)}
            </ul>
          </div>
        )}
      </div>

      <div className="executive-main-panel">
        <div className="executive-contact">
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>{personal.phone}</span>}
          {personal.location && <span>{personal.location}</span>}
          {personal.linkedin && <span>{personal.linkedin}</span>}
          {personal.portfolio && <span>{personal.portfolio}</span>}
        </div>

        {summary && (
          <section className="resume-preview-section executive-section">
            <h3>Profile</h3>
            <p>{summary}</p>
          </section>
        )}

        {safeExperience.length > 0 && (
          <section className="resume-preview-section executive-section">
            <h3>Experience</h3>
            {safeExperience.map((item, index) => (
              <div key={`exp-${index}`} className="resume-entry executive-entry">
                <div className="resume-entry-header">
                  <strong>{item.role || "Role"}</strong>
                  <span>{item.startDate || "Start"} - {item.endDate || "End"}</span>
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
          <section className="resume-preview-section executive-section">
            <h3>Education</h3>
            {safeEducation.map((item, index) => (
              <div key={`edu-${index}`} className="resume-entry executive-entry">
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
          <section className="resume-preview-section executive-section">
            <h3>Projects</h3>
            {safeProjects.map((item, index) => (
              <div key={`project-${index}`} className="resume-entry executive-entry">
                <div className="resume-entry-header">
                  <strong>{item.name || "Project"}</strong>
                  {item.link && (
                    <a href={item.link} target="_blank" rel="noreferrer">
                      Link
                    </a>
                  )}
                </div>
                {item.description && <p>{item.description}</p>}
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}
