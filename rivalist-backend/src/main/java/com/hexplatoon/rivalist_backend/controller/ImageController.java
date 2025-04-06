package com.hexplatoon.rivalist_backend.controller;


import com.hexplatoon.rivalist_backend.entity.Image;
import com.hexplatoon.rivalist_backend.service.ImageServices;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/screenshot")
@RequiredArgsConstructor
public class ImageController {

    private final Image image;
    private final ImageServices imageServices;

    @PostMapping
    public ResponseEntity<String> getScreenshot(@RequestBody String html) throws Exception {
        image.setHtmlContent(html);
        imageServices.captureScreenshot(image.getHtmlContent());
        return ResponseEntity.ok("Screenshot captured");
    }
}
