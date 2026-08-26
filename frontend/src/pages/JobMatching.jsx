    import { useState } from "react";
    import { apiFetch } from "../api";

    function JobMatching() {
    const [resumeId, setResumeId] = useState("");
    const [jobTitle, setJobTitle] = useState("");
    const [jobDescription, setJobDescription] = useState("");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleMatch = async (e) => {
        e.preventDefault();

        if (!resumeId || !jobTitle || !jobDescription) {
        alert("Enter Resume ID, Job Title and Job Description");
        return;
        }

        setLoading(true);
        setResult(null);

        try {
        const jobResponse = await apiFetch("/api/jobs", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
            title: jobTitle,
            description: jobDescription,
            }),
        });

        if (!jobResponse.ok) {
            alert("Failed to create job");
            setLoading(false);
            return;
        }

        const job = await jobResponse.json();

        const matchResponse = await apiFetch(
            `/api/matches/${resumeId}/${job.id}`,
            {
            method: "POST",
            }
        );

        const data = await matchResponse.json();

        if (matchResponse.ok) {
            setResult(data);
        } else {
            alert("Job matching failed");
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
            <h1>Job Matching</h1>

            <p>
            Compare your resume with a job description using AI.
            </p>

            <form onSubmit={handleMatch}>
            <input
                type="number"
                placeholder="Resume ID"
                value={resumeId}
                onChange={(e) => setResumeId(e.target.value)}
                required
            />

            <input
                type="text"
                placeholder="Job Title"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                required
            />

            <textarea
                placeholder="Paste Job Description"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows="8"
                required
            />

            <button type="submit" className="primary-btn">
                {loading ? "Matching..." : "Match Resume"}
            </button>
            </form>

            {result && (
            <div className="analysis-result">
                <h2>Match Result</h2>

                <p>
                <strong>Match Score:</strong>{" "}
                {result.matchScore ?? "Not available"}
                </p>

                <p>
                <strong>Matching Skills:</strong>
                <br />
                {result.matchedSkills || "Not available"}
                </p>

                <p>
                <strong>Missing Skills:</strong>
                <br />
                {result.missingSkills || "Not available"}
                </p>

                <p>
                <strong>Recommendations:</strong>
                <br />
                {result.recommendations || "Not available"}
                </p>
            </div>
            )}
        </div>
        </div>
    );
    }

    export default JobMatching;