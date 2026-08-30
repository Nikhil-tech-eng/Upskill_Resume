package com.upskill_resume.backend.controller;

import com.upskill_resume.backend.entity.InterviewQuestion;
import com.upskill_resume.backend.entity.Resume;
import com.upskill_resume.backend.service.InterviewQuestionService;
import com.upskill_resume.backend.service.ResumeService;
import com.upskill_resume.backend.service.GeminiService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/interview")
@CrossOrigin(origins = "http://localhost:5173")
public class InterviewQuestionController {

    private final InterviewQuestionService questionService;
    private final ResumeService resumeService;
    private final GeminiService geminiService;

    public InterviewQuestionController(
            InterviewQuestionService questionService,
            ResumeService resumeService,
            GeminiService geminiService) {

        this.questionService = questionService;
        this.resumeService = resumeService;
        this.geminiService = geminiService;
    }

    @PostMapping("/generate/{resumeId}")
    public ResponseEntity<String> generateQuestions(
            @PathVariable Long resumeId,
            Authentication authentication) {

        String email = authentication.getName();
        Long userId = resumeService.getUserIdByEmail(email);

        Resume resume = resumeService.getResumeByIdAndUser(resumeId, userId);

        String questions = geminiService.generateInterviewQuestions(
                resume.getExtractedText()
        );

        return ResponseEntity.ok(questions);
    }

    @GetMapping("/{resumeId}")
    public ResponseEntity<List<InterviewQuestion>> getQuestions(
            @PathVariable Long resumeId,
            Authentication authentication) {

        String email = authentication.getName();
        Long userId = resumeService.getUserIdByEmail(email);

        resumeService.getResumeByIdAndUser(resumeId, userId);

        return ResponseEntity.ok(
                questionService.getQuestions(resumeId)
        );
    }
}