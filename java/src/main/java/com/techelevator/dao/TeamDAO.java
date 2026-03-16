package com.techelevator.dao;

import com.techelevator.exception.DaoException;
import com.techelevator.model.Team;
import com.techelevator.model.Tournament;
import com.techelevator.model.User;

import java.util.List;

public interface TeamDAO {

    Team getTeamById(int teamId);

    List<Team> getTeams();

    List<User> getTeamMembers(int teamId);

    Team createTeam(Team team, int userId); //How do we make sure only captains can do this.

    Team updateTeam(int id, Team team) throws DaoException;

    Team getTeamByMemberId(int userId);

    int deleteTeamById(int teamId);

    List<Team> getTeamsByOwnerId(int userId);

    void removeTeamMember(int teamId, int userId);






















}
