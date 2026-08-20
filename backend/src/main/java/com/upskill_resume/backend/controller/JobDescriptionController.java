package com.upskill_resume.backend.controller;

import com.upskill_resume.backend.entity.JobDescription;
import com.upskill_resume.backend.service.JobDescriptionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.upskill_resume.backend.dto.JobDescriptionRequest;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(origins = "http://localhost:5173")
public class JobDescriptionController {

    private final JobDescriptionService jobDescriptionService;

    public JobDescriptionController(
            JobDescriptionService jobDescriptionService) {
        this.jobDescriptionService = jobDescriptionService;
    }

    @PostMapping
    public ResponseEntity<JobDescription> createJob(
        @RequestBody JobDescriptionRequest request) {

    return ResponseEntity.ok(
            jobDescriptionService.createJobDescription(
                    request.getTitle(),
                    request.getDescription()
            )
    );
    }

    @GetMapping
    public ResponseEntity<List<JobDescription>> getAllJobs() {

        return ResponseEntity.ok(
                jobDescriptionService.getAllJobDescriptions()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobDescription> getJob(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                jobDescriptionService.getJobDescription(id)
        );
    }
}