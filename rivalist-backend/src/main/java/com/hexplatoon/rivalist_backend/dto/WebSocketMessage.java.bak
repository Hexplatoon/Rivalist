package com.hexplatoon.rivalist_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object for WebSocket communication.
 * Used to structure messages sent via WebSocket in the Challenge Request system.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class WebSocketMessage {
    /**
     * The message type (e.g., "CHALLENGE_SENT", "CHALLENGE_ACCEPTED").
     */
    private String type;
    
    /**
     * The message content, which can be any object.
     * Typically contains challenge data or IDs.
     */
    private Object content;
}

