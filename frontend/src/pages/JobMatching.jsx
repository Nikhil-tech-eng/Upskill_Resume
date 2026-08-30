import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch, deleteResume } from "../api";
import { useAuth } from "../context/AuthContext";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";

function JobMatching({ onNavigate }) {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const handleNav = (pageKey) => {
    if (onNavigate) onNavigate(pageKey);
    const routes = {
      home: "/",
      login: "/login",
      register: "/register",
      "resume-analysis": "/resume-analysis",
    };
    navigate(routes[pageKey] || "/");
  };

  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [loadingResumes, setLoadingResumes] = useState(isLoggedIn);
  const [resumeFetchError, setResumeFetchError] = useState(null);

  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Resume Deletion State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [resumeToDelete, setResumeToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchResumesList = async () => {
    try {
      const response = await apiFetch("/api/resumes/my");
      if (response.ok) {
        const data = await response.json();
        const resumeList = Array.isArray(data) ? data : [];
        setResumes(resumeList);
        if (resumeList.length > 0) {
          setSelectedResumeId(resumeList[resumeList.length - 1].id);
        } else {
          setSelectedResumeId("");
        }
      } else {
        setResumeFetchError("Unable to load your resumes. Please try again.");
      }
    } catch (err) {
      console.error("Error fetching resumes:", err);
      setResumeFetchError("Failed to connect to resume service.");
    } finally {
      setLoadingResumes(false);
    }
  };

  useEffect(() => {
    if (!isLoggedIn) return;

    let isMounted = true;
    const loadResumes = async () => {
      try {
        const response = await apiFetch("/api/resumes/my");
        if (response.ok) {
          const data = await response.json();
          const resumeList = Array.isArray(data) ? data : [];
          if (isMounted) {
            setResumes(resumeList);
            if (resumeList.length > 0) {
              setSelectedResumeId(resumeList[resumeList.length - 1].id);
            } else {
              setSelectedResumeId("");
            }
          }
        } else if (isMounted) {
          setResumeFetchError("Unable to load your resumes. Please try again.");
        }
      } catch (err) {
        console.error("Error fetching resumes:", err);
        if (isMounted) {
          setResumeFetchError("Failed to connect to resume service.");
        }
      } finally {
        if (isMounted) {
          setLoadingResumes(false);
        }
      }
    };

    loadResumes();

    return () => {
      isMounted = false;
    };
  }, [isLoggedIn]);

  const openDeleteModal = (resume) => {
    setResumeToDelete(resume);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    if (isDeleting) return;
    setDeleteModalOpen(false);
    setResumeToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!resumeToDelete) return;
    try {
      setIsDeleting(true);
      const res = await deleteResume(resumeToDelete.id);
      if (res.ok) {
        closeDeleteModal();
        setResult(null); // Clear stale result matching deleted resume
        await fetchResumesList();
      } else {
        alert("Failed to delete resume. Please try again.");
      }
    } catch (err) {
      console.error("Error deleting resume:", err);
      alert("An error occurred while deleting the resume.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleMatch = async (e) => {
    e.preventDefault();

    if (!selectedResumeId) {
      alert("Please select or upload a resume first.");
      return;
    }

    if (!jobTitle.trim() || !jobDescription.trim()) {
      alert("Please provide both a Job Title and Job Description.");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      // Step 1: Create Job Description record
      const jobResponse = await apiFetch("/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: jobTitle.trim(),
          description: jobDescription.trim(),
        }),
      });

      if (!jobResponse.ok) {
        alert("Failed to process job description. Please check the text and try again.");
        setLoading(false);
        return;
      }

      const job = await jobResponse.json();

      // Step 2: Request AI match between user's resume and job invisibly
      const matchResponse = await apiFetch(`/api/matches/${selectedResumeId}/${job.id}`, {
        method: "POST",
      });

      const data = await matchResponse.json();

      if (matchResponse.ok) {
        setResult(data);
      } else {
        alert("Job matching analysis failed. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong during job matching.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setJobTitle("");
    setJobDescription("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const activeResume = resumes.find((r) => String(r.id) === String(selectedResumeId)) || resumes[resumes.length - 1];

  return (
    <div className="job-match-page">
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

      {/* HEADER */}
      <div className="job-match-header">
        <div className="hero-badge">AI-Powered Job Fit Analysis</div>
        <h1>Match Resume with Job Role</h1>
        <p>
          Compare your resume against any target job description to discover match compatibility, keyword alignments, and actionable recommendations.
        </p>
      </div>

      <div className="job-match-container">
        {/* CASE 1: NOT LOGGED IN */}
        {!isLoggedIn ? (
          <div className="job-match-card auth-required-card">
            <div className="auth-required-icon">🔒</div>
            <h2>Account Required</h2>
            <p>
              Please log in to your Upskill_Resume account to match your saved resume with job descriptions.
            </p>
            <div className="auth-required-actions">
              <button
                type="button"
                className="primary-btn"
                onClick={() => handleNav("login")}
              >
                Login to Continue →
              </button>
              <button
                type="button"
                className="secondary-btn"
                onClick={() => handleNav("register")}
              >
                Create Free Account
              </button>
            </div>
          </div>
        ) : loadingResumes ? (
          /* CASE 2: LOADING RESUMES */
          <div className="job-match-card loading-card">
            <div className="ats-spinner" style={{ borderColor: "rgba(79, 70, 229, 0.3)", borderTopColor: "#4f46e5" }}></div>
            <p>Loading your resume profile...</p>
          </div>
        ) : resumes.length === 0 ? (
          /* CASE 3: NO RESUME UPLOADED YET */
          <div className="job-match-card no-resume-card">
            <div className="no-resume-icon">📄</div>
            <h2>No Resume Found</h2>
            <p>
              You haven't uploaded a resume yet. Upload your resume to unlock AI job matching, ATS scoring, and personalized career insights.
            </p>
            <button
              type="button"
              className="primary-btn upload-resume-cta"
              onClick={() => handleNav("resume-analysis")}
            >
              Upload Your Resume First →
            </button>
          </div>
        ) : (
          /* CASE 4: READY TO MATCH */
          <>
            {/* ACTIVE RESUME SELECTOR BANNER (NO IDs EXPOSED) */}
            <div className="active-resume-banner">
              <div className="resume-banner-info">
                <span className="resume-icon">📄</span>
                <div>
                  <span className="resume-banner-label">TARGET CANDIDATE RESUME</span>
                  <h3 className="resume-filename">
                    {activeResume ? activeResume.fileName || "Your uploaded resume" : "Your uploaded resume"}
                  </h3>
                </div>
              </div>

              {resumes.length > 1 ? (
                <div className="resume-selector-wrapper" style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <div>
                    <label htmlFor="resume-select">Switch Resume:</label>
                    <select
                      id="resume-select"
                      className="resume-select-dropdown"
                      value={selectedResumeId}
                      onChange={(e) => setSelectedResumeId(e.target.value)}
                    >
                      {resumes.map((resume, idx) => (
                        <option key={resume.id} value={resume.id}>
                          {resume.fileName || `Resume version ${idx + 1}`}
                        </option>
                      ))}
                    </select>
                  </div>
                  {activeResume && (
                    <button
                      type="button"
                      className="resume-delete-btn"
                      onClick={() => openDeleteModal(activeResume)}
                      title="Delete selected resume"
                      style={{
                        background: "rgba(239, 68, 68, 0.1)",
                        border: "1px solid rgba(239, 68, 68, 0.25)",
                        color: "#ef4444",
                        borderRadius: "6px",
                        padding: "0.35rem 0.7rem",
                        fontSize: "0.85rem",
                        cursor: "pointer"
                      }}
                    >
                      🗑️ Delete
                    </button>
                  )}
                </div>
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  {activeResume && (
                    <button
                      type="button"
                      className="resume-delete-btn"
                      onClick={() => openDeleteModal(activeResume)}
                      title="Delete resume"
                      style={{
                        background: "rgba(239, 68, 68, 0.1)",
                        border: "1px solid rgba(239, 68, 68, 0.25)",
                        color: "#ef4444",
                        borderRadius: "6px",
                        padding: "0.35rem 0.7rem",
                        fontSize: "0.85rem",
                        cursor: "pointer"
                      }}
                    >
                      🗑️ Delete
                    </button>
                  )}
                  <button
                    type="button"
                    className="switch-resume-link"
                    onClick={() => handleNav("resume-analysis")}
                  >
                    Upload New Resume →
                  </button>
                </div>
              )}
            </div>

            {resumeFetchError && (
              <div className="job-match-warning">{resumeFetchError}</div>
            )}

            {/* FORM */}
            {!result ? (
              <div className="job-match-card">
                <form onSubmit={handleMatch} className="job-match-form">
                  <div className="form-group">
                    <label htmlFor="job-title-input">
                      Target Job Title <span className="required-star">*</span>
                    </label>
                    <input
                      id="job-title-input"
                      type="text"
                      placeholder="e.g. Senior Java Full-Stack Engineer"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="job-desc-input">
                      Job Description & Requirements <span className="required-star">*</span>
                    </label>
                    <textarea
                      id="job-desc-input"
                      placeholder="Paste the job description, required technical skills, qualifications, and expectations from the job posting..."
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      rows={9}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className={`job-match-submit-btn ${loading ? "btn-loading" : ""}`}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="ats-spinner"></span>
                        Analyzing Job Fit with AI...
                      </>
                    ) : (
                      "Match Resume with Job Posting →"
                    )}
                  </button>
                </form>
              </div>
            ) : (
              /* RESULTS DASHBOARD */
              <div className="job-match-results-dashboard">
                <div className="results-header">
                  <div>
                    <span className="results-badge">MATCH REPORT</span>
                    <h2>Fit Analysis: {jobTitle}</h2>
                    <p>
                      Evaluated against <strong>{activeResume?.fileName || "your active resume"}</strong>
                    </p>
                  </div>
                  <button
                    type="button"
                    className="ats-new-analysis-btn"
                    onClick={handleReset}
                  >
                    Match Another Job Role
                  </button>
                </div>

                {/* SCORE CARD */}
                <div className="job-match-score-grid">
                  <div className="match-score-card">
                    <div
                      className="ats-score-circle"
                      style={{
                        "--score": result.matchScore ?? 0,
                      }}
                    >
                      <div className="ats-score-inner">
                        <span>{result.matchScore ?? "N/A"}%</span>
                        <small>Match Score</small>
                      </div>
                    </div>
                    <h3>Overall Compatibility</h3>
                    <p>
                      {result.matchScore >= 80
                        ? "Strong Match - High probability of passing recruiter screening"
                        : result.matchScore >= 60
                        ? "Moderate Fit - Good alignment with key areas to strengthen"
                        : "Low Alignment - Significant skill or experience gaps detected"}
                    </p>
                  </div>

                  <div className="match-overview-card">
                    <div className="ats-card-heading">
                      <span>KEY TAKEAWAY</span>
                    </div>
                    <h3>Strategic Role Alignment</h3>
                    <p>
                      Your resume has been benchmarked directly against the provided role description. Review the matching skills and missing qualifications below to tailor your application before applying.
                    </p>
                  </div>
                </div>

                {/* MATCHING SKILLS */}
                <div className="ats-analysis-card match-card-matched">
                  <div className="ats-card-title">
                    <div>
                      <span className="ats-section-label" style={{ color: "#16a34a" }}>
                        ALIGNMENT
                      </span>
                      <h3>Matching Skills & Strengths</h3>
                    </div>
                  </div>
                  <div className="ats-skill-list">
                    {result.matchedSkills ? (
                      result.matchedSkills
                        .split(",")
                        .filter((s) => s.trim())
                        .map((skill, index) => (
                          <span key={index} className="ats-skill-tag">
                            ✓ {skill.trim()}
                          </span>
                        ))
                    ) : (
                      <p className="no-data-text">No direct skill matches detected.</p>
                    )}
                  </div>
                </div>

                {/* MISSING SKILLS */}
                <div className="ats-analysis-card match-card-missing">
                  <div className="ats-card-title">
                    <div>
                      <span className="ats-section-label" style={{ color: "#dc2626" }}>
                        SKILL GAPS
                      </span>
                      <h3>Missing or Desired Qualifications</h3>
                    </div>
                  </div>
                  <div className="ats-skill-list">
                    {result.missingSkills ? (
                      result.missingSkills
                        .split(",")
                        .filter((s) => s.trim())
                        .map((skill, index) => (
                          <span key={index} className="ats-missing-skill-tag">
                            ! {skill.trim()}
                          </span>
                        ))
                    ) : (
                      <p className="no-data-text">No significant skill gaps identified.</p>
                    )}
                  </div>
                </div>

                {/* RECOMMENDATIONS */}
                <div className="ats-analysis-card">
                  <div className="ats-card-title">
                    <div>
                      <span className="ats-section-label">OPTIMIZATION</span>
                      <h3>Tailoring Recommendations</h3>
                    </div>
                  </div>
                  <div className="match-recommendations-box">
                    <p>{result.recommendations || "No specific recommendations generated."}</p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* CONFIRM DELETE MODAL */}
      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        fileName={resumeToDelete?.fileName}
        onConfirm={handleConfirmDelete}
        onCancel={closeDeleteModal}
        isDeleting={isDeleting}
      />
    </div>
  );
}

export default JobMatching;