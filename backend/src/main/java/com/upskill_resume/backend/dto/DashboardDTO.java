package com.upskill_resume.backend.dto;

import java.util.List;

public class DashboardDTO {

    private String userName;
    private String userEmail;
    private int totalResumes;
    private List<ResumeItemDTO> resumes;
    private LatestAnalysisDTO latestAnalysis;

    public DashboardDTO() {
    }

    public DashboardDTO(String userName, String userEmail, int totalResumes, List<ResumeItemDTO> resumes, LatestAnalysisDTO latestAnalysis) {
        this.userName = userName;
        this.userEmail = userEmail;
        this.totalResumes = totalResumes;
        this.resumes = resumes;
        this.latestAnalysis = latestAnalysis;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public int getTotalResumes() {
        return totalResumes;
    }

    public void setTotalResumes(int totalResumes) {
        this.totalResumes = totalResumes;
    }

    public List<ResumeItemDTO> getResumes() {
        return resumes;
    }

    public void setResumes(List<ResumeItemDTO> resumes) {
        this.resumes = resumes;
    }

    public LatestAnalysisDTO getLatestAnalysis() {
        return latestAnalysis;
    }

    public void setLatestAnalysis(LatestAnalysisDTO latestAnalysis) {
        this.latestAnalysis = latestAnalysis;
    }

    public static class ResumeItemDTO {
        private String fileName;
        private boolean hasAnalysis;

        public ResumeItemDTO() {
        }

        public ResumeItemDTO(String fileName, boolean hasAnalysis) {
            this.fileName = fileName;
            this.hasAnalysis = hasAnalysis;
        }

        public String getFileName() {
            return fileName;
        }

        public void setFileName(String fileName) {
            this.fileName = fileName;
        }

        public boolean isHasAnalysis() {
            return hasAnalysis;
        }

        public void setHasAnalysis(boolean hasAnalysis) {
            this.hasAnalysis = hasAnalysis;
        }
    }

    public static class LatestAnalysisDTO {
        private String resumeFileName;
        private Integer atsScore;
        private String skills;
        private String missingSkills;
        private String suggestions;
        private String summary;

        public LatestAnalysisDTO() {
        }

        public LatestAnalysisDTO(String resumeFileName, Integer atsScore, String skills, String missingSkills, String suggestions, String summary) {
            this.resumeFileName = resumeFileName;
            this.atsScore = atsScore;
            this.skills = skills;
            this.missingSkills = missingSkills;
            this.suggestions = suggestions;
            this.summary = summary;
        }

        public String getResumeFileName() {
            return resumeFileName;
        }

        public void setResumeFileName(String resumeFileName) {
            this.resumeFileName = resumeFileName;
        }

        public Integer getAtsScore() {
            return atsScore;
        }

        public void setAtsScore(Integer atsScore) {
            this.atsScore = atsScore;
        }

        public String getSkills() {
            return skills;
        }

        public void setSkills(String skills) {
            this.skills = skills;
        }

        public String getMissingSkills() {
            return missingSkills;
        }

        public void setMissingSkills(String missingSkills) {
            this.missingSkills = missingSkills;
        }

        public String getSuggestions() {
            return suggestions;
        }

        public void setSuggestions(String suggestions) {
            this.suggestions = suggestions;
        }

        public String getSummary() {
            return summary;
        }

        public void setSummary(String summary) {
            this.summary = summary;
        }
    }
}
