import { useState } from "react";
import { apiFetch } from "../api";

function ResumeAnalysis() {
const [resumeId, setResumeId] = useState("");
const [analysis, setAnalysis] = useState(null);
const [loading, setLoading] = useState(false);

const handleAnalyze = async (e) => {
e.preventDefault();

if (!resumeId) {
    alert("Enter Resume ID");
    return;
}

setLoading(true);


const response = await apiFetch(
    `/api/resumes/analyze/${resumeId}`,
    {
        method: "POST",
    }
);

const data = await response.json();

setLoading(false);

if (response.ok) {
    setAnalysis(data);
} else {
    alert("Analysis failed");
}
};

return (
<div className="analysis-page">
    <div className="analysis-card">
    <h1>AI Resume Analysis</h1>

    <p>
        Enter your uploaded Resume ID to generate an AI-powered analysis.
    </p>

    <form onSubmit={handleAnalyze}>
        <input
        type="number"
        placeholder="Resume ID"
        value={resumeId}
        onChange={(e) => setResumeId(e.target.value)}
        required
        />

        <button type="submit" className="primary-btn">
        {loading ? "Analyzing..." : "Analyze Resume"}
        </button>
    </form>

    {analysis && (
        <div className="analysis-result">
        <h2>Analysis Result</h2>

        <p>
            <strong>ATS Score:</strong>{" "}
            {analysis.atsScore ?? "Not available"}
        </p>

        <p>
            <strong>Skills:</strong>
            <br />
            {analysis.skills}
        </p>

        <p>
            <strong>Missing Skills:</strong>
            <br />
            {analysis.missingSkills || "Not available"}
        </p>

        <p>
            <strong>Suggestions:</strong>
            <br />
            {analysis.suggestions || "Not available"}
        </p>

        <p>
            <strong>Summary:</strong>
            <br />
            {analysis.summary}
        </p>
        </div>
    )}
    </div>
</div>
);
}

export default ResumeAnalysis;