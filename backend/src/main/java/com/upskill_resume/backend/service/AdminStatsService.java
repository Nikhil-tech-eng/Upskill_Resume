package com.upskill_resume.backend.service;

import com.upskill_resume.backend.dto.AdminStatsDTO;
import com.upskill_resume.backend.repository.*;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AdminStatsService {

    private final UserRepository userRepository;
    private final ResumeRepository resumeRepository;
    private final ResumeAnalysisRepository resumeAnalysisRepository;
    private final JobMatchRepository jobMatchRepository;
    private final InterviewQuestionRepository interviewQuestionRepository;
    private final LearningResourceRepository learningResourceRepository;

    public AdminStatsService(
            UserRepository userRepository,
            ResumeRepository resumeRepository,
            ResumeAnalysisRepository resumeAnalysisRepository,
            JobMatchRepository jobMatchRepository,
            InterviewQuestionRepository interviewQuestionRepository,
            LearningResourceRepository learningResourceRepository) {
        this.userRepository = userRepository;
        this.resumeRepository = resumeRepository;
        this.resumeAnalysisRepository = resumeAnalysisRepository;
        this.jobMatchRepository = jobMatchRepository;
        this.interviewQuestionRepository = interviewQuestionRepository;
        this.learningResourceRepository = learningResourceRepository;
    }

    public AdminStatsDTO getAdminStatistics() {
        AdminStatsDTO stats = new AdminStatsDTO();

        // KPI Stats
        stats.setTotalUsers(userRepository.count());
        stats.setTotalResumes(resumeRepository.count());
        stats.setTotalResumeAnalyses(resumeAnalysisRepository.count());
        stats.setTotalJobMatches(jobMatchRepository.count());
        stats.setTotalInterviewQuestions(interviewQuestionRepository.count());
        stats.setTotalLearningResourceSearches(learningResourceRepository.count());
        
        Double avgScore = resumeAnalysisRepository.findAverageAtsScore();
        stats.setAverageAtsScore(avgScore != null ? avgScore : 0.0);

        // User Analytics
        stats.setUserCount(userRepository.countByRole("USER"));
        stats.setAdminCount(userRepository.countByRole("ADMIN"));
        stats.setNewUsersOverTime(userRepository.findNewUsersLast30Days());

        // Resume Analytics
        stats.setResumesOverTime(resumeRepository.findResumesLast30Days());
        stats.setAnalysesOverTime(Collections.emptyList()); // Can add similar query if needed
        
        // Top Missing Skills
        List<String> allMissingSkills = resumeAnalysisRepository.findAllMissingSkills();
        stats.setTopMissingSkills(extractTopSkills(allMissingSkills, 10));

        // Feature Usage
        Map<String, Long> featureUsage = new HashMap<>();
        featureUsage.put("Resume Analysis", stats.getTotalResumeAnalyses());
        featureUsage.put("Job Matching", stats.getTotalJobMatches());
        featureUsage.put("Interview Prep", stats.getTotalInterviewQuestions());
        featureUsage.put("Learning Resources", stats.getTotalLearningResourceSearches());
        stats.setFeatureUsage(featureUsage);

        // Recent Activity - simplified version
        List<Map<String, Object>> recentActivity = new ArrayList<>();
        // Could add actual activity tracking, for now show summary counts
        stats.setRecentActivity(recentActivity);

        return stats;
    }

    private List<String> extractTopSkills(List<String> allMissingSkillsStrings, int limit) {
        Map<String, Integer> skillCount = new HashMap<>();
        
        for (String skillsString : allMissingSkillsStrings) {
            if (skillsString == null || skillsString.trim().isEmpty()) continue;
            
            // Split by common delimiters: comma, semicolon, pipe
            String[] skills = skillsString.split("[,;|]");
            for (String skill : skills) {
                String trimmed = skill.trim();
                if (!trimmed.isEmpty()) {
                    skillCount.put(trimmed, skillCount.getOrDefault(trimmed, 0) + 1);
                }
            }
        }
        
        return skillCount.entrySet().stream()
                .sorted(Map.Entry.<String, Integer>comparingByValue().reversed())
                .limit(limit)
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());
    }
}
