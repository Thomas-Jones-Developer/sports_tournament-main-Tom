package com.techelevator.dao;

import com.techelevator.exception.DaoException;
import com.techelevator.model.Team;
import com.techelevator.model.Tournament;

import java.util.List;

public interface TeamDAO {

    Team getTeamById(int teamId);

    List<Team> getTeams();

    Team createTeam(Team team, int userId); //How do we make sure only captains can do this.

    Team updateTeam(int id, Team team) throws DaoException;

    int deleteTeamById(int teamId);




















}
