package com.hexplatoon.rivalist_backend.controller;


import com.hexplatoon.rivalist_backend.entity.Screenshot;
import com.hexplatoon.rivalist_backend.service.ScreenshotServices;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/screenshot")
@RequiredArgsConstructor
public class ScreenshotController {

    private final Screenshot screenshot;
    private final ScreenshotServices screenshotServices;

    @PostMapping
    public ResponseEntity<String> getScreenshot(@RequestBody String html) throws Exception {
        screenshot.setHtmlContent(html);
        screenshotServices.captureScreenshot(screenshot.getHtmlContent());
        return ResponseEntity.ok("Screenshot captured");
    }
}
