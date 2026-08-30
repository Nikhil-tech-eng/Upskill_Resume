package com.upskill_resume.backend.service;

import com.upskill_resume.backend.entity.Resume;
import com.upskill_resume.backend.repository.InterviewQuestionRepository;
import com.upskill_resume.backend.repository.JobMatchRepository;
import com.upskill_resume.backend.repository.ResumeAnalysisRepository;
import com.upskill_resume.backend.repository.ResumeRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ResumeCleanupScheduler {

    private static final Logger logger = LoggerFactory.getLogger(ResumeCleanupScheduler.class);

    private final ResumeRepository resumeRepository;
    private final ResumeAnalysisRepository resumeAnalysisRepository;
    private final JobMatchRepository jobMatchRepository;
    private final InterviewQuestionRepository interviewQuestionRepository;

    @Value("${app.resume.retention-days:30}")
    private int retentionDays;

    public ResumeCleanupScheduler(
            ResumeRepository resumeRepository,
            ResumeAnalysisRepository resumeAnalysisRepository,
            JobMatchRepository jobMatchRepository,
            InterviewQuestionRepository interviewQuestionRepository) {
        this.resumeRepository = resumeRepository;
        this.resumeAnalysisRepository = resumeAnalysisRepository;
        this.jobMatchRepository = jobMatchRepository;
        this.interviewQuestionRepository = interviewQuestionRepository;
    }

    // Runs every day at 02:00 AM
    @Scheduled(cron = "0 0 2 * * ?")
    @Transactional
    public void cleanupExpiredResumes() {
        logger.info("Starting automatic resume retention cleanup. Retention limit: {} days.", retentionDays);
        LocalDateTime threshold = LocalDateTime.now().minusDays(retentionDays);

        List<Resume> expiredResumes = resumeRepository.findByCreatedAtIsNotNullAndCreatedAtBefore(threshold);
        logger.info("Found {} expired resume(s) created before {}", expiredResumes.size(), threshold);

        for (Resume resume : expiredResumes) {
            try {
                // Delete associated records first to preserve DB integrity
                resumeAnalysisRepository.findByResumeId(resume.getId())
                        .ifPresent(resumeAnalysisRepository::delete);

                interviewQuestionRepository.deleteAll(
                        interviewQuestionRepository.findByResumeId(resume.getId())
                );

                jobMatchRepository.deleteAll(
                        jobMatchRepository.findByResumeId(resume.getId())
                );

                resumeRepository.delete(resume);
                logger.info("Successfully deleted expired resume ID: {}", resume.getId());
            } catch (Exception e) {
                logger.error("Failed to delete expired resume ID {}: {}", resume.getId(), e.getMessage(), e);
            }
        }
        logger.info("Completed automatic resume retention cleanup.");
    }
}
