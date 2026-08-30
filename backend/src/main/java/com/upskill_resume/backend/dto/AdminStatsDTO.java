package com.upskill_resume.backend.dto;

import java.util.List;
import java.util.Map;

public class AdminStatsDTO {
    
    // KPI Stats
    private long totalUsers;
    private long totalResumes;
    private long totalResumeAnalyses;
    private long totalJobMatches;
    private long totalInterviewQuestions;
    private long totalLearningResourceSearches;
    private Double averageAtsScore;
    
    // User Analytics
    private long userCount;
    private long adminCount;
    private List<Map<String, Object>> newUsersOverTime;
    
    // Resume Analytics
    private List<Map<String, Object>> resumesOverTime;
    private List<Map<String, Object>> analysesOverTime;
    private List<String> topMissingSkills;
    
    // Feature Usage
    private Map<String, Long> featureUsage;
    
    // Recent Activity
    private List<Map<String, Object>> recentActivity;

    public AdminStatsDTO() {}

    // Getters and Setters
    public long getTotalUsers() { return totalUsers; }
    public void setTotalUsers(long totalUsers) { this.totalUsers = totalUsers; }

    public long getTotalResumes() { return totalResumes; }
    public void setTotalResumes(long totalResumes) { this.totalResumes = totalResumes; }

    public long getTotalResumeAnalyses() { return totalResumeAnalyses; }
    public void setTotalResumeAnalyses(long totalResumeAnalyses) { this.totalResumeAnalyses = totalResumeAnalyses; }

    public long getTotalJobMatches() { return totalJobMatches; }
    public void setTotalJobMatches(long totalJobMatches) { this.totalJobMatches = totalJobMatches; }

    public long getTotalInterviewQuestions() { return totalInterviewQuestions; }
    public void setTotalInterviewQuestions(long totalInterviewQuestions) { this.totalInterviewQuestions = totalInterviewQuestions; }

    public long getTotalLearningResourceSearches() { return totalLearningResourceSearches; }
    public void setTotalLearningResourceSearches(long totalLearningResourceSearches) { this.totalLearningResourceSearches = totalLearningResourceSearches; }

    public Double getAverageAtsScore() { return averageAtsScore; }
    public void setAverageAtsScore(Double averageAtsScore) { this.averageAtsScore = averageAtsScore; }

    public long getUserCount() { return userCount; }
    public void setUserCount(long userCount) { this.userCount = userCount; }

    public long getAdminCount() { return adminCount; }
    public void setAdminCount(long adminCount) { this.adminCount = adminCount; }

    public List<Map<String, Object>> getNewUsersOverTime() { return newUsersOverTime; }
    public void setNewUsersOverTime(List<Map<String, Object>> newUsersOverTime) { this.newUsersOverTime = newUsersOverTime; }

    public List<Map<String, Object>> getResumesOverTime() { return resumesOverTime; }
    public void setResumesOverTime(List<Map<String, Object>> resumesOverTime) { this.resumesOverTime = resumesOverTime; }

    public List<Map<String, Object>> getAnalysesOverTime() { return analysesOverTime; }
    public void setAnalysesOverTime(List<Map<String, Object>> analysesOverTime) { this.analysesOverTime = analysesOverTime; }

    public List<String> getTopMissingSkills() { return topMissingSkills; }
    public void setTopMissingSkills(List<String> topMissingSkills) { this.topMissingSkills = topMissingSkills; }

    public Map<String, Long> getFeatureUsage() { return featureUsage; }
    public void setFeatureUsage(Map<String, Long> featureUsage) { this.featureUsage = featureUsage; }

    public List<Map<String, Object>> getRecentActivity() { return recentActivity; }
    public void setRecentActivity(List<Map<String, Object>> recentActivity) { this.recentActivity = recentActivity; }
}
