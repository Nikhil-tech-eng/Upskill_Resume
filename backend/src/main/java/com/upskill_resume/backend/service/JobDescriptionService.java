package com.upskill_resume.backend.service;

import com.upskill_resume.backend.entity.JobDescription;
import com.upskill_resume.backend.repository.JobDescriptionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JobDescriptionService {

    private final JobDescriptionRepository repository;

    public JobDescriptionService(JobDescriptionRepository repository) {
        this.repository = repository;
    }

    public JobDescription createJobDescription(
            String title,
            String description) {

        JobDescription job = new JobDescription(title, description);

        return repository.save(job);
    }

    public List<JobDescription> getAllJobDescriptions() {
        return repository.findAll();
    }

    public JobDescription getJobDescription(Long id) {
        return repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Job description not found"));
    }
}