package com.upskill_resume.backend.service;

import com.upskill_resume.backend.entity.Resume;
import com.upskill_resume.backend.entity.ResumeAnalysis;
import com.upskill_resume.backend.repository.ResumeAnalysisRepository;
import org.springframework.stereotype.Service;

@Service
public class ResumeAnalysisService {

    private final ResumeAnalysisRepository analysisRepository;

    public ResumeAnalysisService(ResumeAnalysisRepository analysisRepository) {
        this.analysisRepository = analysisRepository;
    }

    public ResumeAnalysis saveAnalysis(
            Resume resume,
            Integer atsScore,
            String skills,
            String missingSkills,
            String suggestions,
            String summary) {

        ResumeAnalysis analysis = analysisRepository
                .findByResumeId(resume.getId())
                .orElse(new ResumeAnalysis());

        analysis.setResume(resume);
        analysis.setAtsScore(atsScore);
        analysis.setSkills(skills);
        analysis.setMissingSkills(missingSkills);
        analysis.setSuggestions(suggestions);
        analysis.setSummary(summary);

        return analysisRepository.save(analysis);
    }

    public ResumeAnalysis getAnalysis(Long resumeId) {

        return analysisRepository.findByResumeId(resumeId)
                .orElseThrow(() ->
                        new RuntimeException("Analysis not found"));
    }
}