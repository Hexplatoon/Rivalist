package com.hexplatoon.rivalist_backend.controller;


import com.hexplatoon.rivalist_backend.service.ImageComparisionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/compare")
@RequiredArgsConstructor
public class ImageComparisionController {

    private final ImageComparisionService imageComparisionService;

    @PostMapping
    public ResponseEntity<?> compareImages(@RequestParam("value") double timeTaken) throws IOException {
        var score = imageComparisionService.finalScore(timeTaken);
        return ResponseEntity.ok(Map.of("message", score));
    }
}
