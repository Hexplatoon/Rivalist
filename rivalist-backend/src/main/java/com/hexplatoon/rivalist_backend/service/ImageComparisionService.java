package com.hexplatoon.rivalist_backend.service;

import org.bytedeco.javacpp.BytePointer;
import org.bytedeco.opencv.global.opencv_imgcodecs;
import org.bytedeco.opencv.global.opencv_imgproc;
import org.bytedeco.opencv.opencv_core.Mat;
import org.bytedeco.opencv.opencv_core.Scalar;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;

import static org.bytedeco.opencv.global.opencv_imgproc.COLOR_BGR2GRAY;

@Service
public class ImageComparisionService {

    private String imagePath1;
    private String imagePath2;
    private ImageService imageService;

    public ImageComparisionService(ImageService imageService) {
        this.imageService = imageService;
        imagePath1 = "C:\\screenshot\\screenshot2.jpg";
        imagePath2 = imageService.findRandomImages().getPath();
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

    public double compareImages() throws IOException {
        Mat img1 = opencv_imgcodecs.imread(imagePath1);
        Mat img2 = downloadImageAsMatFromGoogleDrive(imagePath2);

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

    public double finalScore(double time) throws IOException {
        double ssimScore = compareImages();
        double timeTaken = (30*60 - time)/(3*6);

        double ssimWeight = 0.7;
        double timeTakenWeight = 0.3;

        double score = ssimWeight*ssimScore + timeTakenWeight*timeTaken;
        return score;
    }

}
