package com.upskill_resume.backend.service;

import com.upskill_resume.backend.entity.LearningResource;
import com.upskill_resume.backend.repository.LearningResourceRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LearningResourceService {

    private final LearningResourceRepository repository;

    public LearningResourceService(
            LearningResourceRepository repository) {
        this.repository = repository;
    }

    public LearningResource saveResource(
            String skill,
            String title,
            String description,
            String url) {

        LearningResource resource = new LearningResource();

        resource.setSkill(skill);
        resource.setTitle(title);
        resource.setDescription(description);
        resource.setUrl(url);

        return repository.save(resource);
    }

    public List<LearningResource> getResourcesBySkill(String skill) {
        return repository.findBySkillIgnoreCase(skill);
    }

    public List<LearningResource> getAllResources() {
        return repository.findAll();
    }
}