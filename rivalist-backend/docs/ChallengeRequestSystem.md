# Challenge Friend to Battle System

## Overview
The Challenge Friend to Battle system enables users to challenge their friends to 1v1 battles in different event types. The system uses WebSocket for real-time notifications and provides a 60-second window for accepting challenges before they expire.

## Components Implemented

### 1. Database Schema
- `challenge_requests` table with following columns:
  - `id`: Primary key
  - `sender_id`: Foreign key reference to users table
  - `recipient_id`: Foreign key reference to users table
  - `battle_id`: Foreign key reference to battles table (nullable)
  - `status`: Challenge status (PENDING, ACCEPTED, DECLINED, EXPIRED, CANCELLED)
  - `event_type`: Type of battle event
  - `created_at`: Timestamp when challenge was created
  - `expires_at`: Expiration timestamp (60 seconds after creation)
- Indexes for efficient querying:
  - `idx_challenge_requests_sender_status`
  - `idx_challenge_requests_recipient_status`
  - `idx_challenge_requests_expires_at`
- Foreign key constraints to ensure data integrity

### 2. Entity and Repository
- `ChallengeRequest.java`: JPA entity with proper relationships and mapping
- `ChallengeRequestRepository.java`: Repository interface with methods for:
  - Finding active challenges by sender/recipient
  - Finding expired challenges
  - Finding pending challenges between users
  - Updating challenge status
  - Linking battles to challenges

### 3. Data Transfer Objects
- `ChallengeRequestDto.java`: Response DTO with challenge details
- `ChallengeCreateDto.java`: Request DTO for challenge creation

### 4. Service Layer
- `ChallengeRequestService.java`: Core business logic including:
  - Challenge lifecycle management (create, accept, decline, cancel)
  - Friendship validation before allowing challenges
  - Battle creation when challenges are accepted
  - WebSocket notifications for real-time updates
  - Scheduled task for handling expired challenges
  - Transaction management and error handling

### 5. Controller Layer
- `ChallengeRequestController.java`: Exposes functionality through:
  - REST endpoints for CRUD operations
  - WebSocket message handlers for real-time interactions
  - Security annotations to ensure authenticated access
  - Proper error handling and HTTP status codes

## User Flow
1. User A sends a challenge to User B (friend)
2. User B receives a real-time notification via WebSocket
3. User B has 60 seconds to accept or decline the challenge
4. If User B accepts, a battle is created and both users are directed to it
5. If User B declines, both users are notified
6. If no action is taken within 60 seconds, the challenge expires automatically

## WebSocket Events
- `CHALLENGE_SENT`: Notifies sender that challenge was sent
- `CHALLENGE_RECEIVED`: Notifies recipient of incoming challenge
- `CHALLENGE_ACCEPTED`: Notifies both users when challenge is accepted
- `CHALLENGE_DECLINED`: Notifies both users when challenge is declined
- `CHALLENGE_EXPIRED`: Notifies both users when challenge expires
- `CHALLENGE_CANCELLED`: Notifies both users when challenge is cancelled

## Next Steps

### 1. Version Control
Add all created files to Git:
```bash
git add src/main/java/com/hexplatoon/rivalist_backend/controller/ChallengeRequestController.java
git add src/main/java/com/hexplatoon/rivalist_backend/dto/ChallengeCreateDto.java
git add src/main/java/com/hexplatoon/rivalist_backend/dto/ChallengeRequestDto.java
git add src/main/java/com/hexplatoon/rivalist_backend/entity/ChallengeRequest.java
git add src/main/java/com/hexplatoon/rivalist_backend/repository/ChallengeRequestRepository.java
git add src/main/java/com/hexplatoon/rivalist_backend/service/ChallengeRequestService.java
git add src/main/resources/db/
```

### 2. Frontend Integration
- Update `WaitingForFriend.tsx` to subscribe to challenge WebSocket events
- Modify `BattleTypeSelection.tsx` to allow selecting friends to challenge
- Create UI components for challenge notifications
- Implement countdown timer for challenge expiration
- Add confirmation dialogs for accepting/declining challenges

### 3. Testing
- Unit tests for repository queries
- Integration tests for service business logic
- WebSocket message handling tests
- Challenge expiration tests

### 4. Documentation
- API documentation for new endpoints
- WebSocket event documentation for frontend developers
- Database schema documentation for database administrators

### 5. Deployment
- Database migration strategy
- Feature flag for gradual rollout
- Monitoring for potential performance issues

