package com.techelevator.model;

import java.time.LocalDateTime;

public class MatchChallenge {

    private int challengeId;
    private int challengerTeamId;
    private int challengedTeamId;
    private String status;
    private LocalDateTime challengeDate;
    private boolean hiddenSender;
    private boolean hiddenReceiver;

    public int getChallengeId() { return challengeId; }
    public void setChallengeId(int challengeId) { this.challengeId = challengeId; }

    public int getChallengerTeamId() { return challengerTeamId; }
    public void setChallengerTeamId(int challengerTeamId) { this.challengerTeamId = challengerTeamId; }

    public int getChallengedTeamId() { return challengedTeamId; }
    public void setChallengedTeamId(int challengedTeamId) { this.challengedTeamId = challengedTeamId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getChallengeDate() { return challengeDate; }
    public void setChallengeDate(LocalDateTime challengeDate) { this.challengeDate = challengeDate; }

    public boolean isHiddenSender() { return hiddenSender; }
    public void setHiddenSender(boolean hiddenSender) { this.hiddenSender = hiddenSender; }

    public boolean isHiddenReceiver() { return hiddenReceiver; }
    public void setHiddenReceiver(boolean hiddenReceiver) { this.hiddenReceiver = hiddenReceiver; }
}