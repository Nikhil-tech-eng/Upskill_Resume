import { createElement } from "react";

const templateModules = import.meta.glob("./Template*/Preview.jsx", { eager: true });

const normalizeTemplateId = (modulePath) => {
  const match = modulePath.match(/\.\/Template(\d+)\/Preview\.jsx$/);
  if (!match) return null;

  const numericValue = Number.parseInt(match[1], 10);
  if (!Number.isFinite(numericValue) || numericValue <= 0) return null;

  return `Template${String(numericValue).padStart(2, "0")}`;
};

const templateEntries = Object.entries(templateModules)
  .reduce((entries, [modulePath, importedModule]) => {
    const templateId = normalizeTemplateId(modulePath);
    if (!templateId || !importedModule?.default || entries.some(([existingId]) => existingId === templateId)) {
      return entries;
    }

    entries.push([templateId, importedModule.default]);
    return entries;
  }, [])
  .sort(([left], [right]) => {
    const leftNumber = Number.parseInt(left.replace(/\D/g, ""), 10) || 0;
    const rightNumber = Number.parseInt(right.replace(/\D/g, ""), 10) || 0;
    return leftNumber - rightNumber;
  });

export const RESUME_TEMPLATES = Object.fromEntries(templateEntries);

const TEMPLATE_NAMES = {
  Template01: "Modern Minimal",
  Template02: "Classic Professional",
  Template03: "Executive",
  Template04: "Corporate",
  Template05: "ATS Focused",
  Template06: "Modern Two Column",
  Template07: "Elegant Professional",
  Template08: "Technology / Developer",
  Template09: "Software Engineer",
  Template10: "Creative Designer",
  Template11: "Academic",
  Template12: "Graduate / Fresher",
  Template13: "Engineering",
  Template14: "Finance",
  Template15: "Management",
  Template16: "Editorial",
  Template17: "Timeline",
  Template18: "Sidebar Professional",
  Template19: "Compact One Page",
  Template20: "Monochrome",
  Template21: "Bold Modern",
  Template22: "Premium Professional",
  Template23: "Creative Professional",
  Template24: "Clean ATS Professional",
  Template25: "Contemporary Modern",
};

export const TEMPLATE_OPTIONS = Object.keys(RESUME_TEMPLATES).map((id, index) => ({
  id,
  name: TEMPLATE_NAMES[id] || `Template ${Number.parseInt(id.replace(/\D/g, ""), 10) || 1}`,
  description: "Professional resume layout",
  previewStyle: ["modern", "classic", "executive"][index % 3],
}));

export const TemplatePreview = ({ templateId, resumeData }) => {
  const TemplateComponent = RESUME_TEMPLATES[templateId] || RESUME_TEMPLATES.Template01;
  return createElement(TemplateComponent, { resumeData });
};
