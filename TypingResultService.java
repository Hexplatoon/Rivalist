package com.example.typing;

import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class TypingResultService {
    private final TypingResultRepository repository;

    public TypingResultService(TypingResultRepository repository) {
        this.repository = repository;
    }

    public void saveResult(TypingResult result) {
        repository.save(result);
    }

    public List<TypingResult> getAllResults() {
        return repository.findAll();
    }
}