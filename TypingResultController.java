package com.example.typing;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/results")
@CrossOrigin(origins = "*")
public class TypingResultController {

    private final TypingResultService service;

    public TypingResultController(TypingResultService service) {
        this.service = service;
    }

    @PostMapping
    public void submitResult(@RequestBody TypingResult result) {
        service.saveResult(result);
    }

    @GetMapping
    public List<TypingResult> getResults() {
        return service.getAllResults();
    }
}