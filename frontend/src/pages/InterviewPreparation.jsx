import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch, deleteResume } from "../api";
import { useAuth } from "../context/AuthContext";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";

function InterviewPreparation({ onNavigate }) {
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

  const [questions, setQuestions] = useState([]);
  const [rawText, setRawText] = useState("");
  const [loading, setLoading] = useState(false);
  const [generateError, setGenerateError] = useState(null);

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
        setQuestions([]);
        setRawText("");
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

  const parseQuestions = (text) => {
    if (!text) return [];

    const cleanedData = text
      .replace(/\\`/g, "`")
      .replace(/\\\./g, ".")
      .replace(/\*\*/g, "")
      .trim();

    const lines = cleanedData.split(/\n+/).map((l) => l.trim()).filter(Boolean);
    const parsed = [];
    let currentQuestion = "";

    for (const line of lines) {
      const match =
        line.match(/^(\d+)[.)]\s*(.+)/i) ||
        line.match(/^Question\s*(\d+)[:.]\s*(.+)/i) ||
        line.match(/^Q(\d+)[:.]\s*(.+)/i);

      if (match) {
        if (currentQuestion) {
          parsed.push(currentQuestion.trim());
        }
        currentQuestion = match[2];
      } else if (currentQuestion) {
        currentQuestion += " " + line;
      } else {
        currentQuestion = line;
      }
    }

    if (currentQuestion) {
      parsed.push(currentQuestion.trim());
    }

    // Fallback if regex parsing produced fewer items than expected
    if (parsed.length === 0 && lines.length > 0) {
      return lines;
    }

    return parsed;
  };

  const handleGenerate = async (e) => {
    if (e) e.preventDefault();

    if (!selectedResumeId) {
      alert("Please select or upload a resume first.");
      return;
    }

    setLoading(true);
    setGenerateError(null);
    setQuestions([]);
    setRawText("");

    try {
      const response = await apiFetch(`/api/interview/generate/${selectedResumeId}`, {
        method: "POST",
      });

      const data = await response.text();

      if (response.ok) {
        setRawText(data);
        const parsedList = parseQuestions(data);
        setQuestions(parsedList);
      } else {
        setGenerateError(data || "Failed to generate interview questions. Please try again.");
      }
    } catch (error) {
      console.error("Error generating questions:", error);
      setGenerateError("Something went wrong while communicating with the interview service.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setQuestions([]);
    setRawText("");
    setGenerateError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const activeResume =
    resumes.find((r) => String(r.id) === String(selectedResumeId)) ||
    resumes[resumes.length - 1];

  return (
    <div className="interview-page">
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
      <div className="interview-header">
        <div className="hero-badge">AI-Powered Interview Preparation</div>
        <h1>Tailored Interview Questions</h1>
        <p>
          Generate customized technical, project-based, and behavioral interview questions targeted directly to your resume experience.
        </p>
      </div>

      <div className="interview-container">
        {/* CASE 1: NOT LOGGED IN */}
        {!isLoggedIn ? (
          <div className="interview-card auth-required-card">
            <div className="auth-required-icon">🔒</div>
            <h2>Account Required</h2>
            <p>
              Please log in to your Upskill_Resume account to generate personalized interview questions from your uploaded resume.
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
          <div className="interview-card loading-card">
            <div
              className="ats-spinner"
              style={{
                borderColor: "rgba(79, 70, 229, 0.3)",
                borderTopColor: "#4f46e5",
              }}
            ></div>
            <p>Loading your resume profile...</p>
          </div>
        ) : resumes.length === 0 ? (
          /* CASE 3: NO RESUMES FOUND */
          <div className="interview-card no-resume-card">
            <div className="no-resume-icon">📄</div>
            <h2>No Resume Found</h2>
            <p>
              You haven't uploaded a resume yet. Upload your resume to unlock AI interview question generation, skill assessments, and career guidance.
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
          /* CASE 4: READY TO GENERATE / DISPLAY QUESTIONS */
          <>
            {/* ACTIVE RESUME BANNER */}
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

            {generateError && (
              <div className="job-match-warning" style={{ background: "#fef2f2", borderColor: "#fecaca", color: "#b91c1c" }}>
                {generateError}
              </div>
            )}

            {/* GENERATE PROMPT STATE */}
            {!loading && questions.length === 0 && !rawText && (
              <div className="interview-card interview-intro-card">
                <div className="intro-card-icon">🎯</div>
                <h2>Prepare for Your Next Interview</h2>
                <p>
                  Our AI analyzes your experience, technologies, and projects in <strong>{activeResume?.fileName || "your resume"}</strong> to formulate 10 realistic interview questions spanning technical depths and behavioral scenarios.
                </p>

                <div className="interview-topic-grid">
                  <div className="topic-pill">💻 Technical Deep Dives</div>
                  <div className="topic-pill">🏗️ Project Architecture</div>
                  <div className="topic-pill">⚡ Frameworks & APIs</div>
                  <div className="topic-pill">🤝 Behavioral & Teamwork</div>
                </div>

                <button
                  type="button"
                  className="interview-generate-btn"
                  onClick={handleGenerate}
                >
                  Generate 10 Interview Questions →
                </button>
              </div>
            )}

            {/* LOADING STATE */}
            {loading && (
              <div className="interview-card loading-card">
                <div
                  className="ats-spinner"
                  style={{
                    borderColor: "rgba(79, 70, 229, 0.3)",
                    borderTopColor: "#4f46e5",
                    width: "28px",
                    height: "28px",
                  }}
                ></div>
                <h3 style={{ margin: "16px 0 6px", fontSize: "18px", color: "#1e293b" }}>
                  Generating AI Interview Questions...
                </h3>
                <p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>
                  Analyzing {activeResume?.fileName || "your resume"} and formulating targeted technical & behavioral questions.
                </p>
              </div>
            )}

            {/* RESULTS STATE */}
            {!loading && (questions.length > 0 || rawText) && (
              <div className="interview-results-dashboard">
                <div className="results-header">
                  <div>
                    <span className="results-badge">INTERVIEW QUESTION SET</span>
                    <h2>10 Tailored Questions</h2>
                    <p>
                      Formulated from <strong>{activeResume?.fileName || "your active resume"}</strong>
                    </p>
                  </div>

                  <button
                    type="button"
                    className="ats-new-analysis-btn"
                    onClick={handleReset}
                  >
                    Regenerate Questions
                  </button>
                </div>

                {/* 10 QUESTION CARDS */}
                {questions.length > 0 ? (
                  <div className="interview-questions-list">
                    {questions.map((q, idx) => (
                      <div key={idx} className="interview-question-card">
                        <div className="question-header">
                          <span className="question-number-badge">
                            {String(idx + 1).padStart(2, "0")}
                          </span>
                          <span className="question-type-tag">
                            {idx < 3
                              ? "Technical & Core"
                              : idx < 6
                              ? "Architecture & Framework"
                              : idx < 8
                              ? "Project Deep Dive"
                              : "Behavioral & Situational"}
                          </span>
                        </div>
                        <p className="question-text">{q}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="interview-card">
                    <pre className="raw-questions-fallback">{rawText}</pre>
                  </div>
                )}
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

export default InterviewPreparation;