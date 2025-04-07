package com.hexplatoon.rivalist_backend.repository;

import com.hexplatoon.rivalist_backend.entity.ChallengeRequest;
import com.hexplatoon.rivalist_backend.entity.ChallengeRequest.ChallengeStatus;
import com.hexplatoon.rivalist_backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ChallengeRequestRepository extends JpaRepository<ChallengeRequest, Long> {

    /**
     * Find all active challenges sent by a user
     */
    List<ChallengeRequest> findBySenderAndStatus(User sender, ChallengeStatus status);

    /**
     * Find all active challenges received by a user
     */
    List<ChallengeRequest> findByRecipientAndStatus(User recipient, ChallengeStatus status);

    /**
     * Find all challenges that have expired but are still marked as PENDING
     */
    @Query("SELECT c FROM ChallengeRequest c WHERE c.status = com.hexplatoon.rivalist_backend.entity.ChallengeRequest.ChallengeStatus.PENDING AND c.expiresAt < :now")
    List<ChallengeRequest> findExpiredChallenges(@Param("now") LocalDateTime now);

    /**
     * Find pending challenge between two users
     */
    @Query("SELECT c FROM ChallengeRequest c WHERE c.sender = :sender AND c.recipient = :recipient AND c.status = com.hexplatoon.rivalist_backend.entity.ChallengeRequest.ChallengeStatus.PENDING")
    Optional<ChallengeRequest> findPendingChallengeBetweenUsers(@Param("sender") User sender, @Param("recipient") User recipient);

    /**
     * Update status of challenge requests
     */
    @Modifying
    @Query("UPDATE ChallengeRequest c SET c.status = :status WHERE c.id = :id")
    void updateChallengeStatus(@Param("id") Long id, @Param("status") ChallengeStatus status);

    /**
     * Update status of expired challenge requests
     */
    @Modifying
    @Query("UPDATE ChallengeRequest c SET c.status = com.hexplatoon.rivalist_backend.entity.ChallengeRequest.ChallengeStatus.EXPIRED WHERE c.status = com.hexplatoon.rivalist_backend.entity.ChallengeRequest.ChallengeStatus.PENDING AND c.expiresAt < :now")
    int markExpiredChallenges(@Param("now") LocalDateTime now);

    /**
     * Find challenge by sender, recipient and status
     */
    Optional<ChallengeRequest> findBySenderAndRecipientAndStatus(User sender, User recipient, ChallengeStatus status);

    // Not Required for now
//    /**
//     * Update battle ID for a challenge
//     */
//    @Modifying
//    @Query("UPDATE ChallengeRequest c SET c.battle.id = :battleId WHERE c.id = :id")
//    void updateBattleId(@Param("id") Long id, @Param("battleId") Long battleId);
}

