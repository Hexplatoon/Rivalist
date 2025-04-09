package com.hexplatoon.rivalist_backend.mapper;

import com.hexplatoon.rivalist_backend.dto.battle.BattleHistoryDto;
import com.hexplatoon.rivalist_backend.entity.battle.Battle;

public class BattleMapper {

    public static BattleHistoryDto toDTO(Battle battle) {
        if (battle == null) return null;

        return BattleHistoryDto.builder()
                .id(battle.getId())
                .category(battle.getCategory().name())
                .player1Id(battle.getPlayer1Id())
                .player2Id(battle.getPlayer2Id())
                .status(battle.getStatus().name())
                .createdAt(battle.getCreatedAt())
                .updatedAt(battle.getUpdatedAt())
                .resultJson(battle.getResultJson())
                .configJson(battle.getConfigJson())
                .build();
    }

    public static Battle toEntity(BattleHistoryDto dto) {
        if (dto == null) return null;

        return Battle.builder()
                .id(dto.getId())
                .category(Battle.Category.valueOf(dto.getCategory()))
                .player1Id(dto.getPlayer1Id())
                .player2Id(dto.getPlayer2Id())
                .status(Battle.Status.valueOf(dto.getStatus()))
                .createdAt(dto.getCreatedAt()) // Optional: usually handled automatically
                .updatedAt(dto.getUpdatedAt()) // Optional: usually handled automatically
                .resultJson(dto.getResultJson())
//                .winnerId(dto.getWinnerId())
                .build();
    }
}
