package com.hexplatoon.rivalist_backend.service;

import com.hexplatoon.rivalist_backend.dto.battle.BattleWebsocketResponseDto;
import com.hexplatoon.rivalist_backend.dto.battle.Readiness;
import com.hexplatoon.rivalist_backend.dto.user.MiniProfileDto;
import com.hexplatoon.rivalist_backend.entity.Challenge;
import com.hexplatoon.rivalist_backend.entity.User;
import com.hexplatoon.rivalist_backend.entity.Battle;
import com.hexplatoon.rivalist_backend.dto.battle.BattleSession;
import com.hexplatoon.rivalist_backend.repository.BattleRepository;
import com.hexplatoon.rivalist_backend.repository.UserRepository;
import jakarta.validation.constraints.NotNull;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

// TODO : Refine Code

@Slf4j
@Service
public class BattleService{

    private final Map<Long, BattleSession> activeSessions = new ConcurrentHashMap<>();
    private final Map<Long, Readiness> readiness = new ConcurrentHashMap<>();
    private final UserRepository userRepository;
    private final SimpMessagingTemplate simpMessagingTemplate;
    private final BattleRepository battleRepository;
    private final BattleTimerService battleTimerService;

    @Autowired
    public BattleService(BattleTimerService timerService, NotificationService notificationService,
                         UserRepository userRepository, SimpMessagingTemplate simpMessagingTemplate,
                         BattleRepository battleRepository, BattleTimerService battleTimerService) {
        this.userRepository = userRepository;
        this.simpMessagingTemplate = simpMessagingTemplate;
        this.battleRepository = battleRepository;
        this.battleTimerService = battleTimerService;
    }

    public void createBattle(Challenge.EventType eventType, String challengerUsername, String opponentUsername) {
        User challenger = findUserByUsername(challengerUsername);
        User opponent = findUserByUsername(opponentUsername);

        Battle battle = Battle.builder()
                .category(Battle.Category.valueOf(eventType.name()))
                .createdAt(LocalDateTime.now())
                .challenger(challenger)
                .opponent(opponent)
                .status(Battle.Status.WAITING)
                .build();
        battleRepository.save(battle);
        BattleWebsocketResponseDto responseDto = BattleWebsocketResponseDto.builder()
                .battleId(battle.getId())
                .category(battle.getCategory())
                .challengerUsername(challengerUsername)
                .opponentUsername(opponentUsername)
                .message("CREATED")
                .build();
        simpMessagingTemplate.convertAndSendToUser(challengerUsername,"/topic/battle", responseDto);
        simpMessagingTemplate.convertAndSendToUser(opponentUsername,"/topic/battle", responseDto);
        Readiness ready = new Readiness();
        readiness.put(battle.getId(), ready);
        battleTimerService.startReadinessTimer(battle.getId(), 10);
//        notificationService.createNotification(
//                userRepository.findById(challengerId).get().getUsername(),
//                userRepository.findById(opponentId).get().getUsername(),
//                "challenge_accept",
//                "Battle in waiting"
//        );
//        notificationService.createNotification(
//                userRepository.findById(opponentId).get().getUsername(),
//                userRepository.findById(challengerId).get().getUsername(),
//                "challenge_accept",
//                "Battle in waiting"
//        );
    }

    public BattleSession startBattle(Long battleId, Long player1Id, Long player2Id, int durationSeconds) {
        BattleSession session = BattleSession.builder()
                .battleId(battleId)
                .challengerId(player1Id)
                .opponentId(player2Id)
                .duration(10)
                .build();
        activeSessions.put(battleId, session);
        System.out.println("Battle Started!");
        // Start timer
//        timerService.startTimer(battleId, durationSeconds);
        return session;
    }
    public boolean isBattleReady(Long battleId) {
        Readiness ready = readiness.get(battleId);
        return ready!=null && ready.isChallengerOk()&& ready.isOpponentOk();
    }
    public void endBattle(Long battleId) {
        BattleSession session = activeSessions.remove(battleId);

        if (session != null) {
            // Compute result
            // Save to DB (Battle entity)
            System.out.println("Battle " + battleId + " ended and saved.");
        }
    }

    public void cancelBattle(Long battleId) {
        Battle battle = findBattleById(battleId);
        battle.setStatus(Battle.Status.CANCELED);
        battleRepository.save(battle);
        System.out.println("Battle " + battleId + " cancelled.");
    }

    // TODO : create get challenger username and get opponent username
    @Transactional
    public void updateReadiness(@NotNull String username , Long battleId) {
        Readiness ready = readiness.get(battleId);
        Battle battle = findBattleById(battleId);
        String challenger = battle.getChallenger().getUsername();
        String opponent =  battle.getOpponent().getUsername();
        if(username.equals(challenger) && !readiness.get(battleId).isChallengerOk()) {
            readiness.get(battleId).setChallengerOk(true);
        }
        if(username.equals(opponent) && !readiness.get(battleId).isOpponentOk()) {
            readiness.get(battleId).setOpponentOk(true);
        }

        if (isBattleReady(battleId)){
            startBattle(battleId,battle.getChallenger().getId(), battle.getOpponent().getId(), 308);
        }
    }

    private User findUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found: " + username));
    }

    private Battle findBattleById(Long battleId) {
        return battleRepository.findById(battleId).orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Battle not found : " + battleId));
    }
}
