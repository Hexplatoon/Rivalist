        notification = notificationRepository.save(notification);

        // Convert to DTO for WebSocket message
        NotificationDto notificationDto = NotificationDto.fromEntity(notification);

        // Send real-time notification via WebSocket
        messagingTemplate.convertAndSendToUser(
            username,
            "/queue/notifications",
            notificationDto
        );
