    import { useState } from "react";
    import { apiFetch } from "../api";

    function ResumeUpload() {
    const [file, setFile] = useState(null);
    const [service, setService] = useState("analysis");
    const [loading, setLoading] = useState(false);
    const [analysis, setAnalysis] = useState(null);

    const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    };

    const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
        alert("Please select a resume");
        return;
    }

    setLoading(true);

    try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await apiFetch("/api/resumes/upload", {
        method: "POST",
        body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
        alert("Resume upload failed");
        setLoading(false);
        return;
        }

        const resumeId = data.id;

        if (service === "analysis") {
        const analysisResponse = await apiFetch(
            `/api/resumes/analyze/${resumeId}`,
            {
            method: "POST",
            }
        );

        if (analysisResponse.ok) {
            const analysisData = await analysisResponse.json();
            setAnalysis(analysisData);
        } 
        else {
            alert("Resume uploaded, but analysis failed");
        }
        }

        if (service === "interview") {
        const interviewResponse = await apiFetch(
            `/api/interview/generate/${resumeId}`,
            {
            method: "POST",
            }
        );

        if (interviewResponse.ok) {
            alert("Resume uploaded and interview questions generated!");
        } else {
            alert("Resume uploaded, but interview generation failed");
        }
        }

        if (service === "matching") {
        alert("Resume uploaded successfully. Job matching can be done next.");
        }

        if (service === "learning") {
        alert("Resume uploaded successfully. Learning resources can be generated next.");
        }

    } catch (error) {
        console.error(error);
        alert("Something went wrong");
    }

    setLoading(false);
    };

    return (
    <div className="resume-page">
        <div className="resume-card">
        <h1>Upload Your Resume</h1>

        <p>
            Choose a service and upload your resume to get started.
        </p>

        <div className="service-options">

            <label>
            <input
                type="radio"
                name="service"
                value="analysis"
                checked={service === "analysis"}
                onChange={(e) => setService(e.target.value)}
            />
            Resume Analysis
            </label>

            <label>
            <input
                type="radio"
                name="service"
                value="matching"
                checked={service === "matching"}
                onChange={(e) => setService(e.target.value)}
            />
            Job Matching
            </label>

            <label>
            <input
                type="radio"
                name="service"
                value="interview"
                checked={service === "interview"}
                onChange={(e) => setService(e.target.value)}
            />
            Interview Preparation
            </label>

            <label>
            <input
                type="radio"
                name="service"
                value="learning"
                checked={service === "learning"}
                onChange={(e) => setService(e.target.value)}
            />
            Learning Resources
            </label>

        </div>

        <form onSubmit={handleUpload}>

            <input
            type="file"
            accept=".pdf,.docx"
            onChange={handleFileChange}
            />

            {file && <p>Selected: {file.name}</p>}

            <button
            type="submit"
            className="primary-btn"
            disabled={loading}
            >
            {loading ? "Processing..." : "Upload & Continue"}
            </button>

        </form>
            {analysis && (
            <div className="result-box">
            <h2>Resume Analysis</h2>

            <h3>ATS Score: {analysis.atsScore}/100</h3>

            <p>
            <strong>Skills:</strong> {analysis.skills}
            </p>

            <p>
            <strong>Missing Skills:</strong> {analysis.missingSkills}
            </p>

            <p>
            <strong>Suggestions:</strong> {analysis.suggestions}
            </p>

            <p>
            <strong>Summary:</strong> {analysis.summary}
            </p>
            </div>
            )}
        </div>
    </div>
    );
    }

    export default ResumeUpload;