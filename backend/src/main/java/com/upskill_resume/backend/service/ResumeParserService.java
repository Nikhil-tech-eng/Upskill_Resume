package com.upskill_resume.backend.service;

import org.apache.tika.Tika;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ResumeParserService {

    private final Tika tika = new Tika();

    public String extractText(MultipartFile file) throws Exception {
        return tika.parseToString(file.getInputStream());
    }
}