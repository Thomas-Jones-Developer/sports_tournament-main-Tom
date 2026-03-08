package com.techelevator.dao;

import com.techelevator.exception.DaoException;
import com.techelevator.model.Team;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class JdbcTeamDao implements TeamDAO {

    private final JdbcTemplate jdbcTemplate;

    public JdbcTeamDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public Team getTeamById(int teamId) {
        Team team = null;
        String sql = "SELECT t.team_id, t.sport_id, t.team_name, t.user_id, t.accepting_members, " +
                "t.number_of_members, s.sport_name " +
                "FROM team t " +
                "JOIN sport s ON t.sport_id = s.sport_id " +
                "WHERE t.team_id = ?;";

        try {
            SqlRowSet results = jdbcTemplate.queryForRowSet(sql, teamId);
            if (results.next()) {
                team = mapRowToTeam(results);
            }
        } catch (DataAccessException e) {
            throw new DaoException("Error retrieving team with ID " + teamId, e);
        }
        return team;
    }

    @Override
    public List<Team> getTeams() {
        List<Team> teams = new ArrayList<>();
        String sql = "SELECT t.team_id, t.sport_id, t.team_name, t.user_id, t.accepting_members, " +
                "t.number_of_members, s.sport_name " +
                "FROM team t " +
                "JOIN sport s ON t.sport_id = s.sport_id;";

        try {
            SqlRowSet results = jdbcTemplate.queryForRowSet(sql);
            while (results.next()) {
                teams.add(mapRowToTeam(results));
            }
        } catch (DataAccessException e) {
            throw new DaoException("Error retrieving all teams", e);
        }
        return teams;
    }

    @Override
    public Team createTeam(Team team, int userId) {
        String sql = "INSERT INTO team (sport_id, team_name, user_id, accepting_members, number_of_members) " +
                "VALUES (?, ?, ?, ?, ?) RETURNING team_id;";

        try {
            int newId = jdbcTemplate.queryForObject(sql, int.class,
                    team.getSportId(),
                    team.getTeamName(),
                    userId,
                    team.isAcceptingMembers(),
                    team.getNumberOfMembers());

            return getTeamById(newId);
        } catch (DataAccessException e) {
            throw new DaoException("Error creating team", e);
        }
    }

    @Override
    public Team updateTeam(int id, Team team) throws DaoException {
        String sql = "UPDATE team SET sport_id = ?, team_name = ?, user_id = ?, accepting_members = ?, number_of_members = ? " +
                "WHERE team_id = ?;";

        try {
            int rowsAffected = jdbcTemplate.update(sql,
                    team.getSportId(),
                    team.getTeamName(),
                    team.getUserId(),
                    team.isAcceptingMembers(),
                    team.getNumberOfMembers(),
                    id);

            if (rowsAffected == 0) {
                throw new DaoException("No team found to update with ID " + id);
            }

            return getTeamById(id);
        } catch (DataAccessException e) {
            throw new DaoException("Error updating team with ID " + id, e);
        }
    }

    @Override
    public int deleteTeamById(int teamId) {
        String sql = "DELETE FROM team WHERE team_id = ?;";
        try {
            return jdbcTemplate.update(sql, teamId);
        } catch (DataAccessException e) {
            throw new DaoException("Error deleting team with ID " + teamId, e);
        }
    }

    private Team mapRowToTeam(SqlRowSet rs) {
        Team team = new Team(
                rs.getInt("team_id"),
                rs.getInt("sport_id"),
                rs.getString("team_name"),
                rs.getInt("user_id"),
                rs.getBoolean("accepting_members"),
                rs.getInt("number_of_members")
        );
        // Add sportName from join
        team.setSportName(rs.getString("sport_name"));
        return team;
    }
}
