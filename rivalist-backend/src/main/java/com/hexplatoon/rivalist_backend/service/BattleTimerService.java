package com.hexplatoon.rivalist_backend.service;

import com.hexplatoon.rivalist_backend.dto.battle.Readiness;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import java.util.Map;
import java.util.concurrent.*;

// TODO : Refine the code. It's smelling
@Service
public class BattleTimerService {

    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(4);
    private final Map<Long, ScheduledFuture<?>> battleTimers = new ConcurrentHashMap<>();
    private final Map<Long, ScheduledFuture<?>> readinessTimers = new ConcurrentHashMap<>();
    private final BattleService battleService;

    public BattleTimerService(@Lazy BattleService battleService) {
        this.battleService = battleService;
    }

    public void startBattleTimer(Long battleId, int durationSeconds) {
        // Avoid duplicate timers
        if (battleTimers.containsKey(battleId)) return;

        ScheduledFuture<?> future = scheduler.schedule(() -> {
            battleService.endBattle(battleId);
            battleTimers.remove(battleId);
        }, durationSeconds, TimeUnit.SECONDS);

        battleTimers.put(battleId, future);
    }

    public void startReadinessTimer(Long battleId, int durationSeconds) {
        if (readinessTimers.containsKey(battleId)) return;
        System.out.println("Testing");
        ScheduledFuture<?> future = scheduler.schedule(() -> {;
            if (!battleService.isBattleReady(battleId)){
                battleService.cancelBattle(battleId);
            }
            readinessTimers.remove(battleId);
        }, durationSeconds, TimeUnit.SECONDS);

        readinessTimers.put(battleId, future);
    }

    public void cancelTimer(Long battleId) {
        ScheduledFuture<?> future = battleTimers.remove(battleId);
        if (future != null) {
            future.cancel(true);
        }
    }

    public void forceEnd(Long battleId) {
        cancelTimer(battleId);
        battleService.endBattle(battleId);
    }
}
