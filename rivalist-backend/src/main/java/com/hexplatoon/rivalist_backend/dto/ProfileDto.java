package com.hexplatoon.rivalist_backend.dto;

import com.hexplatoon.rivalist_backend.entity.User;
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

    // For Reference
//    /**
//     * Converts User and Profile entities to a ProfileDto object.
//     *
//     * @param user the User entity
//     * @return a new ProfileDto object with data from the User and its associated Profile
//     */
//    public static ProfileDto fromUser(User user) {
//        if (user == null) {
//            return null;
//        }
//
//        Profile profile = user.getProfile();
//
//        return ProfileDto.builder()
//                .id(user.getId())
//                .username(user.getUsername())
//                .firstName(profile != null ? profile.getFirstName() : null)
//                .lastName(profile != null ? profile.getLastName() : null)
//                .bio(profile != null ? profile.getBio() : null)
//                .profilePicture(profile != null ? profile.getProfilePicture() : null)
//                .level(profile != null ? profile.getLevel() : 1)
//                .build();
//    }
    // For Reference
//    /**
//     * Converts a Profile entity to a ProfileDto object.
//     *
//     * @param profile the Profile entity
//     * @return a new ProfileDto object with data from the Profile and its associated User
//     */
//    public static ProfileDto fromProfile(Profile profile) {
//        if (profile == null) {
//            return null;
//        }
//
//        User user = profile.getUser();
//        if (user == null) {
//            return null;
//        }
//
//        return ProfileDto.builder()
//                .id(user.getId())
//                .username(user.getUsername())
//                .firstName(profile.getFirstName())
//                .lastName(profile.getLastName())
//                .bio(profile.getBio())
//                .profilePicture(profile.getProfilePicture())
//                .level(profile.getLevel())
//                .build();
//    }
}

