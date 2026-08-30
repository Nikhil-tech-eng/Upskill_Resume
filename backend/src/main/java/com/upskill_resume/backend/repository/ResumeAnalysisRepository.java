package com.upskill_resume.backend.repository;

import com.upskill_resume.backend.entity.ResumeAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ResumeAnalysisRepository
        extends JpaRepository<ResumeAnalysis, Long> {

    Optional<ResumeAnalysis> findByResumeId(Long resumeId);
    
    @Query("SELECT AVG(ra.atsScore) FROM ResumeAnalysis ra WHERE ra.atsScore IS NOT NULL")
    Double findAverageAtsScore();
    
    @Query("SELECT ra.missingSkills FROM ResumeAnalysis ra WHERE ra.missingSkills IS NOT NULL AND ra.missingSkills <> ''")
    List<String> findAllMissingSkills();
}