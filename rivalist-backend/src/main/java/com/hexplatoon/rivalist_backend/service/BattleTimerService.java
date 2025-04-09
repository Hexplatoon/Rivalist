//package com.hexplatoon.rivalist_backend.service;
//
//import org.springframework.stereotype.Service;
//import java.util.Map;
//import java.util.concurrent.*;
//
//@Service
//public class BattleTimerService {
//
//    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(4);
//    private final Map<Long, ScheduledFuture<?>> timers = new ConcurrentHashMap<>();
//    private final BattleTimeoutHandler battleTimeoutHandler;
//
//    public BattleTimerService(BattleTimeoutHandler battleTimeoutHandler) {
//        this.battleTimeoutHandler = battleTimeoutHandler;
//    }
//
//    public void startTimer(Long battleId, int durationSeconds) {
//        // Avoid duplicate timers
//        if (timers.containsKey(battleId)) return;
//
//        ScheduledFuture<?> future = scheduler.schedule(() -> {
//            battleTimeoutHandler.onBattleTimeout(battleId);
//            timers.remove(battleId);
//        }, durationSeconds, TimeUnit.SECONDS);
//
//        timers.put(battleId, future);
//    }
//
//    public void cancelTimer(Long battleId) {
//        ScheduledFuture<?> future = timers.remove(battleId);
//        if (future != null) {
//            future.cancel(true);
//        }
//    }
//
//    public void forceEnd(Long battleId) {
//        cancelTimer(battleId);
//        battleTimeoutHandler.onBattleTimeout(battleId);
//    }
//}
