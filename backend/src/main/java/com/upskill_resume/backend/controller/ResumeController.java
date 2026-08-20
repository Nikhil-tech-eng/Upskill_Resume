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
        @RequestParam("userId") Long userId) throws Exception {

    String extractedText = resumeParserService.extractText(file);

    Resume resume = resumeService.saveResume(
            file.getOriginalFilename(),
            extractedText,
            userId
    );

    return ResponseEntity.ok(resume);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Resume>> getUserResumes(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                resumeService.getUserResumes(userId)
        );
    }

    @PostMapping("/analyze/{resumeId}")
    public ResponseEntity<ResumeAnalysis> analyzeResume(
        @PathVariable Long resumeId) {

    Resume resume = resumeService.getResumeById(resumeId);

    String result = geminiService.analyzeResume(
            resume.getExtractedText()
    );

    ResumeAnalysis analysis = resumeAnalysisService.saveAnalysis(
            resume,
            null,
            result,
            "",
            "",
            result
    );

    return ResponseEntity.ok(analysis);
    }

    @GetMapping("/analysis/{resumeId}")
    public ResponseEntity<ResumeAnalysis> getAnalysis(
        @PathVariable Long resumeId) {

    return ResponseEntity.ok(
            resumeAnalysisService.getAnalysis(resumeId)
    );
    }

}