package com.hexplatoon.rivalist_backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChallengeCreateDto {
    @NotBlank(message = "Username is required")
    private String username;
    
    @NotBlank(message = "Event type is required")
    private String eventType;
}

