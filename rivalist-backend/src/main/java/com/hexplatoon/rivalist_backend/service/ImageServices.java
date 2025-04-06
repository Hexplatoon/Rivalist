package com.hexplatoon.rivalist_backend.service;

import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileOutputStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.util.Base64;

@Service
public class ImageServices {

    public void captureScreenshot(String htmlContent) throws Exception {

        // Optional: Set path if chromedriver isn't in PATH
        // System.setProperty("webdriver.chrome.driver", "/path/to/chromedriver");

        ChromeOptions options = new ChromeOptions();
        options.addArguments("--headless", "--disable-gpu", "--window-size=400,600");
        WebDriver driver = new ChromeDriver(options);

        try {
            // Load raw HTML using data URL
//            driver.get("data:text/html;charset=utf-8," + java.net.URLEncoder.encode(html, "UTF-8"));
//            String htmlContent;

            byte[] htmlBytes = htmlContent.getBytes(StandardCharsets.UTF_8);
            String base64Html = Base64.getEncoder().encodeToString(htmlBytes);
            String encodedHtml = "data:text/html;base64," + base64Html;

            driver.get(encodedHtml);


            // Wait a bit to ensure rendering (optional)
            Thread.sleep(500);

            // Take screenshot
            File screenshot = ((TakesScreenshot) driver).getScreenshotAs(OutputType.FILE);
            byte[] imageBytes = Files.readAllBytes(screenshot.toPath());

            // Save screenshot to disk with timestamp
//            String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
            File savedFile = new File("screenshots/screenshot_" + ".png");

            // Create directory if it doesn't exist
            savedFile.getParentFile().mkdirs();

            try (FileOutputStream fos = new FileOutputStream(savedFile)) {
                fos.write(imageBytes);
            }

            driver.quit();
            System.out.println("Screenshot captured");
//            return imageBytes;
        }
        catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }
}
