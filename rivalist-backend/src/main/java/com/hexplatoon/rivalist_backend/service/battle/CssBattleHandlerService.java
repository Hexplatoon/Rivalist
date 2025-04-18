package com.hexplatoon.rivalist_backend.service.battle;

import com.hexplatoon.rivalist_backend.dto.battle.CssUserDto;
import com.hexplatoon.rivalist_backend.dto.battle.Result;
import com.hexplatoon.rivalist_backend.dto.battle.config.Config;
import com.hexplatoon.rivalist_backend.dto.battle.config.CssConfig;
import com.hexplatoon.rivalist_backend.entity.Battle;
import com.hexplatoon.rivalist_backend.entity.Image;
import com.hexplatoon.rivalist_backend.repository.ImageRepository;
import org.bytedeco.javacpp.BytePointer;
import org.bytedeco.opencv.global.opencv_imgcodecs;
import org.bytedeco.opencv.global.opencv_imgproc;
import org.bytedeco.opencv.opencv_core.Mat;
import org.bytedeco.opencv.opencv_core.Scalar;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.util.Base64;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import static org.bytedeco.opencv.global.opencv_imgproc.COLOR_BGR2GRAY;

@Service
public class CssBattleHandlerService {

    private final ImageRepository imageRepository;
    private final BattleService battleService;

    private final Map<Long , Config> configMap = new ConcurrentHashMap<>();
    private final Map<Long, Map<String , CssUserDto>> user_Map = new ConcurrentHashMap<>();
//    private String imagePath1 = "F:\\rivalist\\Rivalist\\rivalist-backend\\screenshots\\screenshot_.png";
    public CssBattleHandlerService(@Lazy BattleService battleService , ImageRepository imageRepository) {
        this.imageRepository = imageRepository;
        this.battleService = battleService;
    }

    public Config getConfig(Long battleId) {
       Image image = findRandomImages();
       Integer duration = battleService.getActiveBattleById(battleId).getDuration();
       Config config = CssConfig.builder()
               .imageUrl(image.getPath())
               .duration(duration)
               .color1(image.getColor1())
               .color2(image.getColor2())
               .build();
       configMap.put(battleId, config);
       return config;
    }

    public void saveUserText(Long battleId, String username, String text) {
        user_Map.computeIfAbsent(battleId, k -> new ConcurrentHashMap<>())
                .put(username, new CssUserDto(username, text));
    }

    public Image findById(long id) {
        return imageRepository.findById(id);
    }

    //Saving the image in database
    public void save(Image image) {
        imageRepository.save(image);
    }

    //Return the random image from database
    public Image findRandomImages() {
        return imageRepository.findRandomImages();
    }


    public void captureScreenshot(Long battleId , String username) throws Exception {

        // Optional: Set path if chromedriver isn't in PATH
        // System.setProperty("webdriver.chrome.driver", "/path/to/chromedriver");
        String htmlContent = user_Map.get(battleId).get(username).getUserCssCode();
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
            File savedFile = new File("screenshots/"+ username + ".png");

            user_Map.get(battleId).get(username).setImagePath(savedFile.getAbsolutePath());
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

    public Mat downloadImageAsMatFromGoogleDrive(String imageUrl) throws IOException {
        // Open connection to Google Drive
        URL url = new URL(imageUrl);
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        connection.setRequestProperty("User-Agent", "Mozilla/5.0");

        // Read image into a byte array
        ByteArrayOutputStream byteStream = new ByteArrayOutputStream();
        try (InputStream in = connection.getInputStream()) {
            byte[] buffer = new byte[4096];
            int bytesRead;
            while ((bytesRead = in.read(buffer)) != -1) {
                byteStream.write(buffer, 0, bytesRead);
            }
        }

        byte[] imageBytes = byteStream.toByteArray();
        BytePointer bytePointer = new BytePointer(imageBytes);

        // Decode the image using OpenCV
        Mat image = opencv_imgcodecs.imdecode(new Mat(bytePointer), opencv_imgcodecs.IMREAD_COLOR);

        if (image.empty()) {
            throw new RuntimeException("❌ Failed to decode image from downloaded data.");
        }

        return image;
    }

    public double compareImages(Long battleId , String username) throws IOException {
        CssConfig config = (CssConfig)configMap.get(battleId);

        Battle battle = battleService.getActiveBattleById(battleId);
        try {
            captureScreenshot(battleId , battle.getChallenger().getUsername());
            captureScreenshot(battleId , battle.getOpponent().getUsername());
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        Mat img1 = opencv_imgcodecs.imread(user_Map.get(battleId).get(username).getImagePath());
        Mat img2 = downloadImageAsMatFromGoogleDrive(config.getImageUrl());

        // Convert images to grayscale
        Mat gray1 = new Mat();
        Mat gray2 = new Mat();
        opencv_imgproc.cvtColor(img1, gray1, COLOR_BGR2GRAY);
        opencv_imgproc.cvtColor(img2, gray2, COLOR_BGR2GRAY);

        // Resize images if dimensions don't match
        if (gray1.size().width() != gray2.size().width() || gray1.size().height() != gray2.size().height()) {
            opencv_imgproc.resize(gray2, gray2, gray1.size());
        }

        // Compute SSIM (Manually calculating SSIM as JavaCV does not have a direct function)
        Mat diff = new Mat();
        org.bytedeco.opencv.global.opencv_core.absdiff(gray1, gray2, diff);

        Scalar mean = org.bytedeco.opencv.global.opencv_core.mean(diff);
        double similarity = 100 - (mean.get(0)); // Normalize similarity score

        return Math.max(similarity, 0); // Ensure it doesn't go negative
    }

    public double finalScore(Long battleId , String username) throws IOException {
        double ssimScore = compareImages(battleId , username);
        Battle battle = battleService.getActiveBattleById(battleId);
        Integer time = battle.getDuration();
        double timeTaken = (30*60 - time)/(3*6);

        double ssimWeight = 0.7;
        double timeTakenWeight = 0.3;

        double score = ssimWeight*ssimScore + timeTakenWeight*timeTaken;
        return score;
    }
    public Result getResult(Long battleId) throws IOException {
        Battle battle = battleService.getActiveBattleById(battleId);
        String challengerUsername = battle.getChallenger().getUsername();
        String  opponentUsername =  battle.getOpponent().getUsername();
        double challengerScore = finalScore(battleId , challengerUsername);
        double opponentScore = finalScore(battleId , opponentUsername);
        String winnerUsername, loserUsername;
        double winnerScore, loserScore;
        if(challengerScore >= opponentScore) {
            winnerUsername = challengerUsername;
            loserUsername = opponentUsername;
            winnerScore = challengerScore;
            loserScore = opponentScore;
        }else{
            winnerUsername = opponentUsername;
            loserUsername = challengerUsername;
            winnerScore = opponentScore;
            loserScore = challengerScore;
        }
        return Result.builder()
                .winnerUsername(winnerUsername)
                .loserUsername(loserUsername)
                .winnerScore(winnerScore+ " Match")
                .loserScore(loserScore+ " Match")
                .build();
    }
}
