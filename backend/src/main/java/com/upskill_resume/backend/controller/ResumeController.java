package com.upskill_resume.backend.controller;

import com.upskill_resume.backend.entity.Resume;
import com.upskill_resume.backend.service.GeminiService;
import com.upskill_resume.backend.service.ResumeParserService;
import com.upskill_resume.backend.service.ResumeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.MediaType;
import com.upskill_resume.backend.entity.ResumeAnalysis;
import com.upskill_resume.backend.service.ResumeAnalysisService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.security.core.Authentication;

import java.util.List;

@RestController
@RequestMapping("/api/resumes")
@CrossOrigin(origins = "http://localhost:5173")
public class ResumeController {

    private final ResumeService resumeService;
    private final ResumeParserService resumeParserService;
    private final GeminiService geminiService;
    private final ResumeAnalysisService resumeAnalysisService;

    public ResumeController(
        ResumeService resumeService,
        ResumeParserService resumeParserService,
        GeminiService geminiService,
        ResumeAnalysisService resumeAnalysisService) {

    this.resumeService = resumeService;
    this.resumeParserService = resumeParserService;
    this.geminiService = geminiService;
    this.resumeAnalysisService = resumeAnalysisService;
}

        @PostMapping(
            value = "/upload",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<Resume> uploadResume(
            @RequestParam("file") MultipartFile file,
            Authentication authentication) throws Exception {

        String email = authentication.getName();

        String extractedText = resumeParserService.extractText(file);

        Resume resume = resumeService.saveResume(
                file.getOriginalFilename(),
                extractedText,
                resumeService.getUserIdByEmail(email)
        );

        return ResponseEntity.ok(resume);
    }

    @GetMapping("/my")
    public ResponseEntity<List<Resume>> getMyResumes(
        Authentication authentication) {

    String email = authentication.getName();

    Long userId = resumeService.getUserIdByEmail(email);

    return ResponseEntity.ok(
            resumeService.getUserResumes(userId)
    );
    }

        @PostMapping("/analyze/{resumeId}")
    public ResponseEntity<ResumeAnalysis> analyzeResume(
        @PathVariable Long resumeId,
        Authentication authentication) {

    String email = authentication.getName();

    Long userId = resumeService.getUserIdByEmail(email);

    Resume resume = resumeService.getResumeByIdAndUser(
            resumeId,
            userId
    );

    String result = geminiService.analyzeResume(
            resume.getExtractedText()
    );

    try {
        ObjectMapper objectMapper = new ObjectMapper();

        JsonNode json = objectMapper.readTree(result);

        Integer atsScore = json.get("atsScore").asInt();
        String skills = json.get("skills").asText();
        String missingSkills = json.get("missingSkills").asText();
        String suggestions = json.get("suggestions").asText();
        String summary = json.get("summary").asText();

        ResumeAnalysis analysis = resumeAnalysisService.saveAnalysis(
                resume,
                atsScore,
                skills,
                missingSkills,
                suggestions,
                summary
        );

        return ResponseEntity.ok(analysis);

    } catch (Exception e) {
        return ResponseEntity.internalServerError().build();
    }
    }

    @GetMapping("/analysis/{resumeId}")
    public ResponseEntity<ResumeAnalysis> getAnalysis(
        @PathVariable Long resumeId) {

    return ResponseEntity.ok(
            resumeAnalysisService.getAnalysis(resumeId)
    );
    }

}