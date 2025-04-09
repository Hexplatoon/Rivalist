package com.hexplatoon.rivalist_backend.entity.battle;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "battles", indexes = {
        @Index(name = "idx_player1", columnList = "player1_id"),
        @Index(name = "idx_player2", columnList = "player2_id"),
        @Index(name = "idx_status", columnList = "status"),
        @Index(name = "idx_category", columnList = "category")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Battle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Category category;

    @Column(name = "player1_id", nullable = false)
    private Long player1Id;

    @Column(name = "player2_id", nullable = false)
    private Long player2Id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "started_at")
    private LocalDateTime startedAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Lob
    @Column(name = "result_json", columnDefinition = "TEXT")
    private String resultJson;

    @Lob
    @Column(name = "config_json", columnDefinition = "TEXT")
    private String configJson;

    @Column(name = "winner_id")
    private Long winnerId;

    public enum Category {
        CSS, TB, CF
    }

    public enum Status {
        ONGOING, CANCELED, ENDED, WAITING
    }

    private boolean challengerOk = false;
    private boolean opponentOk = false;
}

