package com.hexplatoon.rivalist_backend.dto.battle;

import com.hexplatoon.rivalist_backend.entity.Battle;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BattleWebsocketResponseDto {
    private Long battleId;
    private String challengerUsername;
    private String opponentUsername;
    private Battle.Category category;
    private String message;
}
