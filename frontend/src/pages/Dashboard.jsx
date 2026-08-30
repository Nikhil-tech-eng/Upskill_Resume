import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch, deleteResume } from "../api";
import { useAuth } from "../context/AuthContext";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Resume Deletion Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [resumeToDelete, setResumeToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiFetch("/api/dashboard");
      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      } else {
        setError("Failed to load your career dashboard data.");
      }
    } catch (err) {
      console.error(err);
      setError("Network error fetching dashboard details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        const response = await apiFetch("/api/dashboard");
        if (response.ok) {
          const data = await response.json();
          if (isMounted) setDashboardData(data);
        } else {
          if (isMounted) setError("Failed to load your career dashboard data.");
        }
      } catch (err) {
        console.error(err);
        if (isMounted) setError("Network error fetching dashboard details.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

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
        await fetchDashboard();
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

  const latestAnalysis = dashboardData?.latestAnalysis;
  const totalResumes = dashboardData?.totalResumes || 0;

  // Helper to parse comma-separated skills into clean arrays
  const parseSkillsList = (skillsStr) => {
    if (!skillsStr) return [];
    return skillsStr
      .split(/,|\n/)
      .map((s) => s.trim().replace(/^[-•*]\s*/, ""))
      .filter((s) => s.length > 0);
  };

  const identifiedSkills = parseSkillsList(latestAnalysis?.skills);
  const missingSkills = parseSkillsList(latestAnalysis?.missingSkills);

  return (
    <div className="user-dashboard-page">
      {/* HEADER SECTION */}
      <div className="dashboard-header">
        <div className="hero-badge">AI Career Workspace</div>
        <h1>
          Welcome back, <span>{dashboardData?.userName || user?.email || "Candidate"}</span>
        </h1>
        <p>
          Your central AI hub for resume optimization, job fit analysis, and personalized career growth.
        </p>
      </div>

      <div className="dashboard-container">
        {/* LOADING STATE */}
        {loading && (
          <div className="dashboard-loading-card">
            <div className="ats-spinner" style={{ borderColor: "rgba(99, 102, 241, 0.3)", borderTopColor: "#6366f1" }}></div>
            <p>Loading your career profile...</p>
          </div>
        )}

        {/* ERROR STATE */}
        {!loading && error && (
          <div className="dashboard-error-card">
            <div className="error-icon">⚠️</div>
            <h3>Unable to Load Dashboard</h3>
            <p>{error}</p>
            <button
              type="button"
              className="primary-btn"
              onClick={() => window.location.reload()}
            >
              Retry Loading
            </button>
          </div>
        )}

        {/* DASHBOARD CONTENT */}
        {!loading && !error && (
          <>
            {/* OVERVIEW STAT CARDS */}
            <div className="dashboard-stats-grid">
              <div className="dashboard-stat-card">
                <div className="stat-icon">📄</div>
                <div className="stat-info">
                  <span className="stat-label">Uploaded Resumes</span>
                  <h3 className="stat-value">{totalResumes}</h3>
                </div>
              </div>

              <div className="dashboard-stat-card">
                <div className="stat-icon">📊</div>
                <div className="stat-info">
                  <span className="stat-label">Latest ATS Score</span>
                  <h3 className="stat-value" style={{ color: latestAnalysis?.atsScore >= 75 ? "#34d399" : latestAnalysis?.atsScore ? "#f59e0b" : "#94a3b8" }}>
                    {latestAnalysis?.atsScore ? `${latestAnalysis.atsScore}/100` : "N/A"}
                  </h3>
                </div>
              </div>

              <div className="dashboard-stat-card">
                <div className="stat-icon">🎯</div>
                <div className="stat-info">
                  <span className="stat-label">Skills Identified</span>
                  <h3 className="stat-value">{identifiedSkills.length}</h3>
                </div>
              </div>

              <div className="dashboard-stat-card">
                <div className="stat-icon">⚡</div>
                <div className="stat-info">
                  <span className="stat-label">Skill Gaps</span>
                  <h3 className="stat-value">{missingSkills.length}</h3>
                </div>
              </div>
            </div>

            {/* LATEST ATS ANALYSIS WORKSPACE */}
            <div className="dashboard-section-card">
              <div className="section-card-header">
                <h2>Latest ATS Resume Insights</h2>
                {latestAnalysis && (
                  <span className="active-resume-tag">
                    📄 {latestAnalysis.resumeFileName || "Active Resume"}
                  </span>
                )}
              </div>

              {latestAnalysis ? (
                <div className="dashboard-analysis-content">
                  {/* ATS Score & Summary Banner */}
                  <div className="dashboard-score-banner">
                    <div className="score-ring-box">
                      <div className="score-number">{latestAnalysis.atsScore}</div>
                      <div className="score-total">/ 100</div>
                    </div>
                    <div className="score-summary-box">
                      <h3>Executive Summary</h3>
                      <p>{latestAnalysis.summary || "Resume analysis summary generated by AI."}</p>
                    </div>
                  </div>

                  {/* Skills & Missing Skills Grid */}
                  <div className="dashboard-skills-dual-grid">
                    {/* Identified Skills */}
                    <div className="skills-box identified-box">
                      <h4>
                        <span>✅</span> Key Skills Detected ({identifiedSkills.length})
                      </h4>
                      <div className="skills-pill-container">
                        {identifiedSkills.length > 0 ? (
                          identifiedSkills.map((sk, idx) => (
                            <span key={idx} className="skill-pill identified-pill">
                              {sk}
                            </span>
                          ))
                        ) : (
                          <span className="empty-text">No skills identified yet.</span>
                        )}
                      </div>
                    </div>

                    {/* Missing Skills */}
                    <div className="skills-box missing-box">
                      <h4>
                        <span>⚡</span> Recommended Skill Upgrades ({missingSkills.length})
                      </h4>
                      <div className="skills-pill-container">
                        {missingSkills.length > 0 ? (
                          missingSkills.map((sk, idx) => (
                            <span key={idx} className="skill-pill missing-pill">
                              {sk}
                            </span>
                          ))
                        ) : (
                          <span className="empty-text">No missing skills flagged. Great job!</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Improvement Suggestions */}
                  {latestAnalysis.suggestions && (
                    <div className="suggestions-box">
                      <h4>💡 AI Suggestions for Improvement</h4>
                      <div className="suggestions-text">{latestAnalysis.suggestions}</div>
                    </div>
                  )}
                </div>
              ) : totalResumes > 0 ? (
                /* Resume Uploaded but no Analysis */
                <div className="dashboard-empty-state">
                  <div className="empty-state-icon">📊</div>
                  <h3>Resume Uploaded — Analysis Pending</h3>
                  <p>
                    You have uploaded a resume profile, but haven't run an AI ATS analysis on it yet.
                  </p>
                  <button
                    type="button"
                    className="primary-btn"
                    onClick={() => navigate("/resume-analysis")}
                  >
                    Run ATS Analysis Now →
                  </button>
                </div>
              ) : (
                /* No Resume Uploaded */
                <div className="dashboard-empty-state">
                  <div className="empty-state-icon">📄</div>
                  <h3>No Resume Uploaded Yet</h3>
                  <p>
                    Upload your resume to discover your ATS score, extracted skills, career gaps, and AI recommendations.
                  </p>
                  <button
                    type="button"
                    className="primary-btn"
                    onClick={() => navigate("/resume-analysis")}
                  >
                    Upload Your Resume →
                  </button>
                </div>
              )}
            </div>

            {/* QUICK ACTIONS GRID */}
            <div className="dashboard-actions-section">
              <h2>Quick Actions</h2>
              <div className="dashboard-actions-grid">
                <div
                  className="dashboard-action-card interactive-card"
                  onClick={() => navigate("/resume-analysis")}
                  role="button"
                  tabIndex={0}
                >
                  <div className="action-card-icon">📊</div>
                  <h3>ATS Resume Analysis</h3>
                  <p>Check ATS compatibility score, extract key skills, and receive AI improvements.</p>
                  <span className="action-link">Open Tool →</span>
                </div>

                <div
                  className="dashboard-action-card interactive-card"
                  onClick={() => navigate("/job-matching")}
                  role="button"
                  tabIndex={0}
                >
                  <div className="action-card-icon">🎯</div>
                  <h3>Job Fit Matching</h3>
                  <p>Match your resume against target job descriptions and analyze keyword alignment.</p>
                  <span className="action-link">Open Tool →</span>
                </div>

                <div
                  className="dashboard-action-card interactive-card"
                  onClick={() => navigate("/interview-preparation")}
                  role="button"
                  tabIndex={0}
                >
                  <div className="action-card-icon">💬</div>
                  <h3>Interview Preparation</h3>
                  <p>Generate 10 tailored technical, project, and behavioral interview questions.</p>
                  <span className="action-link">Open Tool →</span>
                </div>

                <div
                  className="dashboard-action-card interactive-card"
                  onClick={() => navigate("/learning-resources")}
                  role="button"
                  tabIndex={0}
                >
                  <div className="action-card-icon">📚</div>
                  <h3>Learning Resources</h3>
                  <p>Discover tutorials and courses to close skill gaps and build missing skills.</p>
                  <span className="action-link">Open Tool →</span>
                </div>
              </div>
            </div>

            {/* UPLOADED RESUMES LIST */}
            {dashboardData?.resumes && dashboardData.resumes.length > 0 && (
              <div className="dashboard-section-card">
                <div className="section-card-header">
                  <h2>Your Uploaded Resumes</h2>
                  <button
                    type="button"
                    className="secondary-btn-sm"
                    onClick={() => navigate("/resume-analysis")}
                  >
                    + Upload New Resume
                  </button>
                </div>

                <div className="resumes-list">
                  {dashboardData.resumes.map((res, idx) => (
                    <div key={idx} className="resume-list-item">
                      <div className="resume-item-main">
                        <span className="resume-doc-icon">📄</span>
                        <span className="resume-item-filename">{res.fileName}</span>
                      </div>
                      <div className="resume-item-actions" style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <div className="resume-item-badge">
                          {res.hasAnalysis ? (
                            <span className="badge-analyzed">Analyzed</span>
                          ) : (
                            <span className="badge-pending">Pending Analysis</span>
                          )}
                        </div>
                        <button
                          type="button"
                          className="resume-delete-btn"
                          onClick={() => openDeleteModal(res)}
                          title="Delete resume"
                          style={{
                            background: "rgba(239, 68, 68, 0.1)",
                            border: "1px solid rgba(239, 68, 68, 0.25)",
                            color: "#ef4444",
                            borderRadius: "6px",
                            padding: "0.3rem 0.6rem",
                            fontSize: "0.85rem",
                            cursor: "pointer",
                            transition: "all 0.2s ease"
                          }}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  ))}
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