package com.hexplatoon.rivalist_backend.controller;


import com.hexplatoon.rivalist_backend.entity.Image;
import com.hexplatoon.rivalist_backend.service.battle.ImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/image")
@RequiredArgsConstructor
public class ImageController {

    private final ImageService imageService;

    @PostMapping
    public ResponseEntity<?> saveImage(@RequestBody Image image) {
        imageService.save(image);
        return ResponseEntity.ok(Map.of("message", "Image Saved"));
    }
}
