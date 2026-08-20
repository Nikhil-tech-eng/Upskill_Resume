package com.upskill_resume.backend.service;

import com.upskill_resume.backend.entity.JobDescription;
import com.upskill_resume.backend.entity.JobMatch;
import com.upskill_resume.backend.entity.Resume;
import com.upskill_resume.backend.repository.JobDescriptionRepository;
import com.upskill_resume.backend.repository.JobMatchRepository;
import com.upskill_resume.backend.repository.ResumeRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JobMatchService {

    private final JobMatchRepository jobMatchRepository;
    private final ResumeRepository resumeRepository;
    private final JobDescriptionRepository jobDescriptionRepository;

    public JobMatchService(
            JobMatchRepository jobMatchRepository,
            ResumeRepository resumeRepository,
            JobDescriptionRepository jobDescriptionRepository) {

        this.jobMatchRepository = jobMatchRepository;
        this.resumeRepository = resumeRepository;
        this.jobDescriptionRepository = jobDescriptionRepository;
    }

    public JobMatch saveMatch(
            Long resumeId,
            Long jobId,
            Integer matchScore,
            String matchedSkills,
            String missingSkills,
            String recommendations) {

        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() -> new RuntimeException("Resume not found"));

        JobDescription job = jobDescriptionRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job description not found"));

        JobMatch match = new JobMatch();

        match.setResume(resume);
        match.setJobDescription(job);
        match.setMatchScore(matchScore);
        match.setMatchedSkills(matchedSkills);
        match.setMissingSkills(missingSkills);
        match.setRecommendations(recommendations);

        return jobMatchRepository.save(match);
    }

    public List<JobMatch> getMatchesByResume(Long resumeId) {
        return jobMatchRepository.findByResumeId(resumeId);
    }

    public List<JobMatch> getMatchesByJob(Long jobId) {
        return jobMatchRepository.findByJobDescriptionId(jobId);
    }
}