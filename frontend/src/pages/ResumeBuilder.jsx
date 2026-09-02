import {
  AlignmentType,
  Document as DocxDocument,
  HeadingLevel,
  Packer,
  Paragraph,
  TextRun,
} from "docx";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api";
import { TEMPLATE_OPTIONS, TemplatePreview } from "../resume-templates";

const TEMPLATE_STORAGE_KEY = "resumeBuilderSelectedTemplate";
const RESUME_DRAFT_KEY = "resumeBuilderDraft";

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

const createTemplatePreviewData = () => ({
  personalInfo: {
    fullName: "Jordan Lee",
    professionalTitle: "Senior Product Designer",
    email: "jordan.lee@example.com",
    phone: "(555) 123-4567",
    location: "Austin, TX",
    linkedin: "linkedin.com/in/jordanlee",
    portfolio: "github.com/jordanlee",
  },
  summary:
    "Product designer with 7+ years of experience creating polished user experiences for SaaS products, improving onboarding conversion, and aligning design systems with business goals.",
  skills: [
    "Product Strategy",
    "UX Research",
    "Figma",
    "Design Systems",
    "Wireframing",
    "Prototyping",
    "A/B Testing",
    "Stakeholder Management",
  ],
  education: [
    {
      school: "University of Texas",
      degree: "B.A. in Design",
      field: "Interaction Design",
      startDate: "2012",
      endDate: "2016",
      location: "Austin, TX",
    },
  ],
  experience: [
    {
      company: "Northstar Labs",
      role: "Senior Product Designer",
      location: "Austin, TX",
      startDate: "2021",
      endDate: "Present",
      description:
        "Led end-to-end design work for core product flows, collaborated with product and engineering, and improved user activation by 28%.",
    },
    {
      company: "Brightpath Studio",
      role: "Product Designer",
      location: "Boston, MA",
      startDate: "2018",
      endDate: "2021",
      description:
        "Created mobile and web experiences for B2B SaaS clients, improved usability metrics, and built reusable design patterns for faster delivery.",
    },
  ],
  projects: [
    {
      name: "Portfolio Revamp",
      description: "Redesigned a content-rich portfolio to simplify navigation and improve lead conversion across marketing channels.",
      link: "https://example.com",
      technologies: "Figma, User Testing, React",
    },
  ],
  certifications: [
    {
      name: "Certified UX Designer",
      issuer: "Interaction Design Foundation",
      date: "2023",
    },
  ],
});

