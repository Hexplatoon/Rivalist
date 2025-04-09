package com.hexplatoon.rivalist_backend.entity;

import jakarta.persistence.*;
import lombok.*;


@Data
@Setter
@Getter
@Entity
@NoArgsConstructor
@AllArgsConstructor
public class Image {



    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    @Column(name = "Path", nullable = false)
    private String path;


    @Column(name = "Color1", nullable = false)
    private String color1;

    @Column(name = "Color2", nullable = false)
    private String color2;


}
