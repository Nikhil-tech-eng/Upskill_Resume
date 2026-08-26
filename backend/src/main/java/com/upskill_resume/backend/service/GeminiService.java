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

                        Return ONLY valid JSON in exactly this format:

                        {
                        "atsScore": 72,
                        "skills": "Java, Python, Spring Boot",
                        "missingSkills": "JUnit, Mockito, Hibernate",
                        "suggestions": "Add measurable achievements and relevant links.",
                        "summary": "Strong entry-level backend developer profile."
                        }

                        Rules:
                        - atsScore must be a number from 0 to 100.
                        - skills must contain detected technical skills.
                        - missingSkills must contain missing or improvable skills.
                        - suggestions must contain practical resume improvement suggestions.
                        - summary must contain a short overall summary.
                        - Return ONLY JSON.
                        - Do not use markdown.
                        - Do not use ```.

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

                Return ONLY valid JSON in exactly this format:

                {
                "matchScore": 78,
                "matchedSkills": "Java, Spring Boot, REST APIs, PostgreSQL",
                "missingSkills": "JPA, Hibernate, JUnit, Mockito, Microservices",
                "recommendations": "Add JPA and Hibernate experience and include testing frameworks."
                }

                Rules:
                - matchScore must be a number from 0 to 100.
                - matchedSkills must contain skills present in both the resume and job description.
                - missingSkills must contain important job requirements missing from the resume.
                - recommendations must contain practical recommendations.
                - Return ONLY JSON.
                - Do not use markdown.
                - Do not use ```.

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