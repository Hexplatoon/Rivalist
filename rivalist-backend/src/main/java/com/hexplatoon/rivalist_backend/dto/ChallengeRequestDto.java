package com.hexplatoon.rivalist_backend.dto;

import com.hexplatoon.rivalist_backend.entity.ChallengeRequest.ChallengeStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChallengeRequestDto {
    private Long id;
    private String senderUsername;
    private String recipientUsername;
    private Long battleId;
    private ChallengeStatus status;
    private String eventType;
    private LocalDateTime createdAt;
    private LocalDateTime expiresAt;
    private Long timeRemainingSeconds; // Calculated field for frontend display
}

