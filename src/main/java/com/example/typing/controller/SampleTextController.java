package com.example.typing.controller;

import com.example.typing.service.TypingResultService;
import com.github.javafaker.Faker;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/sample-text")
@CrossOrigin(origins = "*")
public class SampleTextController {

    private final TypingResultService typingResultService;

    public SampleTextController(TypingResultService typingResultService) {
        this.typingResultService = typingResultService;
    }

    @GetMapping
    public String getRandomParagraph() {
        return typingResultService.getRandomText(20);
    }
}
