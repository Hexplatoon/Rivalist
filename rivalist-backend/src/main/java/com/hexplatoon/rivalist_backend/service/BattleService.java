package com.hexplatoon.rivalist_backend.service;

import com.hexplatoon.rivalist_backend.entity.Challenge;
import com.hexplatoon.rivalist_backend.entity.battle.Battle;
import com.hexplatoon.rivalist_backend.entity.battle.BattleSession;
import com.hexplatoon.rivalist_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class BattleService implements BattleTimeoutHandler {

    private final Map<Long, BattleSession> activeBattles = new ConcurrentHashMap<>();
//    private final BattleTimerService timerService;
    private final NotificationService notificationService;
    private final UserRepository userRepository;

    @Autowired
    public BattleService(NotificationService notificationService, UserRepository userRepository) {
//        this.timerService = timerService;
        this.notificationService = notificationService;
        this.userRepository = userRepository;
    }

    public void createBattle(Challenge.EventType eventType, Long challengerId, Long opponentId) {
        Battle battle = Battle.builder()
                .category(Battle.Category.valueOf(eventType.name()))
                .createdAt(LocalDateTime.now())
                .player1Id(challengerId)
                .player2Id(opponentId)
                .status(Battle.Status.WAITING)
                .build();
        notificationService.createNotification(
                userRepository.findById(challengerId).get().getUsername(),
                userRepository.findById(opponentId).get().getUsername(),
                "challenge_accept",
                "Battle in waiting"
        );
        notificationService.createNotification(
                userRepository.findById(opponentId).get().getUsername(),
                userRepository.findById(challengerId).get().getUsername(),
                "challenge_accept",
                "Battle in waiting"
        );
    }

    public BattleSession startBattle(Long battleId, Long player1Id, Long player2Id, int durationSeconds) {
        BattleSession session = BattleSession.builder()
                .battleId(battleId)
                .challengerId(player1Id)
                .opponentId(player2Id)
                .duration(10)
                .build();
        activeBattles.put(battleId, session);

        // Start timer
//        timerService.startTimer(battleId, durationSeconds);
        return session;
    }

    public void endBattle(Long battleId) {
        BattleSession session = activeBattles.remove(battleId);
        if (session != null) {
            // Compute result
            // Save to DB (Battle entity)
            System.out.println("Battle " + battleId + " ended and saved.");
        }
    }

    public void cancelBattle(Long battleId) {
//        timerService.cancelTimer(battleId);
        activeBattles.remove(battleId);
        System.out.println("Battle " + battleId + " cancelled.");
    }

    public void onBattleTimeout(Long battleId) {
        this.endBattle(battleId);
    }
}
