import ResumeUpload from "./ResumeUpload";
import ResumeAnalysis from "./ResumeAnalysis";
import JobMatching from "./JobMatching";
import InterviewPreparation from "./InterviewPreparation";
import LearningResources from "./LearningResources";

function Dashboard() {
const handleLogout = () => {
localStorage.removeItem("token");
window.location.reload();
};

return (
<div className="dashboard">
    <nav className="navbar">
    <h2>Upskill_Resume</h2>

    <button onClick={handleLogout}>
        Logout
    </button>
    </nav>

    <main className="dashboard-content">
    <h1>Dashboard</h1>

    <p>
        Manage your resume and prepare for your next opportunity.
    </p>

    <div className="feature-section">
        <ResumeUpload />
    </div>

    <div className="feature-section">
        <ResumeAnalysis />
    </div>

    <div className="feature-section">
        <JobMatching />
    </div>


    <div className="feature-section">
        <InterviewPreparation />
    </div>

    <div className="feature-section">
        <LearningResources />
    </div>
    </main>
</div>
);
}

export default Dashboard;