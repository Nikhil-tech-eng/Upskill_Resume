function Dashboard() {
const goToATS = () => {
localStorage.setItem("openPage", "ats");
window.location.reload();
};

const handleLogout = () => {
localStorage.removeItem("token");
localStorage.removeItem("openPage");
window.location.reload();
};

return (
<div className="landing-page">

    {/* NAVBAR */}

    <nav className="landing-navbar">

    <h2 className="landing-logo">
        Upskill_Resume
    </h2>

    <div className="landing-nav-links">

        <button className="nav-active">
        Home
        </button>

        <button>
        Resume Analysis
        </button>

        <button>
        Job Matching
        </button>

        <button>
        Interview Preparation
        </button>

        <button>
        Learning Resources
        </button>

        <button>
        About Us
        </button>

        <button>
        Contact
        </button>

    </div>

    <div className="landing-auth">

        <button
        className="login-nav-btn"
        onClick={handleLogout}
        >
        Logout
        </button>

    </div>

    </nav>


    {/* HERO */}

    <main>

    <section className="landing-hero">

        <div className="hero-badge">
        AI-Powered Career Platform
        </div>

        <h1>
        Build Your Career
        <br />
        <span>With AI</span>
        </h1>

        <p>
        Create a professional resume or check how
        ATS-ready your resume really is.
        </p>


        {/* MAIN OPTIONS */}

        <div className="landing-options">

        {/* CREATE RESUME */}

        <div className="landing-option-card">

            <div className="landing-option-icon">
            📄
            </div>

            <h2>
            Create Resume
            </h2>

            <p>
            Build a professional, ATS-friendly resume
            with AI-powered assistance and modern templates.
            </p>

            <button>
            Create My Resume →
            </button>

        </div>


        {/* ATS CHECK */}

        <div className="landing-option-card">

            <div className="landing-option-icon">
            📊
            </div>

            <h2>
            ATS Check
            </h2>

            <p>
            Upload your existing resume and discover
            your ATS score, skills, gaps and improvements.
            </p>

            <button onClick={goToATS}>
            Check My Resume →
            </button>

        </div>

        </div>

    </section>


    {/* FEATURES */}

    <section className="landing-features">

        <h2>
        Everything You Need for Your Career
        </h2>

        <p className="section-description">
        Go beyond your resume with AI-powered career tools.
        </p>

        <div className="landing-feature-grid">

        <div className="landing-feature-card">

            <div>🎯</div>

            <h3>
            Job Matching
            </h3>

            <p>
            Find out how well your resume matches
            a specific job description.
            </p>

        </div>


        <div className="landing-feature-card">

            <div>💬</div>

            <h3>
            Interview Preparation
            </h3>

            <p>
            Generate personalized interview questions
            based on your resume.
            </p>

        </div>


        <div className="landing-feature-card">

            <div>📚</div>

            <h3>
            Learning Resources
            </h3>

            <p>
            Discover resources to improve your missing
            skills and close your skill gaps.
            </p>

        </div>


        <div className="landing-feature-card">

            <div>🤖</div>

            <h3>
            AI Career Insights
            </h3>

            <p>
            Get intelligent recommendations to improve
            your career profile.
            </p>

        </div>

        </div>

    </section>


    {/* WORKFLOW */}

    <section className="landing-workflow">

        <h2>
        Your Career Journey Starts Here
        </h2>

        <div className="workflow-items">

        <div className="workflow-item">

            <span>01</span>

            <h3>
            Create or Upload
            </h3>

            <p>
            Start with a new resume or upload your existing one.
            </p>

        </div>


        <div className="workflow-item">

            <span>02</span>

            <h3>
            Analyze
            </h3>

            <p>
            AI analyzes your resume, skills and career profile.
            </p>

        </div>


        <div className="workflow-item">

            <span>03</span>

            <h3>
            Improve
            </h3>

            <p>
            Identify gaps and improve your resume.
            </p>

        </div>


        <div className="workflow-item">

            <span>04</span>

            <h3>
            Prepare
            </h3>

            <p>
            Match jobs and prepare for interviews.
            </p>

        </div>

        </div>

    </section>


    {/* FOOTER */}

    <footer className="landing-footer">

        <h3>
        Upskill_Resume
        </h3>

        <p>
        AI-powered tools to build, improve and grow your career.
        </p>

        <div>
        © 2026 Upskill_Resume
        </div>

    </footer>

    </main>

</div>
);
}

export default Dashboard;