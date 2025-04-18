package com.hexplatoon.rivalist_backend.service.battle;


import com.hexplatoon.rivalist_backend.entity.Image;
import com.hexplatoon.rivalist_backend.repository.ImageRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class ImageService {
    private ImageRepository imageRepository;

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
}
