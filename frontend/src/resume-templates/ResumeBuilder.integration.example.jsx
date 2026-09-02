// ResumeBuilder.jsx integration example
import React from 'react';
import { RESUME_TEMPLATES } from './resume-templates';

export default function ResumeBuilder({ resumeData, selectedTemplate = 'Template01' }) {
  const TemplatePreview = RESUME_TEMPLATES[selectedTemplate] || RESUME_TEMPLATES.Template01;

  return (
    <div className="resume-preview-area">
      <TemplatePreview resumeData={resumeData} />
    </div>
  );
}

// If your existing builder already has state:
// const [selectedTemplate, setSelectedTemplate] = useState('Template01');
// const TemplatePreview = RESUME_TEMPLATES[selectedTemplate] ?? RESUME_TEMPLATES.Template01;
// ...
// <TemplatePreview resumeData={resumeData} />
//
// The form/import code continues writing to the same resumeData object.
// DOCX export continues receiving that same resumeData object.
