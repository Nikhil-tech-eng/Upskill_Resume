package com.upskill_resume.backend.service;

import com.upskill_resume.backend.entity.Resume;
import com.upskill_resume.backend.entity.User;
import com.upskill_resume.backend.repository.ResumeRepository;
import com.upskill_resume.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ResumeService {

    private final ResumeRepository resumeRepository;
    private final UserRepository userRepository;

    public ResumeService(ResumeRepository resumeRepository,
                        UserRepository userRepository) {
        this.resumeRepository = resumeRepository;
        this.userRepository = userRepository;
    }

    public Resume saveResume(String fileName, String extractedText, Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Resume resume = new Resume(fileName, extractedText, user);

        return resumeRepository.save(resume);
    }

    public List<Resume> getUserResumes(Long userId) {
        return resumeRepository.findByUserId(userId);
    }

    public Resume getResumeById(Long resumeId) {

    return resumeRepository.findById(resumeId)
            .orElseThrow(() -> new RuntimeException("Resume not found"));
    }
}