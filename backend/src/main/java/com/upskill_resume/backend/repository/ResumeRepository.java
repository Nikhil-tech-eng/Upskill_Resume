package com.upskill_resume.backend.repository;

import com.upskill_resume.backend.entity.Resume;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public interface ResumeRepository extends JpaRepository<Resume, Long> {

    List<Resume> findByUserId(Long userId);

    List<Resume> findByCreatedAtIsNotNullAndCreatedAtBefore(LocalDateTime threshold);
    
    @Query(value = "SELECT DATE(created_at) as date, COUNT(*) as count FROM resumes WHERE created_at >= CURRENT_DATE - INTERVAL '30 days' GROUP BY DATE(created_at) ORDER BY date DESC", nativeQuery = true)
    List<Map<String, Object>> findResumesLast30Days();
}