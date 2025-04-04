package com.hexplatoon.rivalist_backend.controller;

import com.hexplatoon.rivalist_backend.dto.NotificationDto;
import com.hexplatoon.rivalist_backend.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    @Autowired
    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping
    public ResponseEntity<List<NotificationDto>> getNotifications(Authentication authentication) {
        String username = authentication.getName();
        List<NotificationDto> notifications = notificationService.getUserNotifications(username)
            .stream()
            .map(NotificationDto::fromEntity)
            .collect(Collectors.toList());
        return ResponseEntity.ok(notifications);
    }

    @PutMapping("/{notificationId}/read")
    public ResponseEntity<?> markAsRead(
            @PathVariable Long notificationId,
            Authentication authentication) {
        String username = authentication.getName();
        notificationService.markNotificationAsRead(notificationId, username);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/read-all")
    public ResponseEntity<?> markAllAsRead(Authentication authentication) {
        String username = authentication.getName();
        notificationService.markAllNotificationsAsRead(username);
        return ResponseEntity.ok().build();
    }
}

