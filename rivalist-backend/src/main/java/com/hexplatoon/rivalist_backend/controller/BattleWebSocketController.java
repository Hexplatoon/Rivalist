
package com.hexplatoon.rivalist_backend.controller;

import com.hexplatoon.rivalist_backend.dto.battle.websocket.BattleEndWebsocketDto;
import com.hexplatoon.rivalist_backend.service.battle.BattleService;
import com.hexplatoon.rivalist_backend.service.battle.TypingBattleHandlerService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Controller
@RequiredArgsConstructor
public class BattleWebSocketController {

    private final BattleService battleService;
    private final TypingBattleHandlerService typingBattleHandlerService;

    @MessageMapping({"/battle/ready"})
    public void handleReadiness(@Payload Long battleId, Principal principal) {
        String username = (String) principal.getName();
        battleService.updateReadiness(username, battleId);
    }

    @MessageMapping({"/battle/end"})
    public void calculateScore(@Payload BattleEndWebsocketDto dto, Principal principal) {
        String username = (String) principal.getName();
        typingBattleHandlerService.saveUserText(dto.getBattleId(), username, dto.getText());
    }
}
