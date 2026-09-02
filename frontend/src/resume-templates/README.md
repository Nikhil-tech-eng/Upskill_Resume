# Upskill_Resume — Resume Template System

## Shared data contract

Every template receives exactly one prop:

```jsx
<TemplatePreview resumeData={resumeData} />
```

Expected shape:

```js
{
  personalInfo: {
    name: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: ''
  },
  summary: '',
  skills: [],
  education: [],
  experience: [],
  projects: [],
  certifications: []
}
```

The templates are deliberately tolerant of common field aliases inside entries (for example `role`/`position`, `company`/`employer`, `degree`/`qualification`, `institution`/`school`, and `startDate`/`start`). This does not create a second data model.

## Component architecture

- `Template01` ... `Template25` are independent components.
- Each component owns its own `Preview.jsx` and `style.css`.
- No template contains navigation, form state, selection state, import logic, or DOCX logic.
- All templates consume the same `resumeData`.
- CSS is scoped to the template root (`.rt-01` ... `.rt-25`) to avoid collisions.
- Empty sections are not rendered.
- Optional entry fields are checked before rendering.
- Arrays support multiple entries.

## Registry

`src/resume-templates/index.js` maps stable IDs to Preview components:

```js
RESUME_TEMPLATES.Template01
```

Use `selectedTemplate` only as a lookup key. Do not duplicate resume rendering logic in `ResumeBuilder.jsx`.

## Dynamic rendering

```jsx
const TemplatePreview =
  RESUME_TEMPLATES[selectedTemplate] ?? RESUME_TEMPLATES.Template01;

return <TemplatePreview resumeData={resumeData} />;
```

Template selection therefore changes only the component being rendered. The form/import pipeline and DOCX export keep using the same shared `resumeData`.

## Print/preview notes

The templates use A4-friendly widths, avoid external assets, support responsive preview widths, and include print rules. The application's existing preview wrapper should provide the page shadow/zoom behavior if it already has one; the template CSS intentionally does not depend on builder-level UI styles.
