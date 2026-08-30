import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api";

function ResumeUpload({ onNavigate }) {
const navigate = useNavigate();
const [file, setFile] = useState(null);
const [dragging, setDragging] = useState(false);
const [loading, setLoading] = useState(false);
const [analysis, setAnalysis] = useState(null);
const [showSuggestion, setShowSuggestion] = useState(false);

const goHome = () => {
    if (onNavigate) {
        onNavigate("home");
    }
    navigate("/");
};

const handleFile = (selectedFile) => {
    if (!selectedFile) return;

    const allowedTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
    alert("Please upload a PDF or DOCX file.");
    return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
    alert("File size must be less than 5 MB.");
    return;
    }

    setFile(selectedFile);
    setAnalysis(null);
    setShowSuggestion(false);
};

const handleFileChange = (e) => {
    handleFile(e.target.files[0]);
};

const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
};

const handleAnalyze = async () => {
    if (!file) {
    alert("Please upload your resume.");
    return;
    }

    setLoading(true);

    try {
    const formData = new FormData();
    formData.append("file", file);

    const uploadResponse = await apiFetch("/api/resumes/upload", {
        method: "POST",
        body: formData,
    });

    const uploadData = await uploadResponse.json();

    if (!uploadResponse.ok) {
        alert("Resume upload failed.");
        setLoading(false);
        return;
    }

    const resumeId = uploadData.id;

    const analysisResponse = await apiFetch(
        `/api/resumes/analyze/${resumeId}`,
        {
        method: "POST",
        }
    );

    if (!analysisResponse.ok) {
        alert("Resume analysis failed.");
        setLoading(false);
        return;
    }

    const analysisData = await analysisResponse.json();

    setAnalysis(analysisData);
    } catch (error) {
    console.error(error);
    alert("Something went wrong.");
    }

    setLoading(false);
};

