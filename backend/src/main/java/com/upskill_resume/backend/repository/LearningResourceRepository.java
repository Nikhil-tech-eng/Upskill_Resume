package com.upskill_resume.backend.repository;

import com.upskill_resume.backend.entity.LearningResource;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LearningResourceRepository
        extends JpaRepository<LearningResource, Long> {

    List<LearningResource> findBySkillIgnoreCase(String skill);
}