package com.example.typing;

import jakarta.persistence.*;

@Entity
public class TypingResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int wpm;
    private int accuracy;

    public TypingResult() {}

    public TypingResult(int wpm, int accuracy) {
        this.wpm = wpm;
        this.accuracy = accuracy;
    }

    public Long getId() { return id; }
    public int getWpm() { return wpm; }
    public void setWpm(int wpm) { this.wpm = wpm; }
    public int getAccuracy() { return accuracy; }
    public void setAccuracy(int accuracy) { this.accuracy = accuracy; }
}