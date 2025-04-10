
package com.hexplatoon.rivalist_backend.controller;

import com.hexplatoon.rivalist_backend.dto.battle.Readiness;
import com.hexplatoon.rivalist_backend.service.BattleService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Controller
@RequiredArgsConstructor
public class BattleWebSocketController {

    private final BattleService battleService;

    @MessageMapping({"/battle/ready"})
    public void handleReadiness(@Payload Long battleId, Principal principal) {
        String username = (String) principal.getName();
        System.out.println(username);
        battleService.updateReadiness(username, battleId);
    }
}
