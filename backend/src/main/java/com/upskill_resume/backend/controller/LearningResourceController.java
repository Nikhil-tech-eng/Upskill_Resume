package com.upskill_resume.backend.controller;

import com.upskill_resume.backend.entity.LearningResource;
import com.upskill_resume.backend.service.LearningResourceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.upskill_resume.backend.dto.LearningResourceRequest;

import java.util.List;

@RestController
@RequestMapping("/api/resources")
@CrossOrigin(origins = "http://localhost:5173")
public class LearningResourceController {

    private final LearningResourceService resourceService;

    public LearningResourceController(
            LearningResourceService resourceService) {
        this.resourceService = resourceService;
    }

    @PostMapping
    public ResponseEntity<LearningResource> createResource(
        @RequestBody LearningResourceRequest request) {

    return ResponseEntity.ok(
            resourceService.saveResource(
                    request.getSkill(),
                    request.getTitle(),
                    request.getDescription(),
                    request.getUrl()
            )
    );
    }

    @GetMapping
    public ResponseEntity<List<LearningResource>> getAllResources() {

        return ResponseEntity.ok(
                resourceService.getAllResources()
        );
    }

    @GetMapping("/skill/{skill}")
    public ResponseEntity<List<LearningResource>> getBySkill(
            @PathVariable String skill) {

        return ResponseEntity.ok(
                resourceService.getResourcesBySkill(skill)
        );
    }
}