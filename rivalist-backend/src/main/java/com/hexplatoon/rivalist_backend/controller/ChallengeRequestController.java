package com.hexplatoon.rivalist_backend.controller;

import com.hexplatoon.rivalist_backend.dto.ChallengeCreateDto;
import com.hexplatoon.rivalist_backend.dto.ChallengeRequestDto;
import com.hexplatoon.rivalist_backend.dto.WebSocketMessage;
import com.hexplatoon.rivalist_backend.service.ChallengeRequestService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/challenges")
@RequiredArgsConstructor
@Tag(name = "Challenge Requests", description = "API endpoints for managing friend battle challenges")
@Slf4j
public class ChallengeRequestController {
    private final ChallengeRequestService challengeRequestService;

    @PostMapping("/create")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create a new challenge request", description = "Create a challenge request to a friend")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Challenge created successfully"),
        @ApiResponse(responseCode = "403", description = "You can only challenge friends", content = @Content),
        @ApiResponse(responseCode = "404", description = "User not found", content = @Content),
        @ApiResponse(responseCode = "409", description = "A pending challenge already exists", content = @Content)
    })
    public ChallengeRequestDto createChallenge(
            @AuthenticationPrincipal Principal principal,
            @RequestBody ChallengeCreateDto challengeCreateDto) {
        return challengeRequestService.createChallenge(
                principal.getName(),
                challengeCreateDto.getUsername(),
                challengeCreateDto.getEventType());
    }

    @PostMapping("/{id}/accept")
    @Operation(summary = "Accept a challenge", description = "Accept a pending challenge request and create a battle")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Challenge accepted successfully"),
        @ApiResponse(responseCode = "403", description = "This challenge is not for you", content = @Content),
        @ApiResponse(responseCode = "404", description = "Challenge not found", content = @Content),
        @ApiResponse(responseCode = "400", description = "Challenge is not in PENDING status", content = @Content)
    })
    public ChallengeRequestDto acceptChallenge(
            @AuthenticationPrincipal Principal principal,
            @PathVariable Long id) {
        return challengeRequestService.acceptChallenge(principal.getName(), id);
    }

    @PostMapping("/{id}/decline")
    @Operation(summary = "Decline a challenge", description = "Decline a pending challenge request")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Challenge declined successfully"),
        @ApiResponse(responseCode = "403", description = "This challenge is not for you", content = @Content),
        @ApiResponse(responseCode = "404", description = "Challenge not found", content = @Content),
        @ApiResponse(responseCode = "400", description = "Challenge is not in PENDING status", content = @Content)
    })
    public ChallengeRequestDto declineChallenge(
            @AuthenticationPrincipal Principal principal,
            @PathVariable Long id) {
        return challengeRequestService.declineChallenge(principal.getName(), id);
    }

    @PostMapping("/{id}/cancel")
    @Operation(summary = "Cancel a challenge", description = "Cancel a pending challenge request that you sent")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Challenge cancelled successfully"),
        @ApiResponse(responseCode = "403", description = "You can only cancel your own challenges", content = @Content),
        @ApiResponse(responseCode = "404", description = "Challenge not found", content = @Content),
        @ApiResponse(responseCode = "400", description = "Only pending challenges can be cancelled", content = @Content)
    })
    public ChallengeRequestDto cancelChallenge(
            @AuthenticationPrincipal Principal principal,
            @PathVariable Long id) {
        return challengeRequestService.cancelChallenge(principal.getName(), id);
    }

    @GetMapping("/pending")
    @Operation(summary = "Get pending challenges", description = "Get all pending challenge requests for the current user")
    @ApiResponse(responseCode = "200", description = "List of pending challenges retrieved successfully")
    public List<ChallengeRequestDto> getPendingChallenges(@AuthenticationPrincipal Principal principal) {
        return challengeRequestService.getPendingChallengesForUser(principal.getName());
    }

    @GetMapping("/sent")
    @Operation(summary = "Get sent challenges", description = "Get all pending challenges sent by the current user")
    @ApiResponse(responseCode = "200", description = "List of sent challenges retrieved successfully")
    public List<ChallengeRequestDto> getSentChallenges(@AuthenticationPrincipal Principal principal) {
        return challengeRequestService.getPendingChallengesSentByUser(principal.getName());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get challenge by ID", description = "Get a specific challenge request by its ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Challenge retrieved successfully"),
        @ApiResponse(responseCode = "404", description = "Challenge not found", content = @Content)
    })
    public ChallengeRequestDto getChallengeById(@PathVariable Long id) {
        return challengeRequestService.getChallengeById(id);
    }

    // WebSocket endpoints
    @MessageMapping("/challenge/request")
    public void handleChallengeRequest(@Payload WebSocketMessage message, SimpMessageHeaderAccessor headerAccessor) {
        try {
            String username = headerAccessor.getUser().getName();
            ChallengeCreateDto challenge = (ChallengeCreateDto) message.getContent();
            log.debug("Handling challenge request: sender={}, recipient={}, type={}", 
                    username, challenge.getUsername(), challenge.getEventType());
            challengeRequestService.createChallenge(username, challenge.getUsername(), challenge.getEventType());
        } catch (Exception e) {
            log.error("Error handling challenge request: username={}, error={}", 
                    headerAccessor.getUser().getName(), e.getMessage(), e);
        }
    }

    @MessageMapping("/challenge/response")
    public void handleChallengeResponse(@Payload WebSocketMessage message, SimpMessageHeaderAccessor headerAccessor) {
        try {
            String username = headerAccessor.getUser().getName();
            ChallengeRequestDto challenge = (ChallengeRequestDto) message.getContent();
            log.debug("Handling challenge response: user={}, challengeId={}, type={}", 
                    username, challenge.getId(), message.getType());
            
            switch (message.getType()) {
                case "ACCEPT":
                    challengeRequestService.acceptChallenge(username, challenge.getId());
                    break;
                case "DECLINE":
                    challengeRequestService.declineChallenge(username, challenge.getId());
                    break;
                default:
                    log.warn("Invalid challenge response type: {}", message.getType());
            }
        } catch (Exception e) {
            log.error("Error handling challenge response: username={}, error={}", 
                    headerAccessor.getUser().getName(), e.getMessage(), e);
        }
    }

    @MessageMapping("/challenge/cancel")
    public void handleChallengeCancel(@Payload WebSocketMessage message, SimpMessageHeaderAccessor headerAccessor) {
        try {
            String username = headerAccessor.getUser().getName();
            Long challengeId = (Long) message.getContent();
            log.debug("Handling challenge cancellation: user={}, challengeId={}", 
                    username, challengeId);
            challengeRequestService.cancelChallenge(username, challengeId);
        } catch (ClassCastException e) {
            log.warn("Invalid challenge cancel payload type: {}", 
                    message.getContent().getClass().getName());
        } catch (Exception e) {
            log.error("Error handling challenge cancellation: username={}, error={}", 
                    headerAccessor.getUser().getName(), e.getMessage(), e);
        }
    }
}
