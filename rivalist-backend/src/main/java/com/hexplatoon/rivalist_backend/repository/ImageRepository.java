package com.hexplatoon.rivalist_backend.repository;



import com.hexplatoon.rivalist_backend.entity.Image;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.ArrayList;
import java.util.List;

public interface ImageRepository extends JpaRepository<Image, Long> {

    //Image searched by object;
    Image findById(long id);

    @Query(value = "SELECT * FROM image ORDER BY RANDOM() LIMIT 1", nativeQuery = true)
    Image findRandomImages();
}
