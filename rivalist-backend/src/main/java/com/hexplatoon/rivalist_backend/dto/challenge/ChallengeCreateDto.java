package com.hexplatoon.rivalist_backend.dto.challenge;

import com.hexplatoon.rivalist_backend.entity.Challenge.EventType;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChallengeCreateDto {

    // TODO : Rename challenge create dto
    @NotBlank(message = "Username is required")
    private String username;
    
    @NotBlank(message = "Event type is required")
    private EventType eventType;
}

