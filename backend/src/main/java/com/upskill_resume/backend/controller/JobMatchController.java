        package com.upskill_resume.backend.controller;

        import com.fasterxml.jackson.databind.JsonNode;
        import com.fasterxml.jackson.databind.ObjectMapper;
        import com.upskill_resume.backend.entity.JobDescription;
        import com.upskill_resume.backend.entity.JobMatch;
        import com.upskill_resume.backend.entity.Resume;
        import com.upskill_resume.backend.service.GeminiService;
        import com.upskill_resume.backend.service.JobDescriptionService;
        import com.upskill_resume.backend.service.JobMatchService;
        import com.upskill_resume.backend.service.ResumeService;
        import org.springframework.http.ResponseEntity;
        import org.springframework.web.bind.annotation.*;

        import java.util.List;

        @RestController
        @RequestMapping("/api/matches")
        @CrossOrigin(origins = "http://localhost:5173")
        public class JobMatchController {

        private final JobMatchService jobMatchService;
        private final ResumeService resumeService;
        private final JobDescriptionService jobDescriptionService;
        private final GeminiService geminiService;

        public JobMatchController(
                JobMatchService jobMatchService,
                ResumeService resumeService,
                JobDescriptionService jobDescriptionService,
                GeminiService geminiService) {

        this.jobMatchService = jobMatchService;
        this.resumeService = resumeService;
        this.jobDescriptionService = jobDescriptionService;
        this.geminiService = geminiService;
        }

        @GetMapping("/resume/{resumeId}")
        public ResponseEntity<List<JobMatch>> getMatchesByResume(
                @PathVariable Long resumeId) {

        return ResponseEntity.ok(
                jobMatchService.getMatchesByResume(resumeId)
        );
        }

        @GetMapping("/job/{jobId}")
        public ResponseEntity<List<JobMatch>> getMatchesByJob(
                @PathVariable Long jobId) {

        return ResponseEntity.ok(
                jobMatchService.getMatchesByJob(jobId)
        );
        }

        @PostMapping("/{resumeId}/{jobId}")
        public ResponseEntity<JobMatch> matchResume(
                @PathVariable Long resumeId,
                @PathVariable Long jobId) {

        Resume resume = resumeService.getResumeById(resumeId);

        JobDescription job =
                jobDescriptionService.getJobDescription(jobId);

        String result = geminiService.matchResumeWithJob(
                resume.getExtractedText(),
                job.getDescription()
        );

        try {
                ObjectMapper objectMapper = new ObjectMapper();
                JsonNode json = objectMapper.readTree(result);

                Integer matchScore = json.get("matchScore").asInt();
                String matchedSkills = json.get("matchedSkills").asText();
                String missingSkills = json.get("missingSkills").asText();
                String recommendations = json.get("recommendations").asText();

                JobMatch match = jobMatchService.saveMatch(
                        resumeId,
                        jobId,
                        matchScore,
                        matchedSkills,
                        missingSkills,
                        recommendations
                );

                return ResponseEntity.ok(match);

        } catch (Exception e) {
                return ResponseEntity.internalServerError().build();
        }
        }
        }