const getSavedTemplate = () => {
  try {
    const raw = localStorage.getItem(TEMPLATE_STORAGE_KEY);
    if (!raw) return TEMPLATE_OPTIONS[0];

    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.id) return TEMPLATE_OPTIONS[0];

    const match = TEMPLATE_OPTIONS.find((template) => template.id === parsed.id);
    return match || TEMPLATE_OPTIONS[0];
  } catch (error) {
    console.error("Failed to read saved template", error);
    return TEMPLATE_OPTIONS[0];
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

const getSafeText = (value) => value?.trim() || "";

const filterEmptyItems = (items) => items.filter((item) => item && Object.values(item).some((value) => getSafeText(String(value)).length > 0));

const getVisibleSkills = (skills) => (Array.isArray(skills) ? skills.filter((skill) => getSafeText(skill).length > 0) : []);

const normalizeResumeText = (text = "") =>
  text
    .replace(/\r/g, "\n")
    .replace(/\u00A0/g, " ")
    .replace(/\t/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

const extractMatch = (text, pattern, fallback = "") => {
  const match = text.match(pattern);
  return match ? getSafeText(match[0]) : fallback;
};

const parseResumeTextIntoStructure = (text = "") => {
  const normalized = normalizeResumeText(text);
  if (!normalized) {
    return createInitialResumeData();
  }

  const lines = normalized
    .split(/\n+/)
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter(Boolean);

  const email = extractMatch(normalized, /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i) || "";
  const phone = extractMatch(
    normalized,
    /(?:\+?\d{1,3}[\s.-]?)?(?:\(?\d{2,4}\)?[\s.-]?)\d{3}[\s.-]?\d{4}/
  ) || "";
  const linkedin = extractMatch(normalized, /https?:\/\/(?:www\.)?linkedin\.com\/[^\s]+/i) || "";
  const portfolio = extractMatch(normalized, /https?:\/\/[^\s]+/i, "") || "";

  const firstNameLine = lines.find((line) => {
    const words = line.split(/\s+/).filter(Boolean);
    return words.length >= 2 && !/skills|education|experience|projects?|summary|profile|objective|certificat|linkedin|http|@/.test(line.toLowerCase());
  }) || "";

  const fullName = getSafeText(firstNameLine) || "";
  const titleCandidates = lines.filter((line) => {
    if (!line || line === fullName || line === email || line === phone || /skills|education|experience|projects?|summary|profile|objective|certificat|linkedin|http|@/.test(line.toLowerCase())) {
      return false;
    }
    return line.length <= 80 && line.split(/\s+/).length >= 2;
  });
  const professionalTitle = getSafeText(titleCandidates[0] || "");

  const findSection = (sectionNames) => {
    const sectionPattern = new RegExp(`(${sectionNames.join("|")})`, "i");
    const startIndex = lines.findIndex((line) => sectionPattern.test(line));
    if (startIndex === -1) return [];

    const sectionLines = [];
    for (let i = startIndex + 1; i < lines.length; i += 1) {
      const current = lines[i];
      if (/^(skills|education|experience|projects?|certifications?|summary|profile|objective)$/i.test(current)) {
        break;
      }
      if (current.length > 0) sectionLines.push(current);
    }
    return sectionLines;
  };

  const summaryLines = findSection(["summary", "profile", "objective"]);
  const summary = summaryLines.join(" ");

  const skillsSection = findSection(["skills", "technical skills", "core competencies", "tools"]);
  const skills = skillsSection
    .flatMap((line) => line.split(/[;,|•]/).map((item) => item.trim()))
    .filter((item) => item && item.length > 1)
    .slice(0, 25);

  const educationSection = findSection(["education", "academic background"]);
  const education = educationSection.length
    ? educationSection
        .reduce((groups, line) => {
          const current = groups[groups.length - 1];
          if (!current || /school|college|university|degree|bachelor|master|diploma|certificate/i.test(line)) {
            groups.push([line]);
          } else if (current[current.length - 1] && current[current.length - 1].length < 80) {
            current.push(line);
          }
          return groups;
        }, [])
        .filter((group) => group.length)
        .map((group) => {
          const text = group.join(" | ");
          const schoolMatch = text.match(/(.+?)(?:\s*\|\s*|\s*[-–]\s*|\s+)(?:Bachelor|Master|B\.S\.|B\.A\.|M\.S\.|M\.A\.|Diploma|Degree|Certification)/i);
          const degreeMatch = text.match(/(?:Bachelor|Master|B\.S\.|B\.A\.|M\.S\.|M\.A\.|Diploma|Degree|Certification)[^|\n]*/i);
          const school = getSafeText(schoolMatch ? schoolMatch[1] : group[0]);
          return {
            school,
            degree: degreeMatch ? degreeMatch[0] : group[1] || "",
            field: "",
            startDate: "",
            endDate: "",
            location: text.match(/\(([^)]+)\)|,\s*[A-Z][a-z]+(?:,\s*[A-Z]{2})?/) ? text.match(/\(([^)]+)\)|,\s*[A-Z][a-z]+(?:,\s*[A-Z]{2})?/)[0].replace(/[()]/g, "") : "",
          };
        })
    : [{ school: "", degree: "", field: "", startDate: "", endDate: "", location: "" }];

  const experienceSection = findSection(["experience", "work experience", "professional experience", "employment"]);
  const experience = experienceSection.length
    ? experienceSection.reduce((blocks, line) => {
        const current = blocks[blocks.length - 1];
        if (/\d{4}|present|current|junior|senior|manager|engineer|developer|analyst|specialist|consultant/i.test(line) || (current && current.length > 0 && current[current.length - 1].includes(" • "))) {
          if (!current || current.join(" ").length > 180) {
            blocks.push([line]);
          } else {
            current.push(line);
          }
        } else if (!current) {
          blocks.push([line]);
        } else {
          current.push(line);
        }
        return blocks;
      }, [])
      .filter((block) => block.length)
      .map((block) => {
        const text = block.join(" ");
        const roleMatch = text.match(/([A-Z][A-Za-z&/.-]+(?:\s+[A-Z][A-Za-z&/.-]+){0,4})\s*(?:at|@|\|)/i) || text.match(/([A-Z][A-Za-z&/.-]+(?:\s+[A-Z][A-Za-z&/.-]+){0,4})\s*[-–]\s*/i);
        const companyMatch = text.match(/(?:at|@|\|)\s*([A-Z][A-Za-z0-9&.,' -]+?)(?:\s*\|\s*|\s*\d{4}|\s*\([^)]*\)|$)/i);
        const dateMatch = text.match(/(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|[0-9]{4})\s*(?:[-–to]+|\s*to\s*)\s*(?:Present|Current|[A-Za-z]+\s*[0-9]{4}|[0-9]{4})/i) || text.match(/(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|[0-9]{4})/i);
        return {
          company: companyMatch ? companyMatch[1].trim() : "",
          role: roleMatch ? roleMatch[1].trim() : "",
          location: text.match(/\(([^)]+)\)/) ? text.match(/\(([^)]+)\)/)[1].trim() : "",
          startDate: dateMatch ? dateMatch[0].split(/\s*(?:-|–|to)\s*/i)[0].trim() : "",
          endDate: dateMatch ? (dateMatch[0].match(/(?:Present|Current|\d{4})$/i)?.[0] || "Present") : "",
          description: text.replace(/\s+/g, " ").substring(0, 350),
        };
      })
    : [{ company: "", role: "", location: "", startDate: "", endDate: "", description: "" }];

  const projectsSection = findSection(["projects", "project work"]);
  const projects = projectsSection.length
    ? projectsSection.reduce((blocks, line) => {
        if (!blocks.length || /^(project|built|led|developed|created)/i.test(line)) blocks.push([line]);
        else blocks[blocks.length - 1].push(line);
        return blocks;
      }, [])
      .filter((block) => block.length)
      .map((block) => {
        const text = block.join(" ");
        const nameMatch = text.match(/(?:Project|Built|Created|Developed)\s+([A-Z][A-Za-z0-9&/\- ]+)/i);
        return {
          name: nameMatch ? nameMatch[1].trim() : "",
          description: text.replace(/(Project|Built|Created|Developed)/gi, "").trim(),
          link: "",
          technologies: "",
        };
      })
    : [{ name: "", description: "", link: "", technologies: "" }];

  const certificationsSection = findSection(["certifications", "licenses", "awards"]);
  const certifications = certificationsSection.length
    ? certificationsSection.map((line) => ({
        name: line,
        issuer: "",
        date: "",
      }))
    : [{ name: "", issuer: "", date: "" }];

  return {
    personalInfo: {
      fullName,
      professionalTitle,
      email,
      phone,
      location: "",
      linkedin,
      portfolio: portfolio && portfolio !== linkedin ? portfolio : "",
    },
    summary,
    skills,
    education: education.filter((item) => item && (item.school || item.degree || item.location)),
    experience: experience.filter((item) => item && (item.company || item.role || item.description)),
    projects: projects.filter((item) => item && (item.name || item.description)),
    certifications: certifications.filter((item) => item && (item.name || item.issuer || item.date)),
  };
};

const sanitizeFileName = (value) => {
  const cleaned = getSafeText(value).toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return cleaned.replace(/^-+|-+$/g, "") || "resume";
};

const buildResumeWordDocument = (data, template) => {
  const personal = data.personalInfo || {};
  const accent = template?.accent || "#7c6cf5";
  const accentHex = accent.startsWith("#") ? accent.slice(1) : accent;
  const safeAccent = accentHex.length === 6 ? accentHex : "7c6cf5";

  const paragraphs = [];
  const addTitle = (text, level = HeadingLevel.HEADING_1, color = safeAccent) => {
    paragraphs.push(
      new Paragraph({
        heading: level,
        spacing: { before: 100, after: 180 },
        children: [new TextRun({ text, bold: true, color, size: level === HeadingLevel.HEADING_1 ? 32 : 24 })],
      })
    );
  };

  const addText = (text, options = {}) => {
    const { bold = false, italics = false, color = "000000", size = 21 } = options;
    if (!text) return;

    paragraphs.push(
      new Paragraph({
        alignment: options.align || AlignmentType.left,
        spacing: { before: 40, after: 40 },
        children: [
          new TextRun({
            text,
            bold,
            italics,
            color,
            size,
          }),
        ],
      })
    );
  };

  const addSectionHeader = (text) => addTitle(text, HeadingLevel.HEADING_2, safeAccent);

  const addBulletList = (items) => {
    items.forEach((item) => {
      const text = getSafeText(item);
      if (!text) return;

      paragraphs.push(
        new Paragraph({
          bullet: { level: 0 },
          spacing: { after: 100 },
          children: [new TextRun({ text, size: 21, color: "1f2937" })],
        })
      );
    });
  };

  const fullName = getSafeText(personal.fullName) || "Your Name";
  const title = getSafeText(personal.professionalTitle);
  const summary = getSafeText(data.summary);
  const skills = (Array.isArray(data.skills) ? data.skills : []).filter((item) => getSafeText(item).length > 0);
  const education = (Array.isArray(data.education) ? data.education : []).filter((item) => item && Object.values(item).some((value) => getSafeText(String(value)).length > 0));
  const experience = (Array.isArray(data.experience) ? data.experience : []).filter((item) => item && Object.values(item).some((value) => getSafeText(String(value)).length > 0));
  const projects = (Array.isArray(data.projects) ? data.projects : []).filter((item) => item && Object.values(item).some((value) => getSafeText(String(value)).length > 0));
  const certifications = (Array.isArray(data.certifications) ? data.certifications : []).filter((item) => item && Object.values(item).some((value) => getSafeText(String(value)).length > 0));

  addTitle(fullName, HeadingLevel.HEADING_1, safeAccent);
  if (title) addText(title, { bold: true, color: "374151", size: 24 });

  const contactItems = [
    personal.email,
    personal.phone,
    personal.location,
    personal.linkedin,
    personal.portfolio,
  ].filter(Boolean);

  if (contactItems.length > 0) {
    addText(contactItems.join("  •  "), { color: "374151", size: 20 });
  }

  if (summary) {
    addSectionHeader("Professional Summary");
    addText(summary, { size: 22, color: "1f2937" });
  }

  if (skills.length > 0) {
    addSectionHeader("Skills");
    addBulletList(skills);
  }

  if (education.length > 0) {
    addSectionHeader("Education");
    education.forEach((item) => {
      const institution = getSafeText(item.school) || "School";
      const degree = getSafeText(item.degree) || "Degree";
      const field = getSafeText(item.field);
      const dates = [item.startDate, item.endDate].filter(Boolean).join(" - ") || "Dates";
      const location = getSafeText(item.location);

      addText(`${degree}${field ? `, ${field}` : ""}`, { bold: true, size: 22, color: "111827" });
      addText(`${institution}${location ? ` • ${location}` : ""}`, { size: 20, color: "374151" });
      if (dates) addText(dates, { italics: true, size: 19, color: "374151" });
    });
  }

  if (experience.length > 0) {
    addSectionHeader("Experience");
    experience.forEach((item) => {
      const role = getSafeText(item.role) || "Role";
      const company = getSafeText(item.company) || "Company";
      const dates = [item.startDate, item.endDate].filter(Boolean).join(" - ") || "Dates";
      const location = getSafeText(item.location);

      addText(`${role} | ${company}`, { bold: true, size: 22, color: "111827" });
      const meta = [dates, location].filter(Boolean).join(" • ");
      if (meta) addText(meta, { size: 19, color: "374151" });

      const description = getSafeText(item.description);
      if (description) {
        description
          .split(/\n+/)
          .map((line) => line.trim())
          .filter(Boolean)
          .forEach((line) => addText(`• ${line}`, { size: 20, color: "1f2937" }));
      }
    });
  }

  if (projects.length > 0) {
    addSectionHeader("Projects");
    projects.forEach((item) => {
      const name = getSafeText(item.name) || "Project";
      const link = getSafeText(item.link);
      const description = getSafeText(item.description);
      const technologies = getSafeText(item.technologies);

      addText(name, { bold: true, size: 22, color: "111827" });
      if (link) addText(link, { size: 18, color: "2563eb" });
      if (description) addText(description, { size: 20, color: "1f2937" });
      if (technologies) addText(`Technologies: ${technologies}`, { italics: true, size: 19, color: "374151" });
    });
  }

  if (certifications.length > 0) {
    addSectionHeader("Certifications");
    certifications.forEach((item) => {
      const name = getSafeText(item.name) || "Certification";
      const issuer = getSafeText(item.issuer);
      const date = getSafeText(item.date);

      addText(name, { bold: true, size: 22, color: "111827" });
      if (issuer) addText(issuer, { size: 20, color: "374151" });
      if (date) addText(date, { italics: true, size: 19, color: "374151" });
    });
  }

  return new DocxDocument({
    sections: [
      {
        properties: {
          page: {
            size: {
              width: 11906,
              height: 16838,
            },
            margin: {
              top: 720,
              right: 720,
              bottom: 720,
              left: 720,
            },
          },
        },
        children: paragraphs,
      },
    ],
  });
};

export default function ResumeBuilder() {
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState(getSavedTemplate().id);
  const [formData, setFormData] = useState(getSavedDraft);
  const [errors, setErrors] = useState({});
  const [saveMessage, setSaveMessage] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState("");
  const [importState, setImportState] = useState({
    isOpen: false,
    isLoading: false,
    resumes: [],
    selectedResumeId: "",
    error: "",
  });
  const uploadInputRef = useRef(null);

  useEffect(() => {
    localStorage.setItem(TEMPLATE_STORAGE_KEY, JSON.stringify({
      id: selectedTemplate,
      name: TEMPLATE_OPTIONS.find((template) => template.id === selectedTemplate)?.name || selectedTemplate,
    }));
  }, [selectedTemplate]);

  useEffect(() => {
    localStorage.setItem(RESUME_DRAFT_KEY, JSON.stringify(formData));
  }, [formData]);

  const activeTemplate = useMemo(
    () => TEMPLATE_OPTIONS.find((template) => template.id === selectedTemplate) || TEMPLATE_OPTIONS[0],
    [selectedTemplate]
  );

  const handleSelectTemplate = (templateId) => {
    setSelectedTemplate(templateId);

    const target = document.getElementById("manual-resume-details");
    if (!target) return;

    const top = target.getBoundingClientRect().top + window.scrollY - 88;
    window.scrollTo({ top, behavior: "smooth" });
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
      [section]: prev[section].map((item, itemIndex) => itemIndex === index ? { ...item, [field]: value } : item),
    }));
  };

  const updateSkills = (index, value) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.map((skill, skillIndex) => skillIndex === index ? value : skill),
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
    setShowPreview(true);
    setSaveMessage("");
  };

  const handleImportPreviousResume = async () => {
    setImportState((prev) => ({ ...prev, isLoading: true, error: "" }));

    try {
      const response = await apiFetch("/api/resumes/my");

      if (response.status === 401 || response.status === 403) {
        throw new Error("You are not authorized to view previous resumes.");
      }

      if (!response.ok) {
        throw new Error("Unable to load your previous resumes.");
      }

      const resumes = await response.json();

      if (!Array.isArray(resumes) || resumes.length === 0) {
        setImportState({
          isOpen: true,
          isLoading: false,
          resumes: [],
          selectedResumeId: "",
          error: "No previous resumes found for this account.",
        });
        return;
      }

      setImportState({
        isOpen: true,
        isLoading: false,
        resumes,
        selectedResumeId: String(resumes[0].id),
        error: "",
      });
    } catch (error) {
      setImportState({
        isOpen: true,
        isLoading: false,
        resumes: [],
        selectedResumeId: "",
        error: error.message || "Failed to load previous resumes.",
      });
    }
  };

  const applyImportedResume = () => {
    const selectedResume = importState.resumes.find(
      (resume) => String(resume.id) === String(importState.selectedResumeId)
    );

    if (!selectedResume) {
      setImportState((prev) => ({ ...prev, error: "Please choose a resume to import." }));
      return;
    }

    const hasCurrentDraft = Object.values(formData.personalInfo).some((value) => getSafeText(value).length > 0)
      || getSafeText(formData.summary).length > 0
      || formData.skills.some((skill) => getSafeText(skill).length > 0)
      || formData.education.some((item) => Object.values(item).some((value) => getSafeText(String(value)).length > 0))
      || formData.experience.some((item) => Object.values(item).some((value) => getSafeText(String(value)).length > 0))
      || formData.projects.some((item) => Object.values(item).some((value) => getSafeText(String(value)).length > 0))
      || formData.certifications.some((item) => Object.values(item).some((value) => getSafeText(String(value)).length > 0));

    if (hasCurrentDraft) {
      const shouldReplace = window.confirm("Replace your current draft with the selected previous resume?");
      if (!shouldReplace) {
        return;
      }
    }

    try {
      const parsed = parseResumeTextIntoStructure(selectedResume.extractedText || "");
      setFormData(parsed);
      setSaveMessage("Imported data from your previous resume.");
      setImportState({ isOpen: false, isLoading: false, resumes: [], selectedResumeId: "", error: "" });
    } catch (error) {
      console.error("Resume import parsing failed", error);
      setImportState((prev) => ({ ...prev, error: "The extracted resume could not be parsed. Please try another file." }));
    }
  };

  const confirmReplaceDraft = () => {
    const hasCurrentDraft = Object.values(formData.personalInfo).some((value) => getSafeText(value).length > 0)
      || getSafeText(formData.summary).length > 0
      || formData.skills.some((skill) => getSafeText(skill).length > 0)
      || formData.education.some((item) => Object.values(item).some((value) => getSafeText(String(value)).length > 0))
      || formData.experience.some((item) => Object.values(item).some((value) => getSafeText(String(value)).length > 0))
      || formData.projects.some((item) => Object.values(item).some((value) => getSafeText(String(value)).length > 0))
      || formData.certifications.some((item) => Object.values(item).some((value) => getSafeText(String(value)).length > 0));

    if (!hasCurrentDraft) return true;
    return window.confirm("Replace your current draft with the imported resume data?");
  };

  const applyParsedImportedData = (text) => {
    try {
      const parsed = parseResumeTextIntoStructure(text || "");
      if (!confirmReplaceDraft()) {
        return;
      }
      setFormData(parsed);
      setSaveMessage("Imported data from the selected resume.");
      setImportState({ isOpen: false, isLoading: false, resumes: [], selectedResumeId: "", error: "" });
    } catch (error) {
      console.error("Resume import parsing failed", error);
      setImportState((prev) => ({ ...prev, error: "The extracted resume could not be parsed. Please try another file." }));
    }
  };

  const handleUploadResumeImport = async (event) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      setImportState((prev) => ({ ...prev, error: "Please upload a PDF or DOCX file." }));
      event.target.value = "";
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setImportState((prev) => ({ ...prev, error: "File size must be less than 5 MB." }));
      event.target.value = "";
      return;
    }

    setImportState((prev) => ({ ...prev, isLoading: true, error: "" }));

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await apiFetch("/api/resumes/upload", {
        method: "POST",
        body: formData,
      });

      if (response.status === 401 || response.status === 403) {
        throw new Error("You are not authorized to upload or import this resume.");
      }

      if (!response.ok) {
        throw new Error("Resume upload failed.");
      }

      const uploadedResume = await response.json();
      if (!uploadedResume || !uploadedResume.extractedText) {
        throw new Error("The uploaded resume could not be extracted.");
      }

      applyParsedImportedData(uploadedResume.extractedText);
    } catch (error) {
      console.error("Resume upload import failed", error);
      setImportState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message || "The uploaded resume could not be imported.",
      }));
    } finally {
      event.target.value = "";
    }
  };

  const handleDownloadWord = async () => {
    if (isExporting) return;

    setIsExporting(true);
    setExportError("");

    try {
      const resumeDocument = buildResumeWordDocument(formData, activeTemplate);
      const blob = await Packer.toBlob(resumeDocument);
      const fileName = `${sanitizeFileName(formData.personalInfo.fullName)}-resume.docx`;
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Resume DOCX generation failed", error);
      setExportError("Word export failed. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const renderForm = () => (
    <div className="resume-builder-shell">
      <div className="resume-builder-header">
        <div className="hero-badge">Free Resume Builder</div>
        <h1>Choose a Resume Template</h1>
        <p>Pick a layout that fits your experience and start building a polished, professional resume.</p>
      </div>

      <div className="template-grid">
        {TEMPLATE_OPTIONS.map((template) => {
          const isSelected = selectedTemplate === template.id;
          const previewResumeData = createTemplatePreviewData();

          return (
            <div key={template.id} className={`template-card ${isSelected ? "template-card-selected" : ""}`}>
              <div className="template-preview-panel">
                <div className="template-preview-surface">
                  <TemplatePreview templateId={template.id} resumeData={previewResumeData} />
                </div>
              </div>

              <div className="template-card-body">
                <div className="template-title-row">
                  <h3>{template.name}</h3>
                  {isSelected && <span className="selected-badge">Selected</span>}
                </div>
                {template.description && <p>{template.description}</p>}
                <button type="button" className={`template-select-btn ${isSelected ? "template-select-btn-selected" : ""}`} onClick={() => handleSelectTemplate(template.id)}>
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
          <strong>{activeTemplate.name}</strong>
        </div>
        <p>This template choice is saved and will be reused for the form, preview, and DOCX generation in later phases.</p>
      </div>

      <div className="resume-import-action-row">
        <button type="button" className="secondary-btn" onClick={handleImportPreviousResume} disabled={importState.isLoading}>
          {importState.isLoading ? "Loading resumes..." : "Import from Previous Resume"}
        </button>

        <button type="button" className="secondary-btn" onClick={() => uploadInputRef.current?.click()} disabled={importState.isLoading}>
          Upload Resume to Import
        </button>

        <input
          ref={uploadInputRef}
          type="file"
          accept=".pdf,.docx"
          hidden
          onChange={handleUploadResumeImport}
        />
      </div>

      {importState.isOpen && (
        <div className="resume-import-panel">
          <div className="resume-import-header">
            <h3>Previous resumes</h3>
            <button type="button" className="mini-btn" onClick={() => setImportState({ isOpen: false, isLoading: false, resumes: [], selectedResumeId: "", error: "" })}>
              Close
            </button>
          </div>

          {importState.error ? (
            <p className="resume-import-error">{importState.error}</p>
          ) : importState.resumes.length === 0 ? (
            <p className="resume-import-empty">No previous resumes found.</p>
          ) : (
            <>
              <label className="resume-import-label">Choose a resume</label>
              <select
                className="resume-import-select"
                value={importState.selectedResumeId}
                onChange={(event) => setImportState((prev) => ({ ...prev, selectedResumeId: event.target.value }))}
              >
                {importState.resumes.map((resume) => (
                  <option key={resume.id} value={resume.id}>
                    {resume.fileName || `Resume ${resume.id}`}
                  </option>
                ))}
              </select>

              <div className="resume-import-actions">
                <button type="button" className="secondary-btn" onClick={() => setImportState({ isOpen: false, isLoading: false, resumes: [], selectedResumeId: "", error: "" })}>
                  Cancel
                </button>
                <button type="button" className="primary-btn" onClick={applyImportedResume}>
                  Import selected resume
                </button>
              </div>
            </>
          )}
        </div>
      )}

      <form id="manual-resume-details" className="resume-form-panel" onSubmit={(event) => event.preventDefault()}>
        <div className="resume-form-header">
          <h2>Manual Resume Details</h2>
          <p>Complete your profile details to shape the resume content.</p>
        </div>

        <div className="form-section">
          <h3>Profile</h3>
          <div className="field-grid two-col">
            <div className="field-group">
              <label>Full name</label>
              <input type="text" value={formData.personalInfo.fullName} onChange={(e) => updatePersonalField("fullName", e.target.value)} />
              {errors.fullName && <span className="field-error">{errors.fullName}</span>}
            </div>
            <div className="field-group">
              <label>Professional title</label>
              <input type="text" value={formData.personalInfo.professionalTitle} onChange={(e) => updatePersonalField("professionalTitle", e.target.value)} />
            </div>
            <div className="field-group">
              <label>Email</label>
              <input type="email" value={formData.personalInfo.email} onChange={(e) => updatePersonalField("email", e.target.value)} />
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>
            <div className="field-group">
              <label>Phone</label>
              <input type="tel" value={formData.personalInfo.phone} onChange={(e) => updatePersonalField("phone", e.target.value)} />
            </div>
            <div className="field-group">
              <label>Location</label>
              <input type="text" value={formData.personalInfo.location} onChange={(e) => updatePersonalField("location", e.target.value)} />
            </div>
            <div className="field-group">
              <label>LinkedIn</label>
              <input type="url" value={formData.personalInfo.linkedin} onChange={(e) => updatePersonalField("linkedin", e.target.value)} />
            </div>
            <div className="field-group full-width">
              <label>GitHub / Portfolio</label>
              <input type="url" value={formData.personalInfo.portfolio} onChange={(e) => updatePersonalField("portfolio", e.target.value)} />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Professional Summary</h3>
          <textarea rows="5" value={formData.summary} onChange={(e) => setFormData((prev) => ({ ...prev, summary: e.target.value }))} />
        </div>

        <div className="form-section">
          <h3>Skills</h3>
          <div className="list-block">
            {formData.skills.map((skill, index) => (
              <div key={`skill-${index}`} className="list-row skill-row">
                <input type="text" value={skill} placeholder="e.g. Java, React, SQL" onChange={(e) => updateSkills(index, e.target.value)} />
                {formData.skills.length > 1 && (
                  <button type="button" className="mini-btn danger" onClick={() => setFormData((prev) => ({ ...prev, skills: prev.skills.filter((_, idx) => idx !== index) || [""] }))}>Remove</button>
                )}
              </div>
            ))}
          </div>
          <button type="button" className="secondary-btn" onClick={() => setFormData((prev) => ({ ...prev, skills: [...prev.skills, ""] }))}>Add Skill</button>
        </div>

        <div className="form-section">
          <h3>Education</h3>
          {formData.education.map((entry, index) => (
            <div key={`education-${index}`} className="entry-card">
              <div className="entry-header">
                <span>Education #{index + 1}</span>
                {formData.education.length > 1 && <button type="button" className="mini-btn danger" onClick={() => removeArrayItem("education", index)}>Remove</button>}
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
          <button type="button" className="secondary-btn" onClick={() => addArrayItem("education", emptyEducation)}>Add Education</button>
        </div>

        <div className="form-section">
          <h3>Work Experience</h3>
          {formData.experience.map((entry, index) => (
            <div key={`experience-${index}`} className="entry-card">
              <div className="entry-header">
                <span>Experience #{index + 1}</span>
                {formData.experience.length > 1 && <button type="button" className="mini-btn danger" onClick={() => removeArrayItem("experience", index)}>Remove</button>}
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
          <button type="button" className="secondary-btn" onClick={() => addArrayItem("experience", emptyExperience)}>Add Experience</button>
        </div>

        <div className="form-section">
          <h3>Projects</h3>
          {formData.projects.map((entry, index) => (
            <div key={`project-${index}`} className="entry-card">
              <div className="entry-header">
                <span>Project #{index + 1}</span>
                {formData.projects.length > 1 && <button type="button" className="mini-btn danger" onClick={() => removeArrayItem("projects", index)}>Remove</button>}
              </div>
              <div className="field-grid two-col">
                <div className="field-group"><label>Project name</label><input type="text" value={entry.name} onChange={(e) => updateArrayItem("projects", index, "name", e.target.value)} /></div>
                <div className="field-group"><label>Project link</label><input type="url" value={entry.link} onChange={(e) => updateArrayItem("projects", index, "link", e.target.value)} /></div>
                <div className="field-group full-width"><label>Description</label><textarea rows="4" value={entry.description} onChange={(e) => updateArrayItem("projects", index, "description", e.target.value)} /></div>
                <div className="field-group full-width"><label>Technologies</label><input type="text" value={entry.technologies} placeholder="React, Node.js, PostgreSQL" onChange={(e) => updateArrayItem("projects", index, "technologies", e.target.value)} /></div>
              </div>
            </div>
          ))}
          <button type="button" className="secondary-btn" onClick={() => addArrayItem("projects", emptyProject)}>Add Project</button>
        </div>

        <div className="form-section">
          <h3>Certifications</h3>
          {formData.certifications.map((entry, index) => (
            <div key={`cert-${index}`} className="entry-card">
              <div className="entry-header">
                <span>Certification #{index + 1}</span>
                {formData.certifications.length > 1 && <button type="button" className="mini-btn danger" onClick={() => removeArrayItem("certifications", index)}>Remove</button>}
              </div>
              <div className="field-grid two-col">
                <div className="field-group"><label>Name</label><input type="text" value={entry.name} onChange={(e) => updateArrayItem("certifications", index, "name", e.target.value)} /></div>
                <div className="field-group"><label>Issuer</label><input type="text" value={entry.issuer} onChange={(e) => updateArrayItem("certifications", index, "issuer", e.target.value)} /></div>
                <div className="field-group full-width"><label>Date</label><input type="text" value={entry.date} onChange={(e) => updateArrayItem("certifications", index, "date", e.target.value)} /></div>
              </div>
            </div>
          ))}
          <button type="button" className="secondary-btn" onClick={() => addArrayItem("certifications", emptyCertification)}>Add Certification</button>
        </div>

        <div className="resume-form-actions">
          <button type="button" className="secondary-btn" onClick={handleSave}>Save Draft</button>
          <button type="button" className="primary-btn" onClick={handleContinue}>Continue</button>
        </div>

        {saveMessage && <p className="save-status">{saveMessage}</p>}
      </form>
    </div>
  );

  const renderPreview = () => (
    <div className="resume-preview-shell">
      <div className="resume-preview-toolbar">
        <button type="button" className="secondary-btn" onClick={() => setShowPreview(false)}>Edit Resume</button>
        <button type="button" className="primary-btn" onClick={handleDownloadWord} disabled={isExporting}>
          {isExporting ? "Generating Word..." : "Download as Word"}
        </button>
      </div>

      {exportError && <p className="resume-export-state resume-export-error">{exportError}</p>}
      {isExporting && <p className="resume-export-state resume-export-loading">Preparing your DOCX file…</p>}

      <div className="resume-preview-stage">
        <div className="resume-preview-document">
          <TemplatePreview templateId={selectedTemplate} resumeData={formData} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="page-wrapper resume-builder-page">
      <div className="page-back-bar">
        <button type="button" className="back-btn-inline" onClick={() => navigate("/")}>← Back to Home</button>
      </div>
      {showPreview ? renderPreview() : renderForm()}
    </div>
  );
}
