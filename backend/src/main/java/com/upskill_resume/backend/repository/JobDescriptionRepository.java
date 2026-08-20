package com.upskill_resume.backend.repository;

import com.upskill_resume.backend.entity.JobDescription;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JobDescriptionRepository
        extends JpaRepository<JobDescription, Long> {
}