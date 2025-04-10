package com.hexplatoon.rivalist_backend.dto.battle;
import lombok.Data;

@Data
public class Readiness {
    private boolean challengerOk = false;
    private boolean opponentOk = false;
}
