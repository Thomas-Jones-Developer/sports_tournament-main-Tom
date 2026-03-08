package com.techelevator.dao;

import com.techelevator.exception.DaoException;
import com.techelevator.model.Match;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.jdbc.CannotGetJdbcConnectionException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Component
public class JdbcMatchDao implements MatchDao {

    private final JdbcTemplate jdbcTemplate;

    public JdbcMatchDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public Match getMatchById(int matchId) {
        String sql = "SELECT * FROM match_games WHERE match_id = ?;";
        SqlRowSet results = jdbcTemplate.queryForRowSet(sql, matchId);
        if (results.next()) {
            return mapRowToMatch(results);
        }
        return null;
    }

    @Override
    public Match createMatch(Match match, int id) {
        String sql = "INSERT INTO match_games (tournament_id, match_name, match_date, match_time, " +
                "location, team_1_id, team_2_id, team_1_score, team_2_score, winning_team_id, round_number) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING match_id;";

        Integer newId = jdbcTemplate.queryForObject(sql, Integer.class,
                match.getTournamentId(),
                match.getMatchName(),
                match.getMatchDate(),
                match.getMatchTime(),
                match.getLocation(),
                match.getTeam1Id(),
                match.getTeam2Id(),
                match.getTeam1Score(),
                match.getTeam2Score(),
                match.getWinningTeamId(),
                match.getRoundNumber()
        );

        match.setMatchId(newId);
        return match;
    }

    @Override
    public List<Match> getMatches() {
        List<Match> matches = new ArrayList<>();
        String sql = "SELECT * FROM match_games;";
        SqlRowSet results = jdbcTemplate.queryForRowSet(sql);
        while (results.next()) {
            matches.add(mapRowToMatch(results));
        }
        return matches;
    }

    @Override
    public Match updateMatch(int matchId, Match match) {
        String sql = "UPDATE match_games SET tournament_id = ?, match_name = ?, match_date = ?, match_time = ?, " +
                "location = ?, team_1_id = ?, team_2_id = ?, team_1_score = ?, team_2_score = ?, " +
                "winning_team_id = ?, round_number = ? WHERE match_id = ?;";

        try {
            int rowsAffected = jdbcTemplate.update(sql,
                    match.getTournamentId(),
                    match.getMatchName(),
                    match.getMatchDate(),
                    match.getMatchTime(),
                    match.getLocation(),
                    match.getTeam1Id(),
                    match.getTeam2Id(),
                    match.getTeam1Score(),
                    match.getTeam2Score(),
                    match.getWinningTeamId(),
                    match.getRoundNumber(),
                    match.getMatchId()
            );

            if (rowsAffected == 0) {
                throw new DaoException("No match found with ID: " + match.getMatchId());
            }

        } catch (CannotGetJdbcConnectionException e) {
            throw new DaoException("Unable to connect to server or database", e);
        } catch (DataIntegrityViolationException e) {
            throw new DaoException("Data integrity violation", e);
        }
        return match;
    }



    @Override
    public int deleteMatchById(int matchId) {
        String sql = "DELETE FROM match_games WHERE match_id = ?;";
        try {
            return jdbcTemplate.update(sql, matchId);
        } catch (DataAccessException e) {
            throw new DaoException("Error deleting team with ID " + matchId, e);
        }

    }

    private Match mapRowToMatch(SqlRowSet rs) {
        Match match = new Match();

        match.setMatchId(rs.getInt("match_id"));
        match.setTournamentId(rs.getInt("tournament_id"));
        match.setMatchName(rs.getString("match_name"));

        String matchDateStr = rs.getString("match_date");
        if (matchDateStr != null) {
            match.setMatchDate(LocalDate.parse(matchDateStr));
        }

        String matchTimeStr = rs.getString("match_time");
        if (matchTimeStr != null) {
            match.setMatchTime(LocalTime.parse(matchTimeStr));
        }

        match.setLocation(rs.getString("location"));
        match.setTeam1Id((Integer) rs.getObject("team_1_id"));
        match.setTeam2Id((Integer) rs.getObject("team_2_id"));
        match.setTeam1Score((Integer) rs.getObject("team_1_score"));
        match.setTeam2Score((Integer) rs.getObject("team_2_score"));
        match.setWinningTeamId((Integer) rs.getObject("winning_team_id"));
        match.setRoundNumber(rs.getInt("round_number"));
        return match;
    }
}