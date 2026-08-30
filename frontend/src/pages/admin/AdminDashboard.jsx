import { useState, useEffect } from "react";
import { apiFetch } from "../../api";
import "../../AdminDashboard.css";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const response = await apiFetch("/api/admin/stats");
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        } else {
          setError("Failed to fetch admin dashboard statistics.");
        }
      } catch (err) {
        console.error(err);
        setError("Network error fetching admin statistics.");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, []);

  if (loading) {
    return (
      <div className="admin-dashboard-container">
        <div className="admin-header">
          <h1>Admin Dashboard</h1>
          <p>Platform analytics and management</p>
        </div>
        <div className="admin-loading">Loading statistics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-dashboard-container">
        <div className="admin-header">
          <h1>Admin Dashboard</h1>
          <p>Platform analytics and management</p>
        </div>
        <div className="admin-error">{error}</div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-container">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Platform analytics and management</p>
      </div>

      {/* KPI Cards */}
      <div className="admin-kpi-grid">
        <div className="admin-kpi-card">
          <div className="kpi-icon">👥</div>
          <div className="kpi-content">
            <span className="kpi-label">Total Users</span>
            <h3 className="kpi-value">{stats.totalUsers || 0}</h3>
          </div>
        </div>

        <div className="admin-kpi-card">
          <div className="kpi-icon">📄</div>
          <div className="kpi-content">
            <span className="kpi-label">Total Resumes</span>
            <h3 className="kpi-value">{stats.totalResumes || 0}</h3>
          </div>
        </div>

        <div className="admin-kpi-card">
          <div className="kpi-icon">📊</div>
          <div className="kpi-content">
            <span className="kpi-label">Resume Analyses</span>
            <h3 className="kpi-value">{stats.totalResumeAnalyses || 0}</h3>
          </div>
        </div>

        <div className="admin-kpi-card">
          <div className="kpi-icon">🎯</div>
          <div className="kpi-content">
            <span className="kpi-label">Job Matches</span>
            <h3 className="kpi-value">{stats.totalJobMatches || 0}</h3>
          </div>
        </div>

        <div className="admin-kpi-card">
          <div className="kpi-icon">💬</div>
          <div className="kpi-content">
            <span className="kpi-label">Interview Questions</span>
            <h3 className="kpi-value">{stats.totalInterviewQuestions || 0}</h3>
          </div>
        </div>

        <div className="admin-kpi-card">
          <div className="kpi-icon">📚</div>
          <div className="kpi-content">
            <span className="kpi-label">Learning Resources</span>
            <h3 className="kpi-value">{stats.totalLearningResourceSearches || 0}</h3>
          </div>
        </div>

        <div className="admin-kpi-card highlight">
          <div className="kpi-icon">⭐</div>
          <div className="kpi-content">
            <span className="kpi-label">Average ATS Score</span>
            <h3 className="kpi-value">{stats.averageAtsScore ? stats.averageAtsScore.toFixed(1) : 'N/A'}</h3>
          </div>
        </div>
      </div>

      {/* User Analytics Section */}
      <div className="admin-section">
        <h2 className="section-title">User Analytics</h2>
        <div className="admin-analytics-grid">
          <div className="analytics-card">
            <h3>User Distribution</h3>
            <div className="user-stats">
              <div className="user-stat-item">
                <span className="stat-icon">👤</span>
                <div>
                  <div className="stat-label">Regular Users</div>
                  <div className="stat-number">{stats.userCount || 0}</div>
                </div>
              </div>
              <div className="user-stat-item">
                <span className="stat-icon">👨💼</span>
                <div>
                  <div className="stat-label">Admin Users</div>
                  <div className="stat-number">{stats.adminCount || 0}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="analytics-card">
            <h3>New Users (Last 30 Days)</h3>
            {stats.newUsersOverTime && stats.newUsersOverTime.length > 0 ? (
              <div className="timeline-list">
                {stats.newUsersOverTime.slice(0, 5).map((item, idx) => (
                  <div key={idx} className="timeline-item">
                    <span className="timeline-date">{new Date(item.date).toLocaleDateString()}</span>
                    <span className="timeline-count">{item.count} users</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">No new users in the last 30 days</div>
            )}
          </div>
        </div>
      </div>

      {/* Resume Analytics Section */}
      <div className="admin-section">
        <h2 className="section-title">Resume Analytics</h2>
        <div className="admin-analytics-grid">
          <div className="analytics-card">
            <h3>Resume Uploads (Last 30 Days)</h3>
            {stats.resumesOverTime && stats.resumesOverTime.length > 0 ? (
              <div className="timeline-list">
                {stats.resumesOverTime.slice(0, 5).map((item, idx) => (
                  <div key={idx} className="timeline-item">
                    <span className="timeline-date">{new Date(item.date).toLocaleDateString()}</span>
                    <span className="timeline-count">{item.count} resumes</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">No resumes uploaded in the last 30 days</div>
            )}
          </div>

          <div className="analytics-card">
            <h3>Top Missing Skills</h3>
            {stats.topMissingSkills && stats.topMissingSkills.length > 0 ? (
              <div className="skills-list">
                {stats.topMissingSkills.slice(0, 10).map((skill, idx) => (
                  <div key={idx} className="skill-badge">{skill}</div>
                ))}
              </div>
            ) : (
              <div className="empty-state">No skill gap data available yet</div>
            )}
          </div>
        </div>
      </div>

      {/* Feature Usage Section */}
      <div className="admin-section">
        <h2 className="section-title">Feature Usage</h2>
        <div className="feature-usage-grid">
          {stats.featureUsage && Object.entries(stats.featureUsage).map(([feature, count]) => (
            <div key={feature} className="feature-usage-card">
              <div className="feature-name">{feature}</div>
              <div className="feature-count">{count}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
