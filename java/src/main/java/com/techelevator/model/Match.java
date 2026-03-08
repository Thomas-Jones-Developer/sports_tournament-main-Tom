package com.techelevator.model;

import java.time.LocalDate;
import java.time.LocalTime;

public class Match {
    private int matchId;
    private int tournamentId;
    private String matchName;
    private LocalDate matchDate;
    private LocalTime matchTime;
    private String location;
    private int team1Id;
    private int team2Id;
    private int team1Score;
    private int team2Score;
    private int winningTeamId;
    private int roundNumber;

    public Match() { }

    public Match(int matchId, int tournamentId, String matchName, LocalDate matchDate,
                 LocalTime matchTime, String location, int team1Id, int team2Id, int team1Score,
                 int team2Score, int winningTeamId, int roundNumber) {
        this.matchId = matchId;
        this.tournamentId = tournamentId;
        this.matchName = matchName;
        this.matchDate = matchDate;
        this.matchTime = matchTime;
        this.location = location;
        this.team1Id = team1Id;
        this.team2Id = team2Id;
        this.team1Score = team1Score;
        this.team2Score = team2Score;
        this.winningTeamId = winningTeamId;
        this.roundNumber = roundNumber;
    }

    public int getMatchId() {
        return matchId;
    }

    public void setMatchId(int matchId) {
        this.matchId = matchId;
    }

    public int getTournamentId() {
        return tournamentId;
    }

    public void setTournamentId(int tournamentId) {
        this.tournamentId = tournamentId;
    }

    public String getMatchName() {
        return matchName;
    }

    public void setMatchName(String matchName) {
        this.matchName = matchName;
    }

    public LocalDate getMatchDate() {
        return matchDate;
    }

    public void setMatchDate(LocalDate matchDate) {
        this.matchDate = matchDate;
    }

    public LocalTime getMatchTime() {
        return matchTime;
    }

    public void setMatchTime(LocalTime matchTime) {
        this.matchTime = matchTime;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public int getTeam1Id() {
        return team1Id;
    }

    public void setTeam1Id(int team1Id) {
        this.team1Id = team1Id;
    }

    public int getTeam2Id() {
        return team2Id;
    }

    public void setTeam2Id(int team2Id) {
        this.team2Id = team2Id;
    }

    public int getTeam1Score() {
        return team1Score;
    }

    public void setTeam1Score(int team1Score) {
        this.team1Score = team1Score;
    }

    public int getTeam2Score() {
        return team2Score;
    }

    public void setTeam2Score(int team2Score) {
        this.team2Score = team2Score;
    }

    public int getWinningTeamId() {
        return winningTeamId;
    }

    public void setWinningTeamId(int winningTeamId) {
        this.winningTeamId = winningTeamId;
    }

    public int getRoundNumber() {
        return roundNumber;
    }

    public void setRoundNumber(int roundNumber) {
        this.roundNumber = roundNumber;
    }

    // getters & setters
//    public int getMatchId() { return matchId; }
//    public void setMatchId(int matchId) { this.matchId = matchId; }
//
//    public int getTournamentId() { return tournamentId; }
//    public void setTournamentId(int tournamentId) { this.tournamentId = tournamentId; }
//
//    public String getMatchName() { return matchName; }
//    public void setMatchName(String matchName) { this.matchName = matchName; }
//
//    public LocalDate getMatchDate() { return matchDate; }
//    public void setMatchDate(LocalDate matchDate) { this.matchDate = matchDate; }
//
//    public LocalTime getMatchTime() { return matchTime; }
//    public void setMatchTime(LocalTime matchTime) { this.matchTime = matchTime; }
//
//    public String getLocation() { return location; }
//    public void setLocation(String location) { this.location = location; }
//
//    public Integer getTeam1Id() { return team1Id; }
//    public void setTeam1Id(Integer team1Id) { this.team1Id = team1Id; }
//
//    public Integer getTeam2Id() { return team2Id; }
//    public void setTeam2Id(Integer team2Id) { this.team2Id = team2Id; }
//
//    public Integer getTeam1Score() { return team1Score; }
//    public void setTeam1Score(Integer team1Score) { this.team1Score = team1Score; }
//
//    public Integer getTeam2Score() { return team2Score; }
//    public void setTeam2Score(Integer team2Score) { this.team2Score = team2Score; }
//
//    public Integer getWinningTeamId() { return winningTeamId; }
//    public void setWinningTeamId(Integer winningTeamId) { this.winningTeamId = winningTeamId; }
//
//    public int getRoundNumber() { return roundNumber; }
//    public void setRoundNumber(int roundNumber) { this.roundNumber = roundNumber; }
}
