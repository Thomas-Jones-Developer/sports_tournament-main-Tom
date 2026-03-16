package com.techelevator.model;

import java.time.LocalDateTime;

public class TeamJoinRequest {

    private int requestId;
    private int teamId;
    private int userId;
    private String status;
    private LocalDateTime requestDate;
    private String type;
    private boolean hiddenSender;
    private boolean hiddenReceiver;

    public int getRequestId() { return requestId; }
    public void setRequestId(int requestId) { this.requestId = requestId; }

    public int getTeamId() { return teamId; }
    public void setTeamId(int teamId) { this.teamId = teamId; }

    public int getUserId() { return userId; }
    public void setUserId(int userId) { this.userId = userId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getRequestDate() { return requestDate; }
    public void setRequestDate(LocalDateTime requestDate) { this.requestDate = requestDate; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public boolean isHiddenSender() { return hiddenSender; }
    public void setHiddenSender(boolean hiddenSender) { this.hiddenSender = hiddenSender; }

    public boolean isHiddenReceiver() { return hiddenReceiver; }
    public void setHiddenReceiver(boolean hiddenReceiver) { this.hiddenReceiver = hiddenReceiver; }
}