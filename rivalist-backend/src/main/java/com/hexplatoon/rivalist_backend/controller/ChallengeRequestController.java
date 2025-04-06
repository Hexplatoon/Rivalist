package com.hexplatoon.rivalist_backend.controller;

import com.hexplatoon.rivalist_backend.dto.ApiResponse;
import com.hexplatoon.rivalist_backend.dto.ChallengeCreateDto;
import com.hexplatoon.rivalist_backend.dto.ChallengeRequestDto;
import com.hexplatoon.rivalist_backend.dto.WebSocketMessage;
import com.hexplatoon.rivalist_backend.service.ChallengeRequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/challenges")
@RequiredArgsConstructor
@PreAuthorize("isAuthenticated()")
public class ChallengeRequestController {

    private final ChallengeRequestService challengeRequestService;

    /**
     * Create a new challenge request
     */
    @PostMapping("/create")
    public ResponseEntity<ChallengeRequestDto> createChallenge(
            @Valid @RequestBody ChallengeCreateDto request,
            Authentication authentication) {
        try {
            String username = authentication.getName();
            ChallengeRequestDto challenge = challengeRequestService.createChallenge(
                    username,
                    request.getUsername(),
                    request.getEventType()
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(challenge);
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to create challenge");
        }
    }

    /**
     * Accept a challenge
     */
    @PostMapping("/{id}/accept")
    public ResponseEntity<ChallengeRequestDto> acceptChallenge(
            @PathVariable Long id,
            Authentication authentication) {
        try {
            String username = authentication.getName();
            ChallengeRequestDto challenge = challengeRequestService.acceptChallenge(username, id);
            return ResponseEntity.ok(challenge);
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to accept challenge");
        }
    }

    /**
     * Decline a challenge
     */
    @PostMapping("/{id}/decline")
    public ResponseEntity<ChallengeRequestDto> declineChallenge(
            @PathVariable Long id,
            Authentication authentication) {
        try {
            String username = authentication.getName();
            ChallengeRequestDto challenge = challengeRequestService.declineChallenge(username, id);
            return ResponseEntity.ok(challenge);
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to decline challenge");
        }
    }

    /**
     * Cancel a challenge
     */
    @PostMapping("/{id}/cancel")
    public ResponseEntity<ChallengeRequestDto> cancelChallenge(
            @PathVariable Long id,
            Authentication authentication) {
        try {
            String username = authentication.getName();
            ChallengeRequestDto challenge = challengeRequestService.cancelChallenge(username, id);
            return ResponseEntity.ok(challenge);
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to cancel challenge");
        }
    }

    /**
     * Get all pending challenges for the authenticated user
     */
    @GetMapping("/pending")
    public ResponseEntity<List<ChallengeRequestDto>> getPendingChallenges(Authentication authentication) {
        try {
            String username = authentication.getName();
            List<ChallengeRequestDto> challenges = challengeRequestService.getPendingChallengesForUser(username);
            return ResponseEntity.ok(challenges);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to retrieve pending challenges");
        }
    }

    /**
     * Get all sent challenges by the authenticated user
     */
    @GetMapping("/sent")
    public ResponseEntity<List<ChallengeRequestDto>> getSentChallenges(Authentication authentication) {
        try {
            String username = authentication.getName();
            List<ChallengeRequestDto> challenges = challengeRequestService.getPendingChallengesSentByUser(username);
            return ResponseEntity.ok(challenges);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to retrieve sent challenges");
        }
    }

    /**
     * Get challenge by id
     */
    @GetMapping("/{id}")
    public ResponseEntity<ChallengeRequestDto> getChallengeById(@PathVariable Long id) {
        try {
            ChallengeRequestDto challenge = challengeRequestService.getChallengeById(id);
            return ResponseEntity.ok(challenge);
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to retrieve challenge");
        }
    }

    /**
     * WebSocket message handler for challenge request
     */
    @MessageMapping("/challenge/request")
    public void handleChallengeRequest(@Payload WebSocketMessage message, SimpMessageHeaderAccessor accessor) {
        try {
            String username = accessor.getUser().getName();
            ChallengeCreateDto challengeRequest = (ChallengeCreateDto) message.getContent();
            
            challengeRequestService.createChallenge(
                    username,
                    challengeRequest.getUsername(),
                    challengeRequest.getEventType()
            );
            
            // Notification is handled by the service
        } catch (Exception e) {
            // Log error - WebSocket doesn't have standard error handling
            // Client should handle timeouts and use REST API as fallback
            System.err.println("Error handling challenge request: " + e.getMessage());
        }
    }

    /**
     * WebSocket message handler for challenge response (accept/decline)
     */
    @MessageMapping("/challenge/response")
    public void handleChallengeResponse(@Payload WebSocketMessage message, SimpMessageHeaderAccessor accessor) {
        try {
            String username = accessor.getUser().getName();
            if (message.getContent() instanceof ChallengeRequestDto) {
                ChallengeRequestDto challengeResponse = (ChallengeRequestDto) message.getContent();
                Long challengeId = challengeResponse.getId();
                
                if ("ACCEPT".equals(message.getType())) {
                    challengeRequestService.acceptChallenge(username, challengeId);
                } else if ("DECLINE".equals(message.getType())) {
                    challengeRequestService.declineChallenge(username, challengeId);
                }
                
                // Notification is handled by the service
            }
        } catch (Exception e) {
            // Log error
            System.err.println("Error handling challenge response: " + e.getMessage());
        }
    }

    /**
     * WebSocket message handler for challenge cancellation
     */
    @MessageMapping("/challenge/cancel")
    public void handleChallengeCancel(@Payload WebSocketMessage message, SimpMessageHeaderAccessor accessor) {
        try {
            String username = accessor.getUser().getName();
            if (message.getContent() instanceof Long) {
                Long challengeId = (Long) message.getContent();
                challengeRequestService.cancelChallenge(username, challengeId);
                
                // Notification is handled by the service
            }
        } catch (Exception e) {
            // Log error
            System.err.println("Error handling challenge cancellation: " + e.getMessage());
        }
    }
}

