package com.upskill_resume.backend.service;

import com.upskill_resume.backend.entity.LearningResource;
import com.upskill_resume.backend.repository.LearningResourceRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LearningResourceService {

    private final LearningResourceRepository repository;

    public LearningResourceService(
            LearningResourceRepository repository) {
        this.repository = repository;
    }

    @PostConstruct
    public void initDefaultResources() {
        if (repository.count() == 0) {
            saveResource("Java", "Java Official Documentation & Tutorials", "Master Core Java, object-oriented programming, streams, and concurrency from Oracle's official guide.", "https://docs.oracle.com/en/java/");
            saveResource("Java", "Java Programming Masterclass", "Comprehensive Java programming tutorial covering modern Java features, OOP design patterns, and JVM fundamentals.", "https://dev.java/learn/");
            saveResource("Spring Boot", "Spring Boot Official Guides", "Learn how to build production-grade Spring Boot REST APIs, microservices, and security with Spring Framework.", "https://spring.io/guides");
            saveResource("Spring Boot", "Spring Framework & Boot Tutorials", "Step-by-step documentation for Spring Data JPA, Spring Security, and dependency injection.", "https://spring.io/projects/spring-boot");
            saveResource("React", "React Official Documentation & Interactive Tutorial", "Learn modern React with Hooks, state management, components, and performance optimization techniques.", "https://react.dev/learn");
            saveResource("React", "React Developer Roadmap & Best Practices", "Comprehensive guide to mastering React, Next.js, component architecture, and frontend engineering.", "https://react.dev/");
            saveResource("Docker", "Docker Official Getting Started Guide", "Master containerization, Dockerfiles, multi-container applications with Docker Compose, and image management.", "https://docs.docker.com/get-started/");
            saveResource("Docker", "Docker Architecture & Container Best Practices", "Learn container isolated environments, networking, storage volumes, and deployment workflows.", "https://docs.docker.com/");
            saveResource("Kubernetes", "Kubernetes Official Documentation & Basics", "Production-grade container orchestration. Learn Pods, Deployments, Services, ConfigMaps, and cluster management.", "https://kubernetes.io/docs/tutorials/kubernetes-basics/");
            saveResource("AWS", "AWS Fundamentals & Cloud Practitioner Guide", "Learn core Amazon Web Services including EC2, S3, RDS, Lambda, IAM, and cloud architecture patterns.", "https://aws.amazon.com/getting-started/");
            saveResource("Python", "Python 3 Official Documentation & Tutorial", "Master Python syntax, data structures, object-oriented programming, standard libraries, and scripts.", "https://docs.python.org/3/tutorial/");
            saveResource("SQL", "W3Schools SQL Tutorial & Practice Studio", "Interactive SQL guide covering SELECT queries, JOINs, indexing, database design, and normalization.", "https://www.w3schools.com/sql/");
            saveResource("SQL", "PostgreSQL Official Documentation & Manual", "Deep dive into relational databases, ACID transactions, complex queries, and query performance tuning.", "https://www.postgresql.org/docs/");
            saveResource("TypeScript", "TypeScript Official Handbook & Guide", "Learn strongly-typed JavaScript, interfaces, generics, type inference, and modern ESNext features.", "https://www.typescriptlang.org/docs/");
            saveResource("System Design", "System Design Primer by Donne Martin", "Open-source guide to designing large-scale distributed systems, load balancing, caching, and database sharding.", "https://github.com/donnemartin/system-design-primer");
            saveResource("Microservices", "Microservices Architecture Patterns & Design", "Learn microservice communication patterns, API Gateways, service discovery, and fault tolerance.", "https://microservices.io/");
            saveResource("CI/CD", "GitHub Actions & CI/CD Pipelines Guide", "Automate build, test, and deployment pipelines using GitHub Actions, continuous integration, and continuous delivery.", "https://docs.github.com/en/actions");
        }
    }

    public LearningResource saveResource(
            String skill,
            String title,
            String description,
            String url) {

        LearningResource resource = new LearningResource();

        resource.setSkill(skill);
        resource.setTitle(title);
        resource.setDescription(description);
        resource.setUrl(url);

        return repository.save(resource);
    }

    public List<LearningResource> getResourcesBySkill(String skill) {
        if (skill == null || skill.trim().isEmpty()) {
            return repository.findAll();
        }
        List<LearningResource> list = repository.findBySkillContainingIgnoreCase(skill.trim());
        if (list.isEmpty()) {
            list = repository.findBySkillIgnoreCase(skill.trim());
        }
        return list;
    }

    public List<LearningResource> getAllResources() {
        return repository.findAll();
    }
}