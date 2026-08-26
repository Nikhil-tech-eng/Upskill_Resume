import { useState } from "react";
import { apiFetch } from "../api";

function LearningResources() {
const [skill, setSkill] = useState("");
const [resources, setResources] = useState([]);
const [loading, setLoading] = useState(false);

const handleSearch = async (e) => {
e.preventDefault();

if (!skill) {
    alert("Enter a skill");
    return;
}

setLoading(true);

const response = await apiFetch(
    `/api/resources/skill/${skill}`
);

const data = await response.json();

setLoading(false);

if (response.ok) {
    setResources(data);
} else {
    alert("Failed to load resources");
}
};

return (
<div className="analysis-page">
    <div className="analysis-card">
    <h1>Learning Resources</h1>

    <p>
        Find learning resources to improve your skills.
    </p>

    <form onSubmit={handleSearch}>
        <input
        type="text"
        placeholder="Enter skill (e.g. Java)"
        value={skill}
        onChange={(e) => setSkill(e.target.value)}
        required
        />

        <button type="submit" className="primary-btn">
        {loading ? "Searching..." : "Find Resources"}
        </button>
    </form>

    {resources.length > 0 && (
        <div className="analysis-result">
        <h2>Resources</h2>

        {resources.map((resource) => (
            <div key={resource.id}>
            <h3>{resource.title}</h3>

            <p>{resource.description}</p>

            <a
                href={resource.url}
                target="_blank"
                rel="noreferrer"
            >
                Open Resource
            </a>
            </div>
        ))}
        </div>
    )}
    </div>
</div>
);
}

export default LearningResources;