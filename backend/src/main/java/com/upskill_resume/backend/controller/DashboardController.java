package com.upskill_resume.backend.controller;

import com.upskill_resume.backend.dto.DashboardDTO;
import com.upskill_resume.backend.entity.Resume;
import com.upskill_resume.backend.entity.ResumeAnalysis;
import com.upskill_resume.backend.entity.User;
import com.upskill_resume.backend.repository.ResumeAnalysisRepository;
import com.upskill_resume.backend.repository.ResumeRepository;
import com.upskill_resume.backend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:5173")
public class DashboardController {

    private final UserRepository userRepository;
    private final ResumeRepository resumeRepository;
    private final ResumeAnalysisRepository resumeAnalysisRepository;

    public DashboardController(
            UserRepository userRepository,
            ResumeRepository resumeRepository,
            ResumeAnalysisRepository resumeAnalysisRepository) {
        this.userRepository = userRepository;
        this.resumeRepository = resumeRepository;
        this.resumeAnalysisRepository = resumeAnalysisRepository;
    }

    @GetMapping
    public ResponseEntity<DashboardDTO> getUserDashboard(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Resume> userResumes = resumeRepository.findByUserId(user.getId());

        List<DashboardDTO.ResumeItemDTO> resumeItems = new ArrayList<>();
        DashboardDTO.LatestAnalysisDTO latestAnalysisDTO = null;

        for (int i = userResumes.size() - 1; i >= 0; i--) {
            Resume resume = userResumes.get(i);
            Optional<ResumeAnalysis> analysisOpt = resumeAnalysisRepository.findByResumeId(resume.getId());

            boolean hasAnalysis = analysisOpt.isPresent();
            resumeItems.add(0, new DashboardDTO.ResumeItemDTO(resume.getFileName(), hasAnalysis));

            if (latestAnalysisDTO == null && hasAnalysis) {
                ResumeAnalysis analysis = analysisOpt.get();
                latestAnalysisDTO = new DashboardDTO.LatestAnalysisDTO(
                        resume.getFileName(),
                        analysis.getAtsScore(),
                        analysis.getSkills(),
                        analysis.getMissingSkills(),
                        analysis.getSuggestions(),
                        analysis.getSummary()
                );
            }
        }

        DashboardDTO dashboard = new DashboardDTO(
                user.getName(),
                user.getEmail(),
                userResumes.size(),
                resumeItems,
                latestAnalysisDTO
        );

        return ResponseEntity.ok(dashboard);
    }
}
