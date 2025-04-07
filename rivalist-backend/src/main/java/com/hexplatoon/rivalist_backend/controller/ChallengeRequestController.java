package com.hexplatoon.rivalist_backend.controller;

import com.hexplatoon.rivalist_backend.dto.ChallengeCreateDto;
import com.hexplatoon.rivalist_backend.dto.ChallengeRequestDto;
import com.hexplatoon.rivalist_backend.service.ChallengeRequestService;
import com.hexplatoon.rivalist_backend.service.CurrentUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/challenges")
@RequiredArgsConstructor
public class ChallengeRequestController {

    // TODO : remove all the principle objects from each method
    private final ChallengeRequestService challengeRequestService;
    private final CurrentUserService currentUserService;

    /**
     * Endpoint to create a challenge request in backend
     * @param challengeCreateDto
     * @return ChallengeRequestDto
     */
    @PostMapping("/create")
    @ResponseStatus(HttpStatus.CREATED)
    public ChallengeRequestDto createChallenge(@RequestBody ChallengeCreateDto challengeCreateDto) {
        return challengeRequestService.createChallenge(
                currentUserService.getCurrentUsername(),
                challengeCreateDto.getUsername(),
                challengeCreateDto.getEventType());
    }

    // Not working for now
//    /**
//     * Endpoint to accept a challenge received by a user
//     * @param principal
//     * @param id challenge id
//     * @return ChallengeRequestDto
//     */
//    @PostMapping("/{id}/accept")
//    public ChallengeRequestDto acceptChallenge(
//            @AuthenticationPrincipal Principal principal,
//            @PathVariable Long id) {
//        return challengeRequestService.acceptChallenge(principal.getName(), id);
//    }

    /**
     * Endpoint to decline a challenge received by a user
     * @param id
     * @return
     */

    // TODO : ChallengeRequestDto response can be replaced with text response
    @PostMapping("/{id}/decline")
    public ChallengeRequestDto declineChallenge(@PathVariable Long id) {

        return challengeRequestService.declineChallenge(
                currentUserService.getCurrentUsername(), id);
    }

    // Not Required for now
//    @PostMapping("/{id}/cancel")
//    public ChallengeRequestDto cancelChallenge(
//            @AuthenticationPrincipal Principal principal,
//            @PathVariable Long id) {
//        return challengeRequestService.cancelChallenge(principal.getName(), id);
//    }

    @GetMapping("/pending")
    public List<ChallengeRequestDto> getPendingChallenges() {
        return challengeRequestService.getPendingChallengesForUser(currentUserService.getCurrentUsername());
    }

    @GetMapping("/sent")
    public List<ChallengeRequestDto> getSentChallenges() {
        return challengeRequestService.getPendingChallengesSentByUser(currentUserService.getCurrentUsername());
    }

    @GetMapping("/{id}")
    public ChallengeRequestDto getChallengeById(@PathVariable Long id) {
        return challengeRequestService.getChallengeById(id);
    }

    // Not Required
//    @MessageMapping("/challenge/request")
//    public void handleChallengeRequest(@Payload WebSocketMessage message, SimpMessageHeaderAccessor headerAccessor) {
//        String username = headerAccessor.getUser().getName();
//
//        if (!(message.getContent() instanceof ChallengeCreateDto challenge)) {
//            throw new IllegalArgumentException("Invalid payload: Expected ChallengeCreateDto");
//        }
//
//        challengeRequestService.createChallenge(username, challenge.getUsername(), challenge.getEventType());
//    }

    // Not Required
//    @MessageMapping("/challenge/response")
//    public void handleChallengeResponse(@Payload WebSocketMessage message, SimpMessageHeaderAccessor headerAccessor) {
//        String username = headerAccessor.getUser().getName();
//
//        if (!(message.getContent() instanceof ChallengeRequestDto challenge)) {
//            throw new IllegalArgumentException("Invalid payload: Expected ChallengeRequestDto");
//        }
//
//        switch (message.getType()) {
//            case "ACCEPT":
//                challengeRequestService.acceptChallenge(username, challenge.getId());
//                break;
//            case "DECLINE":
//                challengeRequestService.declineChallenge(username, challenge.getId());
//                break;
//            default:
//                throw new IllegalArgumentException("Unsupported challenge response type: " + message.getType());
//        }
//    }

    // Not Required
//    @MessageMapping("/challenge/cancel")
//    public void handleChallengeCancel(@Payload WebSocketMessage message, SimpMessageHeaderAccessor headerAccessor) {
//        String username = headerAccessor.getUser().getName();
//
//        if (!(message.getContent() instanceof Long)) {
//            throw new IllegalArgumentException("Invalid payload: Expected Long (challengeId)");
//        }
//
//        Long challengeId = (Long) message.getContent();
//        challengeRequestService.cancelChallenge(username, challengeId);
//    }
}
