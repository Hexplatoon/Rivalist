package com.hexplatoon.rivalist_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for friend status information
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FriendStatusDto {
    
    private String status;      // e.g., "PENDING", "ACCEPTED", "BLOCKED", "NONE"
    private String fromUser;    // username of the request sender
    private String toUser;      // username of the request receiver
}

