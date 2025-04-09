package com.hexplatoon.rivalist_backend.dto.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object for representing user profile information.
 * This DTO contains only the information that can be safely exposed via APIs.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProfileDto {
    
    private Long id;
    private String username;
    private String firstName;
    private String lastName;
    private String bio;
    private String profilePicture;
    private Integer level;
    private Integer experience;
    private Integer typingRating;
    private Integer cssDesignRating;
    private Integer codeforcesRating;
}

