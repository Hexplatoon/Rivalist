package com.hexplatoon.rivalist_backend.dto.battle;

import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BattleHistoryDto {
    private Long id;
    private String category; // CSS, TB, CF
    private Long player1Id;
    private Long player2Id;
    private String status; // ONGOING, ENDED, etc.
    private LocalDateTime createdAt;
    private LocalDateTime startedAt;
    private LocalDateTime updatedAt;
    private String resultJson;
    private String configJson;
}
