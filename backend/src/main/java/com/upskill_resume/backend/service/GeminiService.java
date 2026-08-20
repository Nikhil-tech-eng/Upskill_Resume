package com.upskill_resume.backend.service;

import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class GeminiService {

        private final Client client;

        public GeminiService(@Value("${gemini.api.key}") String apiKey) {
        this.client = Client.builder()
                .apiKey(apiKey)
                .build();
        }

        public String analyzeResume(String resumeText) {

        String prompt = """
                Analyze the following resume.

                Return:
                1. ATS score out of 100
                2. Detected technical skills
                3. Missing/improvable skills
                4. Resume improvement suggestions
                5. Overall summary

                Keep the response concise and structured.

                Resume:
                %s
                """.formatted(resumeText);

        GenerateContentResponse response =
                client.models.generateContent(
                        "gemini-3.6-flash",
                        prompt,
                        null
                );

        return response.text();
        }

        public String matchResumeWithJob(
        String resumeText,
        String jobDescription) {

        String prompt = """
                Compare the following resume with the job description.
                Return:
                1. Match score out of 100
                2. Matching skills
                3. Missing skills
                4. Recommendations

                Keep the response concise and structured.

                RESUME:
                %s

                JOB DESCRIPTION:
                %s
                """.formatted(resumeText, jobDescription);

        GenerateContentResponse response =
                client.models.generateContent(
                        "gemini-3.6-flash",
                        prompt,
                        null
                );

        return response.text();
}

        public String generateInterviewQuestions(String resumeText) {

        String prompt = """
                Generate 10 interview questions based on this resume.

                Include:
                1. Technical questions
                2. Project-based questions
                3. Java/Spring Boot questions
                4. Behavioral questions

                Return only the questions as a numbered list.

                RESUME:
                %s
                """.formatted(resumeText);

        GenerateContentResponse response =
                client.models.generateContent(
                        "gemini-3.6-flash",
                        prompt,
                        null
                );

        return response.text();
        }

}