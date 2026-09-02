package com.upskill_resume.backend.service;

import com.upskill_resume.backend.entity.LearningResource;
import com.upskill_resume.backend.repository.LearningResourceRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;

@Service
public class LearningResourceService {

    private record SeedResource(String skill, String title, String description, String url) {
    }

    private final LearningResourceRepository repository;

    public LearningResourceService(
            LearningResourceRepository repository) {
        this.repository = repository;
    }

    @PostConstruct
    public void initDefaultResources() {
        List<SeedResource> requiredResources = List.of(
                new SeedResource("Java", "Java SE Documentation", "Official Java platform documentation for language basics, collections, streams, concurrency, and JVM features.", "https://docs.oracle.com/en/java/javase/21/"),
                new SeedResource("Java", "Java Tutorials by Oracle", "Structured tutorials covering Java syntax, OOP, packages, exceptions, generics, and I/O.", "https://docs.oracle.com/javase/tutorial/"),
                new SeedResource("Java", "Java 21 Language Features", "Modern Java features, records, sealed types, virtual threads, and improvements in the platform.", "https://docs.oracle.com/en/java/javase/21/language/"),
                new SeedResource("Java", "Java Collections and Streams", "Deep dive into Java collections, streams, and functional programming idioms used in production code.", "https://docs.oracle.com/javase/8/docs/technotes/guides/collections/"),
                new SeedResource("Java", "Baeldung Java Guide", "Hands-on Java guides for concurrency, JPA, design patterns, testing, and backend engineering.", "https://www.baeldung.com/java"),
                new SeedResource("Java", "GeeksforGeeks Java Programming", "Popular Java learning articles for OOP, algorithms, data structures, and interview preparation.", "https://www.geeksforgeeks.org/java/"),
                new SeedResource("Java", "W3Schools Java Tutorial", "Beginner-friendly Java tutorial covering syntax, conditions, loops, classes, and methods.", "https://www.w3schools.com/java/"),
                new SeedResource("Java", "Java Programming Masterclass", "A long-form learning path focused on Java fundamentals and practical software building.", "https://www.udemy.com/course/java-the-complete-java-developer-course/"),
                new SeedResource("Spring Boot", "Spring Boot Reference Documentation", "The official guide to Spring Boot conventions, auto-configuration, embedded servers, and starters.", "https://docs.spring.io/spring-boot/docs/current/reference/html/"),
                new SeedResource("Spring Boot", "Spring Boot Getting Started", "Official quickstart for creating, configuring, and running Spring Boot applications.", "https://spring.io/guides/gs/spring-boot"),
                new SeedResource("Spring Boot", "Spring Guides", "Practical Spring tutorials on web apps, security, data access, messaging, and messaging patterns.", "https://spring.io/guides"),
                new SeedResource("Spring Boot", "Spring Initializr", "Generate Spring Boot projects with the exact dependencies needed for your application.", "https://start.spring.io/"),
                new SeedResource("Spring Boot", "Spring Security Reference", "Learn authentication, authorization, JWT, OAuth2, and security configuration in Spring apps.", "https://docs.spring.io/spring-security/reference/"),
                new SeedResource("Spring Boot", "Spring Data JPA Guide", "Use Spring Data to simplify persistence, repositories, transactions, and query development.", "https://spring.io/projects/spring-data-jpa"),
                new SeedResource("Spring Boot", "Spring Cloud Documentation", "Learn service discovery, configuration, API gateways, and distributed systems patterns for Spring Cloud.", "https://spring.io/projects/spring-cloud"),
                new SeedResource("React", "React Official Docs", "Official React documentation covering components, state, props, hooks, and rendering concepts.", "https://react.dev/learn"),
                new SeedResource("React", "React Beta Docs", "Updated guides and patterns for React development, including newer best practices and APIs.", "https://react.dev/blog/2023/03/16/introducing-react-dev"),
                new SeedResource("React", "React Router Documentation", "Learn client-side routing for multi-page React experiences and navigation flows.", "https://reactrouter.com/en/main/start/overview"),
                new SeedResource("React", "MDN React Guide", "Mozilla's practical React guide for developers moving from vanilla JavaScript to component-based UI.", "https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks/React_getting_started"),
                new SeedResource("React", "Official React Testing Library", "Test user interactions, rendering, and component behavior in a React app.", "https://testing-library.com/docs/react-testing-library/intro/"),
                new SeedResource("React", "FreeCodeCamp React Course", "Full beginner-to-advanced React learning path with practical examples and projects.", "https://www.freecodecamp.org/news/react-tutorial/"),
                new SeedResource("React", "The Modern React Tutorial", "A comprehensive guide to React fundamentals, hooks, and production patterns.", "https://www.robinwieruch.de/react-tutorial/"),
                new SeedResource("JavaScript", "MDN JavaScript Guide", "Authoritative JavaScript documentation for syntax, functions, DOM APIs, and browser features.", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide"),
                new SeedResource("JavaScript", "JavaScript.info", "Excellent, modern JavaScript tutorial covering fundamentals, async programming, and browser APIs.", "https://javascript.info/"),
                new SeedResource("JavaScript", "FreeCodeCamp JavaScript Curriculum", "Interactive JavaScript lessons and projects for beginners and intermediate developers.", "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/"),
                new SeedResource("JavaScript", "ES6 and Beyond Guide", "Learn modern JavaScript syntax, destructuring, modules, and tooling improvements.", "https://exploringjs.com/es6/"),
                new SeedResource("JavaScript", "Node.js JavaScript Docs", "JavaScript language and runtime docs relevant to server-side code and event-driven development.", "https://nodejs.org/en/learn"),
                new SeedResource("JavaScript", "MDN Async JavaScript", "Understand callbacks, promises, async/await, and browser event loops in depth.", "https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous"),
                new SeedResource("JavaScript", "JavaScript Design Patterns", "Explore common patterns used in real-world front-end architecture and maintainable code.", "https://addyosmani.com/resources/essentialjsdesignpatterns/book/"),
                new SeedResource("Python", "Python Official Tutorial", "Comprehensive Python documentation for syntax, data structures, modules, and packaging.", "https://docs.python.org/3/tutorial/"),
                new SeedResource("Python", "Real Python", "Practical Python tutorials on web development, APIs, automation, and data analysis.", "https://realpython.com/"),
                new SeedResource("Python", "Python for Everybody", "Free introductory Python course with exercises on basics, data structures, and scripting.", "https://www.py4e.com/"),
                new SeedResource("Python", "Automate the Boring Stuff", "Excellent guide to Python for automation, file handling, scripting, and workflows.", "https://automatetheboringstuff.com/"),
                new SeedResource("Python", "Official Python Docs", "The canonical reference for Python built-ins, modules, stdlib, and language semantics.", "https://docs.python.org/3/"),
                new SeedResource("Python", "Python Packaging Guide", "Learn how to package, distribute, and manage Python dependencies for real projects.", "https://packaging.python.org/en/latest/"),
                new SeedResource("Python", "Scikit-learn User Guide", "Learn ML fundamentals and model building in Python with a well-known library ecosystem.", "https://scikit-learn.org/stable/user_guide.html"),
                new SeedResource("SQL", "SQLBolt Tutorial", "Beginner-friendly SQL lessons on SELECTs, joins, filtering, grouping, and subqueries.", "https://sqlbolt.com/"),
                new SeedResource("SQL", "Mode SQL Tutorial", "Practical SQL course for analytics, business intelligence, and data querying.", "https://mode.com/sql-tutorial/"),
                new SeedResource("SQL", "W3Schools SQL Tutorial", "Clear tutorials for SQL basics, operators, joins, and database design concepts.", "https://www.w3schools.com/sql/"),
                new SeedResource("SQL", "SQLZoo", "Interactive SQL practice environment for learning queries, joins, and relational logic.", "https://sqlzoo.net/"),
                new SeedResource("SQL", "Learn SQL with Khan Academy", "Introductory SQL lessons focused on understanding query structure and data retrieval.", "https://www.khanacademy.org/computing/computer-programming/sql"),
                new SeedResource("SQL", "PostgreSQL Official Docs", "Deep dive into relational database design, SQL features, transactions, indexing, and optimization.", "https://www.postgresql.org/docs/current/"),
                new SeedResource("SQL", "Database Design Tutorial", "Fundamentals of normalized schema design and data modeling for OLTP systems.", "https://www.tutorialspoint.com/dbms/index.htm"),
                new SeedResource("PostgreSQL", "PostgreSQL Tutorial", "A practical PostgreSQL learning site for setup, queries, constraints, joins, and SQL patterns.", "https://www.postgresqltutorial.com/"),
                new SeedResource("PostgreSQL", "PostgreSQL Documentation", "Master PostgreSQL-specific features including indexing, JSONB, extensions, and performance.", "https://www.postgresql.org/docs/current/"),
                new SeedResource("PostgreSQL", "Postgres SQL Cheat Sheet", "Quick reference for common SQL patterns used in PostgreSQL development.", "https://www.postgresqltutorial.com/postgresql-cheat-sheet/"),
                new SeedResource("PostgreSQL", "PGAdmin Documentation", "Learn how to administer PostgreSQL databases, schemas, and sessions with PGAdmin.", "https://www.pgadmin.org/docs/pgadmin4/latest/"),
                new SeedResource("PostgreSQL", "Postgres vs MySQL Comparison", "Understand relational database trade-offs and when PostgreSQL is the right fit.", "https://www.postgresql.org/about/"),
                new SeedResource("Node.js", "Node.js Official Docs", "Learn about Node.js runtime, modules, npm, streams, networking, and event-driven programming.", "https://nodejs.org/en/learn"),
                new SeedResource("Node.js", "Node.js Developer Guide", "The canonical reference for building and deploying Node.js services and CLIs.", "https://nodejs.org/en/docs/guides/"),
                new SeedResource("Node.js", "Express.js Guide", "Build REST APIs with Express, middleware, routing, and request lifecycle understanding.", "https://expressjs.com/en/guide/routing.html"),
                new SeedResource("Node.js", "FreeCodeCamp Node Course", "Practical Node.js tutorials for backend development and real project building.", "https://www.freecodecamp.org/news/build-nodejs-rest-api/"),
                new SeedResource("Node.js", "Node School", "Interactive workshops for Node.js concepts, packages, streams, and asynchronous programming.", "https://nodeschool.io/"),
                new SeedResource("Node.js", "NPM Documentation", "Learn dependency management, semantic versioning, and package publishing with npm.", "https://docs.npmjs.com/"),
                new SeedResource("TypeScript", "TypeScript Handbook", "Official guide to types, interfaces, generics, control flow, and modern TypeScript patterns.", "https://www.typescriptlang.org/docs/handbook/intro.html"),
                new SeedResource("TypeScript", "TypeScript Deep Dive", "A comprehensive exploration of advanced TypeScript features and type design patterns.", "https://basarat.gitbook.io/typescript/"),
                new SeedResource("TypeScript", "TypeScript for React Developers", "Practical TypeScript guidance for building typed React applications and component APIs.", "https://www.typescriptlang.org/docs/handbook/react.html"),
                new SeedResource("TypeScript", "Official TS Playground", "Experiment with types, interfaces, and compile-time behavior in the browser.", "https://www.typescriptlang.org/play"),
                new SeedResource("TypeScript", "TypeScript Tutorial by TutorialsPoint", "Step-by-step TypeScript basics and intermediate patterns for real-world use.", "https://www.tutorialspoint.com/typescript/index.htm"),
                new SeedResource("TypeScript", "TypeScript Compiler Options", "Essential reference for TS configuration, strictness, module settings, and code quality.", "https://www.typescriptlang.org/tsconfig"),
                new SeedResource("HTML/CSS", "MDN HTML Guide", "Comprehensive HTML reference for structure, semantic markup, accessibility, and forms.", "https://developer.mozilla.org/en-US/docs/Learn/HTML"),
                new SeedResource("HTML/CSS", "MDN CSS Guide", "Learn CSS layout, responsive design, selectors, variables, and modern styling systems.", "https://developer.mozilla.org/en-US/docs/Learn/CSS"),
                new SeedResource("HTML/CSS", "W3Schools HTML Tutorial", "Intermediate beginner-friendly HTML and CSS lessons for building web pages.", "https://www.w3schools.com/html/"),
                new SeedResource("HTML/CSS", "W3Schools CSS Tutorial", "Useful CSS topics including flexbox, grid, animations, and responsiveness.", "https://www.w3schools.com/css/"),
                new SeedResource("HTML/CSS", "CSS-Tricks Guide", "High-quality articles and snippets covering modern CSS, layout, and component patterns.", "https://css-tricks.com/"),
                new SeedResource("HTML/CSS", "Responsive Web Design Basics", "Learn accessible, mobile-first design practices and flexible layouts.", "https://web.dev/learn/design/"),
                new SeedResource("Git", "Git Official Documentation", "The canonical guide to Git concepts, branching, merging, tags, and workflows.", "https://git-scm.com/doc"),
                new SeedResource("Git", "GitHub Docs", "Official GitHub learning resources covering repos, branches, pull requests, and workflows.", "https://docs.github.com/en/get-started"),
                new SeedResource("Git", "Atlassian Git Tutorial", "Clear explanations of version control, branching strategies, and collaboration workflows.", "https://www.atlassian.com/git/tutorials"),
                new SeedResource("GitHub", "GitHub Skills Lab", "Hands-on GitHub exercises for pull requests, issues, and collaborative engineering.", "https://skills.github.com/"),
                new SeedResource("GitHub", "GitHub Flow Guide", "Learn a lightweight branch-based workflow used by many teams in production.", "https://docs.github.com/en/get-started/quickstart/github-flow"),
                new SeedResource("Git/GitHub", "Pro Git Book", "Full free book on Git fundamentals, workflows, and advanced usage from the Git maintainers.", "https://git-scm.com/book/en/v2"),
                new SeedResource("Docker", "Docker Get Started", "Official onboarding to Docker containers, images, and basic orchestration via Compose.", "https://docs.docker.com/get-started/"),
                new SeedResource("Docker", "Dockerfile Reference", "Understand image layers, instructions, build context, and production image best practices.", "https://docs.docker.com/reference/dockerfile/"),
                new SeedResource("Docker", "Docker Compose Docs", "Define multi-container applications, volumes, networks, and service dependencies.", "https://docs.docker.com/compose/"),
                new SeedResource("Docker", "Docker Hub Official Docs", "Learn about public images, repositories, tags, and the image lifecycle.", "https://docs.docker.com/docker-hub/"),
                new SeedResource("Docker", "Play with Docker", "Hands-on container labs to practice and understand development workflows quickly.", "https://www.docker.com/play-with-docker/"),
                new SeedResource("Docker", "Containerization Guide", "Concepts behind containers, images, and how they change modern app delivery.", "https://training.play-with-docker.com/"),
                new SeedResource("Kubernetes", "Kubernetes Basics", "Official beginner tutorial on Pods, Deployments, Services, and rolling updates.", "https://kubernetes.io/docs/tutorials/kubernetes-basics/"),
                new SeedResource("Kubernetes", "Kubernetes Concepts", "Reference for workloads, networking, storage, configuration, and resource management.", "https://kubernetes.io/docs/concepts/"),
                new SeedResource("Kubernetes", "Kubernetes Tasks", "How-to docs for scaling, rolling updates, service discovery, and debugging workloads.", "https://kubernetes.io/docs/tasks/"),
                new SeedResource("Kubernetes", "Kubernetes Learning Path", "Structured materials for cluster operations, networking, and controllers.", "https://kubernetes.io/training/"),
                new SeedResource("Kubernetes", "Kind Quick Start", "Local Kubernetes cluster creation for developers building and testing microservice apps.", "https://kind.sigs.k8s.io/docs/user/quick-start/"),
                new SeedResource("AWS", "AWS Getting Started", "Official AWS onboarding for core services such as compute, storage, networking, and IAM.", "https://aws.amazon.com/getting-started/"),
                new SeedResource("AWS", "AWS Documentation", "Reference material covering compute, databases, security, containers, and cloud architecture.", "https://docs.aws.amazon.com/"),
                new SeedResource("AWS", "AWS Well-Architected Framework", "Learn AWS best practices for reliability, performance, cost, and operational excellence.", "https://docs.aws.amazon.com/wellarchitected/latest/framework/"),
                new SeedResource("AWS", "AWS Skill Builder", "Structured cloud learning for AWS services, certifications, and real-world cloud design.", "https://skillbuilder.aws/"),
                new SeedResource("AWS", "Cloud Academy AWS Guides", "Helpful cloud learning articles and architecture guidance for foundational cloud concepts.", "https://cloudacademy.com/library/aws/"),
                new SeedResource("Azure", "Microsoft Learn Azure", "Credentialed Azure learning path for compute, storage, networking, and identity services.", "https://learn.microsoft.com/en-us/training/azure/"),
                new SeedResource("Azure", "Azure Documentation", "Official Azure references for services, architecture, security, and deployment patterns.", "https://learn.microsoft.com/en-us/azure/"),
                new SeedResource("Azure", "Azure Fundamentals", "Core Azure concepts, cloud principles, and infrastructure basics for developers and architects.", "https://learn.microsoft.com/en-us/training/paths/azure-fundamentals/"),
                new SeedResource("Azure", "Azure Developer Guide", "Build apps on Azure using managed services, identity, APIs, and devops integrations.", "https://learn.microsoft.com/en-us/azure/developer/"),
                new SeedResource("REST API", "REST API Tutorial", "Learn REST constraints, HTTP methods, status codes, resource modeling, and API design patterns.", "https://restfulapi.net/"),
                new SeedResource("REST API", "MDN HTTP Overview", "Understand HTTP requests, headers, status codes, caching, and the request/response lifecycle.", "https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview"),
                new SeedResource("REST API", "HTTP Status Codes Guide", "Reference for common HTTP response codes and failure modes in API design.", "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status"),
                new SeedResource("REST API", "OpenAPI Specification", "Official spec for describing REST APIs, schemas, and contract-driven development.", "https://spec.openapis.org/oas/latest.html"),
                new SeedResource("REST API", "Postman Learning Center", "Hands-on learning for building, testing, and documenting REST APIs.", "https://learning.postman.com/docs/getting-started/introduction/"),
                new SeedResource("Microservices", "Microservices.io", "Architecture patterns, service decomposition, integration methods, and resilience patterns.", "https://microservices.io/"),
                new SeedResource("Microservices", "Microsoft Microservices Guide", "Official guidance for building loosely coupled services and scalable distributed workloads.", "https://learn.microsoft.com/en-us/azure/architecture/microservices/"),
                new SeedResource("Microservices", "Spring Cloud Overview", "Spring-based distributed systems guidance for service discovery, config, and gateway approaches.", "https://spring.io/projects/spring-cloud"),
                new SeedResource("System Design", "System Design Primer", "A well-known open-source guide for load balancing, caching, sharding, consistency, and scaling patterns.", "https://github.com/donnemartin/system-design-primer"),
                new SeedResource("System Design", "Grokking the System Design Interview", "Structured learning path for interview-driven system design and architecture thinking.", "https://www.educative.io/courses/grokking-the-system-design-interview"),
                new SeedResource("System Design", "High Scalability", "Real-world architecture case studies and distributed systems design discussions.", "https://highscalability.com/"),
                new SeedResource("System Design", "AWS Architecture Center", "Patterns for cloud-based systems, reliability, scaling, and service decomposition on AWS.", "https://aws.amazon.com/architecture/"),
                new SeedResource("DSA", "GeeksforGeeks Data Structures", "Comprehensive DSA coverage with explanations for arrays, trees, graphs, heaps, and algorithms.", "https://www.geeksforgeeks.org/data-structures/"),
                new SeedResource("DSA", "LeetCode Explore", "Practice common algorithmic patterns through guided problem sets and interview tracks.", "https://leetcode.com/explore/"),
                new SeedResource("DSA", "HackerRank Data Structures", "Exercises and tutorials covering arrays, linked lists, trees, and graph problem solving.", "https://www.hackerrank.com/domains/data-structures"),
                new SeedResource("DSA", "Big-O Cheat Sheet", "Quick reference for algorithmic complexity and trade-offs in DSA study.", "https://www.bigocheatsheet.com/"),
                new SeedResource("DSA", "Princeton Algorithms", "Classic algorithms course materials for sorting, graphs, hashing, and efficient data structures.", "https://algs4.cs.princeton.edu/"),
                new SeedResource("C/C++", "C Programming Tutorial", "Classic C language learning material on memory, pointers, and low-level programming.", "https://www.learn-c.org/"),
                new SeedResource("C/C++", "C++ Tutorial by cplusplus.com", "Friendly C++ intro covering syntax, classes, standard library, and object-oriented programming.", "https://cplusplus.com/doc/tutorial/"),
                new SeedResource("C/C++", "cppreference.com", "The definitive reference for the C++ standard library, language rules, and compiler features.", "https://en.cppreference.com/w/"),
                new SeedResource("C/C++", "LearnCpp.com", "High-quality C++ tutorials from novice to intermediate levels with modern examples.", "https://www.learncpp.com/"),
                new SeedResource("C/C++", "C Programming Language Docs", "The official C standard and language reference for deep technical understanding.", "https://en.wikipedia.org/wiki/C_(programming_language)"),
                new SeedResource("AI/ML", "Google Machine Learning Crash Course", "Friendly introduction to ML fundamentals, models, loss functions, and practical coding patterns.", "https://developers.google.com/machine-learning/crash-course"),
                new SeedResource("AI/ML", "Scikit-learn Tutorials", "Practical tutorials for supervised learning, clustering, and model evaluation in Python.", "https://scikit-learn.org/stable/tutorial/index.html"),
                new SeedResource("AI/ML", "PyTorch Tutorials", "Build ML models with PyTorch, covering training loops, neural networks, and optimization.", "https://pytorch.org/tutorials/"),
                new SeedResource("AI/ML", "TensorFlow Tutorials", "Official TensorFlow learning resources for deep learning and model development.", "https://www.tensorflow.org/tutorials"),
                new SeedResource("AI/ML", "Coursera ML Specialization", "Structured machine learning learning path by Andrew Ng and the Stanford online program.", "https://www.coursera.org/specializations/machine-learning-introduction"),
                new SeedResource("MongoDB", "MongoDB Manual", "Official MongoDB docs covering document models, queries, indexing, replication, and scaling.", "https://www.mongodb.com/docs/manual/"),
                new SeedResource("MongoDB", "MongoDB University", "Learning platform for modern NoSQL application development and database design.", "https://learn.mongodb.com/"),
                new SeedResource("Redis", "Redis Documentation", "Comprehensive guide to caching, pub/sub, data structures, and real-time application patterns.", "https://redis.io/docs/"),
                new SeedResource("Redis", "Try Redis", "Quick interactive examples and tutorials for working with Redis commands and data structures.", "https://try.redis.io/"),
                new SeedResource("CI/CD", "GitHub Actions Docs", "Automate build, test, and deployment pipelines using GitHub-hosted workflows.", "https://docs.github.com/en/actions"),
                new SeedResource("CI/CD", "GitLab CI/CD Docs", "Learn pipeline configuration, deployment processes, and integration flows in GitLab.", "https://docs.gitlab.com/ee/ci/"),
                new SeedResource("CI/CD", "CircleCI Docs", "Reference for continuous integration and delivery pipelines in cloud-based builds.", "https://circleci.com/docs/"),
                new SeedResource("HTML/CSS", "Flexbox Froggy", "Interactive game-based lesson designed to teach CSS flexbox layout visually.", "https://flexboxfroggy.com/"),
                new SeedResource("HTML/CSS", "Grid Garden", "Fun interactive CSS grid learning activity for layout and placement patterns.", "https://cssgridgarden.com/"),
                new SeedResource("JavaScript", "Exploring JS", "Modern JavaScript deep dives for modules, async patterns, and language features.", "https://exploringjs.com/"),
                new SeedResource("Python", "Python Module of the Week", "Short, practical examples showing Python library usage across common application tasks.", "https://pymotw.com/3/"),
                new SeedResource("Java", "Java Platform SE 21 API", "The official API docs for classes, packages, and JVM-provided functionality in Java 21.", "https://docs.oracle.com/en/java/javase/21/docs/api/"),
                new SeedResource("AWS", "AWS Lambda Developer Guide", "Learn serverless computing, event-driven workloads, and cloud-native application design.", "https://docs.aws.amazon.com/lambda/latest/dg/welcome.html"),
                new SeedResource("Azure", "Azure Architecture Center", "Production-ready architecture guidance for cloud-native and distributed application design on Azure.", "https://learn.microsoft.com/en-us/azure/architecture/"),
                new SeedResource("Kubernetes", "Helm Docs", "Learn packaging and deploying apps on Kubernetes with Helm charts and release management.", "https://helm.sh/docs/"),
                new SeedResource("Docker", "Docker Security Docs", "Learn image hardening, least privilege, and secure container deployment patterns.", "https://docs.docker.com/develop/security-best-practices/"),
                new SeedResource("GitHub", "GitHub CLI Docs", "Use GitHub from the terminal for version control, PRs, releases, and automation workflows.", "https://cli.github.com/manual/"),
                new SeedResource("React", "React Hooks Documentation", "Understand hooks, state management, effect patterns, and component lifecycle mental models.", "https://react.dev/reference/react"),
                new SeedResource("Spring Boot", "Spring Boot Actuator", "Learn health checks, metrics, endpoints, and production readiness for backend services.", "https://docs.spring.io/spring-boot/docs/current/reference/html/actuator.html"),
                new SeedResource("SQL", "PostgreSQL Query Performance", "Learn EXPLAIN plans, indexes, optimization, and database tuning for relational systems.", "https://www.postgresql.org/docs/current/performance-tips.html"),
                new SeedResource("REST API", "JSON API Best Practices", "Understand JSON payload design, versioning, documentation, and contract consistency.", "https://jsonapi.org/"),
                new SeedResource("System Design", "ByteByteGo System Design", "Short, practical architecture explainers for modern distributed systems and backend design.", "https://bytebytego.com/blog"),
                new SeedResource("DSA", "Visualgo", "Animated algorithm visualizations that help clarify data structures and common problem-solving patterns.", "https://visualgo.net/en"),
                new SeedResource("AI/ML", "Hugging Face Course", "Intro to NLP, transformers, model use, and practical AI workflows in Python.", "https://huggingface.co/learn"),
                new SeedResource("JavaScript", "Web.dev JavaScript Learning", "Modern browser development and JavaScript learning path for building real user interfaces.", "https://web.dev/learn/javascript/"),
                new SeedResource("Angular", "Angular Official Docs", "Learning resources for large-scale frontend application architecture and component-building patterns.", "https://angular.dev/"),
                new SeedResource("Vue", "Vue Official Guide", "Progressive framework learning path for reactive UI development and component composition.", "https://vuejs.org/guide/"),
                new SeedResource("Next.js", "Next.js Docs", "Framework guidance for server-rendered React apps, routing, API routes, and deployment.", "https://nextjs.org/docs"),
                new SeedResource("PostgreSQL", "SQL Style Guide", "Best practices for maintainable, readable, and performant SQL written for production codebases.", "https://www.sqlstyle.guide/"),
                new SeedResource("Java", "Java Concurrency Guide", "Learn threads, executors, synchronization, and concurrent design in enterprise Java apps.", "https://docs.oracle.com/javase/tutorial/essential/concurrency/"),
                new SeedResource("Docker", "Docker Docs Overview", "Official overview of core Docker concepts, lifecycle management, and orchestration use cases.", "https://docs.docker.com/get-started/overview/"),
                new SeedResource("Kubernetes", "Kubernetes By Example", "Practical examples for Deployments, DaemonSets, Services, and cluster workloads.", "https://kubernetesbyexample.com/"),
                new SeedResource("System Design", "Designing Data-Intensive Applications", "Well-known architecture principles for scalable systems and data processing.", "https://dataintensive.net/"),
                new SeedResource("JavaScript", "The Modern JavaScript Tutorial", "Clear modern JavaScript learning path for variables, objects, DOM, and asynchronous workflows.", "https://javascript.info/"),
                new SeedResource("Python", "Python FastAPI Docs", "Learn Python API framework basics for building production-ready services quickly.", "https://fastapi.tiangolo.com/"),
                new SeedResource("SQL", "SQL Practice Problems", "Set of SQL exercises to reinforce query writing, filtering, and joins with real-world examples.", "https://www.hackerrank.com/domains/sql")
        );

        List<LearningResource> existingResources = repository.findAll();
        Set<String> existingSignatures = new LinkedHashSet<>();
        for (LearningResource resource : existingResources) {
            String signature = signatureFor(resource.getSkill(), resource.getTitle(), resource.getUrl());
            if (signature != null) {
                existingSignatures.add(signature);
            }
        }

        for (SeedResource seed : requiredResources) {
            String seedSignature = signatureFor(seed.skill(), seed.title(), seed.url());
            if (seedSignature == null || existingSignatures.contains(seedSignature)) {
                continue;
            }

            boolean alreadyCovered = existingResources.stream().anyMatch(resource ->
                    Objects.equals(normalizeSkillText(resource.getSkill()), normalizeSkillText(seed.skill()))
                            || Objects.equals(normalizeSkillText(resource.getTitle()), normalizeSkillText(seed.title()))
                            || (resource.getUrl() != null && resource.getUrl().equalsIgnoreCase(seed.url()))
            );

            if (alreadyCovered) {
                continue;
            }

            saveResource(seed.skill(), seed.title(), seed.description(), seed.url());
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

        Set<String> normalizedQueries = normalizeSkillQueries(skill);
        if (normalizedQueries.isEmpty()) {
            return repository.findAll();
        }

        Set<LearningResource> matched = new LinkedHashSet<>();

        for (String query : normalizedQueries) {
            List<LearningResource> exactMatches = repository.findBySkillIgnoreCase(query);
            matched.addAll(exactMatches);

            List<LearningResource> containsMatches = repository.findBySkillContainingIgnoreCase(query);
            matched.addAll(containsMatches);
        }

        if (!matched.isEmpty()) {
            return new ArrayList<>(matched);
        }

        List<LearningResource> allResources = repository.findAll();
        for (LearningResource resource : allResources) {
            String resourceSkill = resource.getSkill();
            if (resourceSkill == null || resourceSkill.trim().isEmpty()) {
                continue;
            }

            String normalizedResourceSkill = normalizeSkillText(resourceSkill);
            for (String query : normalizedQueries) {
                if (normalizedResourceSkill.contains(query)
                        || query.contains(normalizedResourceSkill)
                        || normalizeSkillText(resourceSkill).equals(query)) {
                    matched.add(resource);
                    break;
                }
            }
        }

        return new ArrayList<>(matched);
    }

    private String signatureFor(String skill, String title, String url) {
        String normalizedSkill = normalizeSkillText(skill);
        String normalizedTitle = normalizeSkillText(title);
        String normalizedUrl = url == null ? "" : url.trim().toLowerCase();

        if (normalizedSkill.isEmpty() && normalizedTitle.isEmpty() && normalizedUrl.isEmpty()) {
            return null;
        }

        return normalizedSkill + "|" + normalizedTitle + "|" + normalizedUrl;
    }

    private Set<String> normalizeSkillQueries(String skill) {
        Set<String> queries = new LinkedHashSet<>();
        String[] parts = skill.split(",|/|\\|&|\\|\\|\n");

        for (String part : parts) {
            String normalized = normalizeSkillText(part);
            if (!normalized.isEmpty()) {
                queries.add(normalized);
            }
        }

        return queries;
    }

    private String normalizeSkillText(String value) {
        if (value == null) {
            return "";
        }

        String cleaned = value
                .trim()
                .replaceAll("[_-]+", " ")
                .replaceAll("\\s+", " ")
                .replaceAll("[^a-zA-Z0-9\\s]", "")
                .toLowerCase();

        return cleaned.trim();
    }

    public List<LearningResource> getAllResources() {
        return repository.findAll();
    }
}