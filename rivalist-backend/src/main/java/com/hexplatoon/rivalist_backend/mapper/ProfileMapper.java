package com.hexplatoon.rivalist_backend.mapper;

import com.hexplatoon.rivalist_backend.dto.user.ProfileDto;
import com.hexplatoon.rivalist_backend.entity.User;

public class ProfileMapper {
    public static ProfileDto toProfileDto(User user) {
        ProfileDto dto = ProfileDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .level(user.getLevel())
                .experience(user.getExperience())
                .profilePicture(user.getProfilePicture())
                .bio(user.getBio())
                .typingRating(user.getTypingRating())
                .codeforcesRating(user.getCodeforcesRating())
                .cssDesignRating(user.getCssDesignRating())
                .codeforcesRating(user.getCodeforcesRating())
                .build();
        return dto;
    }
}


