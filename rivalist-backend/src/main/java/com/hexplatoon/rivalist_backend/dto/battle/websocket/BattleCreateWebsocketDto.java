package com.hexplatoon.rivalist_backend.dto.battle.websocket;

import com.hexplatoon.rivalist_backend.dto.user.MiniProfileDto;
import com.hexplatoon.rivalist_backend.entity.Battle;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BattleCreateWebsocketDto {
    private Long battleId;
    private MiniProfileDto challenger;
    private MiniProfileDto opponent;
    private Battle.Category category;
    private String message;
}
