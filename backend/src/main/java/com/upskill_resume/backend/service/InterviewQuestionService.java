package com.upskill_resume.backend.service;

import com.upskill_resume.backend.entity.InterviewQuestion;
import com.upskill_resume.backend.entity.Resume;
import com.upskill_resume.backend.repository.InterviewQuestionRepository;
import com.upskill_resume.backend.repository.ResumeRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InterviewQuestionService {

    private final InterviewQuestionRepository questionRepository;
    private final ResumeRepository resumeRepository;

    public InterviewQuestionService(
            InterviewQuestionRepository questionRepository,
            ResumeRepository resumeRepository) {

        this.questionRepository = questionRepository;
        this.resumeRepository = resumeRepository;
    }

    public InterviewQuestion saveQuestion(
            Long resumeId,
            String question,
            String answer) {

        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() ->
                        new RuntimeException("Resume not found"));

        InterviewQuestion interviewQuestion = new InterviewQuestion();

        interviewQuestion.setResume(resume);
        interviewQuestion.setQuestion(question);
        interviewQuestion.setAnswer(answer);

        return questionRepository.save(interviewQuestion);
    }

    public List<InterviewQuestion> getQuestions(Long resumeId) {
        return questionRepository.findByResumeId(resumeId);
    }
}