return (
    <div className="ats-page">


    {/* BACK BUTTON */}

    <div className="ats-navigation">

        <button
        className="ats-back-btn"
        onClick={goHome}
        >
        ← Back to Home
        </button>

    </div>


    {/* HEADER */}

    <div className="ats-header">

        <div className="hero-badge">
        AI-Powered Resume Analysis
        </div>

        <h1>
        Check Your Resume
        </h1>

        <p>
        Upload your resume and discover how ATS-ready
        your profile really is.
        </p>

    </div>


    {/* UPLOAD */}

    <div
        className={`ats-upload-box ${
        dragging ? "ats-upload-dragging" : ""
        } ${file ? "ats-upload-has-file" : ""}`}
        onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
        }}
        onDragLeave={(e) => {
        e.preventDefault();
        setDragging(false);
        }}
        onDrop={handleDrop}
    >

        {!file ? (
        <>
            <div className="ats-upload-icon">
            ↑
            </div>

            <h2>
            Drag & Drop your resume here
            </h2>

            <p>
            Drop your PDF or DOCX file here
            </p>

            <div className="ats-upload-divider">
            <span>OR</span>
            </div>

            <label className="ats-browse-btn">
            Browse Files

            <input
                type="file"
                accept=".pdf,.docx"
                onChange={handleFileChange}
                hidden
            />
            </label>

            <span className="ats-upload-info">
            PDF or DOCX • Maximum 5 MB
            </span>
        </>
        ) : (
        <>
            <div className="ats-upload-success-icon">
            ✓
            </div>

            <h2>
            Resume Selected
            </h2>

            <p>
            Your resume is ready to be analyzed.
            </p>

            <button
            className="ats-change-file-btn"
            onClick={() => setFile(null)}
            >
            Choose Another File
            </button>
        </>
        )}

    </div>


    {/* SELECTED FILE */}

    {file && (
        <div className="ats-selected-file">

        <div>

            <strong>
            {file.name}
            </strong>

            <small>
            {(file.size / 1024 / 1024).toFixed(2)} MB
            </small>

        </div>

        <button
            onClick={() => {
            setFile(null);
            setAnalysis(null);
            setShowSuggestion(false);
            }}
        >
            Remove
        </button>

        </div>
    )}


    {/* ANALYZE BUTTON */}

    {file && !analysis && (
        <button
        className={`ats-analyze-btn ${
            loading ? "ats-analyze-loading" : ""
        }`}
        onClick={handleAnalyze}
        disabled={loading}
        >

        {loading ? (
            <>
            <span className="ats-spinner"></span>
            Analyzing your resume...
            </>
        ) : (
            "Analyze My Resume →"
        )}

        </button>
    )}


    {/* RESULT DASHBOARD */}

    {analysis && (
        <div className="ats-result-dashboard">

        {/* RESULT HEADER */}

        <div className="ats-result-header">

            <div>

            <span className="ats-result-label">
                AI RESUME ANALYSIS
            </span>

            <h2>
                Your ATS Resume Score
            </h2>

            <p>
                Here's how your resume performs against common
                ATS and recruiter expectations.
            </p>

            </div>

            <button
            className="ats-new-analysis-btn"
            onClick={() => {
                setFile(null);
                setAnalysis(null);
                setShowSuggestion(false);
            }}
            >
            Analyze Another Resume
            </button>

        </div>


        {/* SCORE + SUMMARY */}

        <div className="ats-overview-grid">

            <div className="ats-score-card">

            <div
                className="ats-score-circle"
                style={{
                "--score": analysis.atsScore,
                }}
            >

                <div className="ats-score-inner">

                <span>
                    {analysis.atsScore}
                </span>

                <small>
                    /100
                </small>

                </div>

            </div>

            <h3>
                ATS Score
            </h3>

            <p>
                {analysis.atsScore >= 80
                ? "Excellent resume"
                : analysis.atsScore >= 60
                ? "Good resume with room for improvement"
                : "Your resume needs improvement"}
            </p>

            </div>


            <div className="ats-summary-card">

            <div className="ats-card-heading">
                <span>
                AI SUMMARY
                </span>
            </div>

            <h3>
                Resume Overview
            </h3>

            <p>
                {analysis.summary}
            </p>

            </div>

        </div>


        {/* SKILLS */}

        <div className="ats-analysis-card">

            <div className="ats-card-title">

            <div>

                <span className="ats-section-label">
                STRENGTHS
                </span>

                <h3>
                Skills Detected
                </h3>

            </div>

            </div>

            <div className="ats-skill-list">

            {(analysis.skills || "")
            .split(",")
            .filter((skill) => skill.trim())
            .map((skill, index) => (
                <span
                    key={index}
                    className="ats-skill-tag"
                >
                    {skill.trim()}
                </span>
                ))}

            </div>

        </div>


        {/* MISSING SKILLS */}

        <div className="ats-analysis-card">

            <div className="ats-card-title">

            <div>

                <span className="ats-section-label">
                SKILL GAPS
                </span>

                <h3>
                Missing Skills
                </h3>

            </div>

            </div>

            <div className="ats-skill-list">

            {(analysis.missingSkills || "")
            .split(",")
            .filter((skill) => skill.trim())
            .map((skill, index) => (
                <span
                    key={index}
                    className="ats-missing-skill-tag"
                >
                    {skill.trim()}
                </span>
                ))}

            </div>

        </div>


        {/* SUGGESTIONS */}

        <div className="ats-analysis-card">

            <div className="ats-card-title">

            <div>

                <span className="ats-section-label">
                IMPROVEMENT
                </span>

                <h3>
                Resume Suggestions
                </h3>

            </div>

            </div>


            <div className="ats-suggestion-item">

            <div className="ats-suggestion-number">
                01
            </div>

            <div className="ats-suggestion-content">

                <div className="ats-suggestion-top">

                <h4>
                    Improve Your Resume Content
                </h4>

                <span className="ats-suggestion-priority">
                    Recommended
                </span>

                </div>

                <p>
                {analysis.suggestions}
                </p>

                <button
                className="ats-see-more-btn"
                onClick={() =>
                    setShowSuggestion(!showSuggestion)
                }
                >
                {showSuggestion
                    ? "Show Less ↑"
                    : "See Exactly What To Write →"}
                </button>


                {showSuggestion && (
                <div className="ats-detailed-suggestion">

                    <span>
                    EXACT TEXT TO ADD
                    </span>

                    <p>
                    Add measurable achievements to your
                    resume experience section. Mention
                    specific technologies used and quantify
                    your impact wherever possible.
                    </p>


                    <div className="ats-example-text">

                    <strong>
                        Example
                    </strong>

                    <p>
                        Developed a Spring Boot REST API for
                        user authentication and resume analysis,
                        improving application response time
                        by 30%.
                    </p>

                    </div>

                </div>
                )}

            </div>

            </div>

        </div>

        </div>
    )}

    </div>
);
}

export default ResumeUpload;