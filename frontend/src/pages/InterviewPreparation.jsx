import { useState } from "react";
import { apiFetch } from "../api";

function InterviewPreparation() {
const [resumeId, setResumeId] = useState("");
const [questions, setQuestions] = useState("");
const [loading, setLoading] = useState(false);

const handleGenerate = async (e) => {
e.preventDefault();

if (!resumeId) {
    alert("Enter Resume ID");
    return;
}

setLoading(true);

try {
    const response = await apiFetch(
    `/api/interview/generate/${resumeId}`,
    {
        method: "POST",
    }
    );

    const data = await response.text();

    if (response.ok) {
    const cleanedData = data
        .replace(/\\`/g, "`")
        .replace(/\\\./g, ".")
        .replace(/\*\*/g, "");

    setQuestions(cleanedData);
    } else {
    alert("Failed to generate questions");
    }
} catch (error) {
    console.error(error);
    alert("Something went wrong");
}

setLoading(false);
};

return (
<div className="analysis-page">
    <div className="analysis-card">
    <h1>Interview Preparation</h1>

    <p>
        Generate personalized interview questions based on your resume.
    </p>

    <form onSubmit={handleGenerate}>
        <input
        type="number"
        placeholder="Resume ID"
        value={resumeId}
        onChange={(e) => setResumeId(e.target.value)}
        required
        />

        <button type="submit" className="primary-btn">
        {loading ? "Generating..." : "Generate Questions"}
        </button>
    </form>

    {questions && (
        <div className="analysis-result">
        <h2>Interview Questions</h2>

        <pre
            style={{
                whiteSpace: "pre-wrap",
                overflowWrap: "anywhere",
                wordBreak: "break-word",
                width: "100%",
                maxWidth: "100%",
                boxSizing: "border-box",
                margin: 0,
                overflowX: "hidden"
            }}
            >
            {questions}
            </pre>
        </div>
    )}
    </div>
</div>
);
}

export default InterviewPreparation;