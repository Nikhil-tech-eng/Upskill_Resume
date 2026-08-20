package com.upskill_resume.backend.repository;

import com.upskill_resume.backend.entity.JobMatch;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JobMatchRepository extends JpaRepository<JobMatch, Long> {

    List<JobMatch> findByResumeId(Long resumeId);

    List<JobMatch> findByJobDescriptionId(Long jobId);
}