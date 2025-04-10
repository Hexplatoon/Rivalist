package com.hexplatoon.rivalist_backend.dto.battle;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class BattleSession {
    private Long battleId;
    private Long challengerId;
    private Long opponentId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private BattleProgress challengerProgress;
    private BattleProgress opponentProgress;
    private Integer duration;
    // TODO : create functions for updating progress
}
