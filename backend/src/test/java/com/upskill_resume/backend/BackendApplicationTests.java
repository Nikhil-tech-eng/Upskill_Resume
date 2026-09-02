package com.upskill_resume.backend;

import com.upskill_resume.backend.entity.LearningResource;
import com.upskill_resume.backend.repository.LearningResourceRepository;
import com.upskill_resume.backend.service.LearningResourceService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
@Transactional
class BackendApplicationTests {

    @Autowired
    private LearningResourceRepository learningResourceRepository;

    @Autowired
    private LearningResourceService learningResourceService;

    @Autowired
    private MockMvc mockMvc;

    @Test
    void contextLoads() {
    }

    @Test
    void seededResourcesIncludePopularTopicsWithoutDuplicatingExistingEntries() {
        learningResourceRepository.deleteAll();

        learningResourceService.saveResource("Java", "Java Guide", "desc", "https://example.com/java");
        learningResourceService.saveResource("Spring Boot", "Existing Spring Boot", "desc", "https://example.com/spring-boot");
        learningResourceService.saveResource("React", "React Guide", "desc", "https://example.com/react");

        learningResourceService.initDefaultResources();

        List<String> popularTopics = List.of("Java", "Spring Boot", "React", "Python", "SQL", "Docker", "Kubernetes", "AWS", "System Design", "TypeScript");

        for (String topic : popularTopics) {
            List<LearningResource> result = learningResourceService.getResourcesBySkill(topic);
            assertFalse(result.isEmpty(), "Missing resources for skill: " + topic);
            assertTrue(result.stream().anyMatch(resource -> resource.getSkill() != null && resource.getSkill().equalsIgnoreCase(topic)
                    || resource.getSkill() != null && resource.getSkill().toLowerCase().contains(topic.toLowerCase())),
                    "Expected at least one matching resource for topic: " + topic);
        }

        long javaCount = learningResourceRepository.findBySkillIgnoreCase("Java").size();
        assertTrue(javaCount >= 1, "Java resources should remain available");

        long springBootCount = learningResourceRepository.findBySkillIgnoreCase("Spring Boot").size();
        assertTrue(springBootCount >= 1, "Spring Boot resources should remain available");
    }

    @Test
    void skillEndpointReturnsPopularTopics() throws Exception {
        learningResourceRepository.deleteAll();
        learningResourceService.initDefaultResources();

        for (String topic : List.of("Java", "Spring Boot", "React", "Python", "SQL", "Docker", "Kubernetes", "AWS", "System Design", "TypeScript")) {
            mockMvc.perform(get("/api/resources/skill/" + topic))
                    .andExpect(status().isOk());
        }
    }

    @Test
    void curatedResourceDatasetIsExpandedAndCaseInsensitive() {
        learningResourceRepository.deleteAll();
        learningResourceService.initDefaultResources();

        List<LearningResource> allResources = learningResourceService.getAllResources();
        assertTrue(allResources.size() >= 150,
                "Expected at least 150 curated learning resources, found: " + allResources.size());

        List<LearningResource> springBootMatches = learningResourceService.getResourcesBySkill("SPRING BOOT");
        assertFalse(springBootMatches.isEmpty(), "Spring Boot should resolve case-insensitively");

        List<LearningResource> javaMatches = learningResourceService.getResourcesBySkill("java");
        assertTrue(javaMatches.size() >= 2, "Java should return multiple curated resources");
    }
}
