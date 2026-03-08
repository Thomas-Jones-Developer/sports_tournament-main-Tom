package com.techelevator.model;

import java.time.LocalDate;

public class Tournament {
    private int tournamentId;
    private int sportId;
    private String name;
    private String season;
    private LocalDate startDate;
    private LocalDate endDate;
    private int numberOfRounds;
    private int organizerId;
    private int entryFee;
    private String prizeDescription;
    private String location;
    private String sportName;

    private String tournamentState;

    public String getTournamentState() {
        return tournamentState;
    }

    public void setTournamentState(String tournamentState) {
        this.tournamentState = tournamentState;
    }

    public Tournament(int tournamentId, int sportId, String name, String season, LocalDate startDate, LocalDate endDate,
                      int numberOfRounds, int entryFee, String prizeDescription, String location) {
        this.tournamentId = tournamentId;
        this.sportId = sportId;
        this.name = name;
        this.season = season;
        this.startDate = startDate;
        this.endDate = endDate;
        this.numberOfRounds = numberOfRounds;
        this.entryFee = entryFee;
        this.prizeDescription = prizeDescription;
        this.location = location;
    }

    public Tournament(){

    }

    public String getSportName() {
        return sportName;
    }

    public int getTournamentId() {
        return tournamentId;
    }

    public void setTournamentId(int tournamentId) {
        this.tournamentId = tournamentId;
    }

    public int getSportId() {
        return sportId;
    }

    public void setSportId(int sportId) {
        this.sportId = sportId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSeason() {
        return season;
    }

    public void setSeason(String season) {
        this.season = season;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public int getNumberOfRounds() {
        return numberOfRounds;
    }

    public void setNumberOfRounds(int numberOfRounds) {
        this.numberOfRounds = numberOfRounds;
    }

    public int getEntryFee() {
        return entryFee;
    }

    public void setEntryFee(int entryFee) {
        this.entryFee = entryFee;
    }

    public String getPrizeDescription() {
        return prizeDescription;
    }

    public void setPrizeDescription(String prizeDescription) {
        this.prizeDescription = prizeDescription;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }


    public int getOrganizerId() {
        return organizerId;
    }

    public void setOrganizerId(int organizerId) {
        this.organizerId = organizerId;
    }

    public void setSportName(String sportName) {
        this.sportName = sportName;
    }

    public void setId(int tournamentId) {
    }
}