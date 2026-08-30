package com.upskill_resume.backend.service;

import com.upskill_resume.backend.entity.Resume;
import com.upskill_resume.backend.entity.User;
import com.upskill_resume.backend.repository.InterviewQuestionRepository;
import com.upskill_resume.backend.repository.JobMatchRepository;
import com.upskill_resume.backend.repository.ResumeAnalysisRepository;
import com.upskill_resume.backend.repository.ResumeRepository;
import com.upskill_resume.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ResumeService {

    private final ResumeRepository resumeRepository;
    private final UserRepository userRepository;
    private final ResumeAnalysisRepository resumeAnalysisRepository;
    private final JobMatchRepository jobMatchRepository;
    private final InterviewQuestionRepository interviewQuestionRepository;

    public ResumeService(
        ResumeRepository resumeRepository,
        UserRepository userRepository,
        ResumeAnalysisRepository resumeAnalysisRepository,
        JobMatchRepository jobMatchRepository,
        InterviewQuestionRepository interviewQuestionRepository) {

        this.resumeRepository = resumeRepository;
        this.userRepository = userRepository;
        this.resumeAnalysisRepository = resumeAnalysisRepository;
        this.jobMatchRepository = jobMatchRepository;
        this.interviewQuestionRepository = interviewQuestionRepository;
    }

    public Resume saveResume(String fileName, String extractedText, Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Resume resume = new Resume(fileName, extractedText, user);

        return resumeRepository.save(resume);
    }

    public List<Resume> getUserResumes(Long userId) {
        return resumeRepository.findByUserId(userId);
    }

    public Resume getResumeById(Long resumeId) {

        return resumeRepository.findById(resumeId)
                .orElseThrow(() -> new RuntimeException("Resume not found"));
    }

    public Long getUserIdByEmail(String email) {

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"))
                .getId();
    }

    public Resume getResumeByIdAndUser(Long resumeId, Long userId) {

        return resumeRepository.findById(resumeId)
                .filter(resume -> resume.getUser().getId().equals(userId))
                .orElseThrow(() ->
                        new RuntimeException("Resume not found"));
    }

    @Transactional
    public void deleteResume(Long resumeId, String userEmail) {
        Long userId = getUserIdByEmail(userEmail);
        Resume resume = getResumeByIdAndUser(resumeId, userId);

        // 1. Delete associated ResumeAnalysis
        resumeAnalysisRepository.findByResumeId(resume.getId())
                .ifPresent(resumeAnalysisRepository::delete);

        // 2. Delete associated InterviewQuestions
        interviewQuestionRepository.deleteAll(
                interviewQuestionRepository.findByResumeId(resume.getId())
        );

        // 3. Delete associated JobMatches
        jobMatchRepository.deleteAll(
                jobMatchRepository.findByResumeId(resume.getId())
        );

        // 4. Delete the Resume entity
        resumeRepository.delete(resume);
    }
}