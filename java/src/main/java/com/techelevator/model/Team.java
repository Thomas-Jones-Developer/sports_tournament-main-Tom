package com.techelevator.model;

public class Team {

    private int teamId;
    private int sportId;
    private String teamName;
    private int userId;
    private boolean acceptingMembers;
    private int numberOfMembers;
    private String sportName; // new field

    // **Default constructor required by Jackson**
    public Team() {
    }

    // Constructor without sportName (existing usage)
    public Team(int teamId, int sportId, String teamName, int userId, boolean acceptingMembers, int numberOfMembers) {
        this.teamId = teamId;
        this.sportId = sportId;
        this.teamName = teamName;
        this.userId = userId;
        this.acceptingMembers = acceptingMembers;
        this.numberOfMembers = numberOfMembers;
    }

    // Optional: Constructor with sportName
    public Team(int teamId, int sportId, String teamName, int userId, boolean acceptingMembers, int numberOfMembers, String sportName) {
        this(teamId, sportId, teamName, userId, acceptingMembers, numberOfMembers);
        this.sportName = sportName;
    }

    // Getters & Setters
    public int getTeamId() { return teamId; }
    public void setTeamId(int teamId) { this.teamId = teamId; }

    public int getSportId() { return sportId; }
    public void setSportId(int sportId) { this.sportId = sportId; }

    public String getTeamName() { return teamName; }
    public void setTeamName(String teamName) { this.teamName = teamName; }

    public int getUserId() { return userId; }
    public void setUserId(int userId) { this.userId = userId; }

    public boolean isAcceptingMembers() { return acceptingMembers; }
    public void setAcceptingMembers(boolean acceptingMembers) { this.acceptingMembers = acceptingMembers; }

    public int getNumberOfMembers() { return numberOfMembers; }
    public void setNumberOfMembers(int numberOfMembers) { this.numberOfMembers = numberOfMembers; }

    public String getSportName() { return sportName; }
    public void setSportName(String sportName) { this.sportName = sportName; }

    @Override
    public String toString() {
        return "Team{" +
                "teamId=" + teamId +
                ", sportId=" + sportId +
                ", teamName='" + teamName + '\'' +
                ", userId=" + userId +
                ", acceptingMembers=" + acceptingMembers +
                ", numberOfMembers=" + numberOfMembers +
                ", sportName='" + sportName + '\'' +
                '}';
    }
}
