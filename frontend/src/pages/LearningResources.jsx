import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api";

const POPULAR_SKILLS = [
  "Java", "Spring Boot", "React", "Python", "SQL",
  "Docker", "Kubernetes", "AWS", "System Design", "TypeScript",
];

function LearningResources({ onNavigate }) {
  const navigate = useNavigate();

  const handleNav = (pageKey) => {
    if (onNavigate) onNavigate(pageKey);
    const routes = {
      home: "/",
      "resume-analysis": "/resume-analysis",
    };
    navigate(routes[pageKey] || "/");
  };

  const [skill, setSkill] = useState("");
  const [resources, setResources] = useState([]);
  const [allResources, setAllResources] = useState([]);
  const [userMissingSkills, setUserMissingSkills] = useState([]);
  const [hasAnalysis, setHasAnalysis] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeSkillFilter, setActiveSkillFilter] = useState("");

  // Helper to parse skill list
  const parseSkills = (skillsStr) => {
    if (!skillsStr) return [];
    return skillsStr
      .split(/,|\n/)
      .map((s) => s.trim().replace(/^[-•*]\s*/, ""))
      .filter((s) => s.length > 0);
  };

  // Initial Load: Fetch candidate's dashboard & initial resource list
  useEffect(() => {
    let isMounted = true;

    const loadInitialData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch dashboard for user's missing skills
        const dashRes = await apiFetch("/api/dashboard");
        if (dashRes.ok) {
          const dashData = await dashRes.json();
          if (isMounted && dashData.latestAnalysis) {
            setHasAnalysis(true);
            const missing = parseSkills(dashData.latestAnalysis.missingSkills);
            setUserMissingSkills(missing);
          }
        }

        // Fetch all resources by default
        const resRes = await apiFetch("/api/resources");
        if (resRes.ok) {
          const resData = await resRes.json();
          if (isMounted) {
            const list = Array.isArray(resData) ? resData : [];
            setAllResources(list);
            setResources(list);
          }
        }
      } catch (err) {
        console.error("Error initializing learning resources:", err);
        if (isMounted) {
          setError("Failed to load learning resources. Please try refreshing.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadInitialData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Search resources by skill
  const handleSearch = async (e, skillOverride) => {
    if (e) e.preventDefault();

    const targetSkill = (skillOverride !== undefined ? skillOverride : skill).trim();

    if (!targetSkill) {
      // If empty, revert to all resources
      setResources(allResources);
      setActiveSkillFilter("");
      return;
    }

    setSearchLoading(true);
    setError(null);
    setActiveSkillFilter(targetSkill);

    try {
      const response = await apiFetch(`/api/resources/skill/${encodeURIComponent(targetSkill)}`);
      if (response.ok) {
        const data = await response.json();
        setResources(Array.isArray(data) ? data : []);
      } else {
        setResources([]);
      }
    } catch (err) {
      console.error("Error searching resources:", err);
      setError("Failed to connect to the resource service.");
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSkillSelect = (selectedSkill) => {
    setSkill(selectedSkill);
    handleSearch(null, selectedSkill);
  };

  const handleClearFilter = () => {
    setSkill("");
    setActiveSkillFilter("");
    setResources(allResources);
    setError(null);
  };

  return (
    <div className="lr-page">
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
      <div className="lr-header">
        <div className="hero-badge">Career Upskilling Hub</div>
        <h1>Master Your Missing Skills</h1>
        <p>
          Discover curated tutorials, documentation, and guides tailored to close your skill gaps and accelerate your career.
        </p>
      </div>

      <div className="lr-container">
        {/* LOADING INITIAL DATA */}
        {loading && (
          <div className="lr-loading-card">
            <div className="loading-spinner" />
            <h3 style={{ color: '#172033', marginTop: '16px' }}>Loading Personalized Recommendations</h3>
            <p style={{ color: '#64748b', marginTop: '8px' }}>Analyzing your skill gaps and fetching tailored resources...</p>
          </div>
        )}

        {!loading && (
          <>
            {/* SKILL GAPS SECTION (FROM CANDIDATE'S ATS ANALYSIS) */}
            {hasAnalysis && userMissingSkills.length > 0 ? (
              <div className="lr-skill-gaps-card">
                <div className="skill-gaps-header">
                  <span className="skill-gaps-badge">⚡ ATS SKILL GAPS</span>
                  <h2>Recommended Upgrades for Your Profile</h2>
                  <p>
                    Skills identified as missing from your latest resume analysis. Click any skill to filter relevant learning resources.
                  </p>
                </div>
                <div className="skill-gaps-chips">
                  {userMissingSkills.map((sk, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={`gap-chip ${activeSkillFilter.toLowerCase() === sk.toLowerCase() ? "gap-chip-active" : ""}`}
                      onClick={() => handleSkillSelect(sk)}
                    >
                      ⚡ {sk}
                    </button>
                  ))}
                </div>
              </div>
            ) : !hasAnalysis ? (
              /* NO ATS ANALYSIS YET BANNER */
              <div className="lr-no-analysis-banner">
                <div className="banner-icon">📊</div>
                <div className="banner-text">
                  <h3 style={{ color: '#172033' }}>Unlock Personalized Skill Gap Recommendations</h3>
                  <p style={{ color: '#172033' }}>
                    Upload your resume to run an ATS check and automatically highlight the exact skills you need to learn next.
                  </p>
                </div>
                <button
                  type="button"
                  className="primary-btn"
                  onClick={() => navigate("/resume-analysis")}
                >
                  Analyze Resume Now →
                </button>
              </div>
            ) : null}

            {/* SEARCH & POPULAR SKILLS BAR */}
            <div className="lr-search-card">
              <form onSubmit={handleSearch} className="lr-search-form">
                <div className="lr-search-input-wrapper">
                  <span className="lr-search-icon">🔍</span>
                  <input
                    type="text"
                    placeholder="Search by skill e.g. Java, Docker, React, AWS..."
                    value={skill}
                    onChange={(e) => setSkill(e.target.value)}
                    className="lr-search-input"
                  />
                </div>
                <button
                  type="submit"
                  className={`lr-search-btn ${searchLoading ? "btn-loading" : ""}`}
                  disabled={searchLoading}
                >
                  {searchLoading ? "Searching..." : "Filter Resources"}
                </button>
                {activeSkillFilter && (
                  <button
                    type="button"
                    className="lr-clear-btn"
                    onClick={handleClearFilter}
                  >
                    Clear Filter
                  </button>
                )}
              </form>

              {/* POPULAR SKILL CHIPS */}
              <div className="lr-popular-section">
                <span className="lr-popular-label">Popular Topics:</span>
                <div className="lr-skill-chips">
                  {POPULAR_SKILLS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      className={`lr-skill-chip ${activeSkillFilter.toLowerCase() === s.toLowerCase() ? "lr-chip-active" : ""}`}
                      onClick={() => handleSkillSelect(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ERROR STATE */}
            {error && (
              <div className="lr-error-banner">
                <span>⚠️</span>
                <p>{error}</p>
              </div>
            )}

            {/* SEARCH LOADING STATE */}
            {searchLoading && (
              <div className="lr-loading-card">
                <div
                  className="ats-spinner"
                  style={{
                    borderColor: "rgba(99, 102, 241, 0.3)",
                    borderTopColor: "#6366f1",
                    width: "32px",
                    height: "32px",
                  }}
                />
                <h3>Searching resources for "{activeSkillFilter}"...</h3>
              </div>
            )}

            {/* RESOURCE RESULTS GRID */}
            {!searchLoading && resources.length > 0 && (
              <div className="lr-results-section">
                <div className="lr-results-header">
                  <div>
                    <span className="results-badge" style={{ color: '#172033' }}>CURATED LEARNING PATHS</span>
                    <h2 style={{ color: '#172033' }}>
                      {activeSkillFilter
                        ? `${resources.length} Resource${resources.length !== 1 ? "s" : ""} for "${activeSkillFilter}"`
                        : `All Learning Resources (${resources.length})`}
                    </h2>
                  </div>
                  {activeSkillFilter && (
                    <button
                      type="button"
                      className="secondary-btn-sm"
                      onClick={handleClearFilter}
                    >
                      Show All Resources
                    </button>
                  )}
                </div>

                <div className="lr-resources-grid">
                  {resources.map((res, idx) => (
                    <div key={res.id || idx} className="lr-resource-card">
                      <div className="lr-resource-skill-tag">
                        📌 {res.skill}
                      </div>
                      <h3 className="lr-resource-title">{res.title}</h3>
                      {res.description && (
                        <p className="lr-resource-description">{res.description}</p>
                      )}
                      {res.url ? (
                        <a
                          href={res.url}
                          target="_blank"
                          rel="noreferrer"
                          className="lr-resource-link"
                        >
                          Open Resource →
                        </a>
                      ) : (
                        <span className="lr-resource-unavailable">Reference Documentation</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* NO RESOURCES FOUND STATE */}
            {!searchLoading && resources.length === 0 && (
              <div className="lr-empty-card">
                <div className="lr-empty-icon">📭</div>
                <h2>No Resources Found for "{activeSkillFilter}"</h2>
                <p>
                  We couldn't find matches for this specific skill. Try searching for a broader technology or clear your search filter to browse all resources.
                </p>
                <button
                  type="button"
                  className="primary-btn"
                  onClick={handleClearFilter}
                >
                  View All Learning Resources
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default LearningResources;