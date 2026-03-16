package com.techelevator.dao;

import com.techelevator.exception.DaoException;
import com.techelevator.model.MatchChallenge;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.stereotype.Component;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
public class JdbcMatchChallengeDao implements MatchChallengeDao {

    private final JdbcTemplate jdbcTemplate;

    public JdbcMatchChallengeDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public MatchChallenge createChallenge(int challengerTeamId, int challengedTeamId, String locationName, String locationAddress, LocalDateTime matchTime) {
        String sql = "INSERT INTO match_challenge (challenger_team_id, challenged_team_id, location_name, location_address, match_time) " +
                "VALUES (?, ?, ?, ?, ?) RETURNING challenge_id";
        try {
            int newId = jdbcTemplate.queryForObject(sql, int.class, challengerTeamId, challengedTeamId, locationName, locationAddress,
                    matchTime != null ? Timestamp.valueOf(matchTime) : null);
            return getChallengeById(newId);
        } catch (DataAccessException e) {
            throw new DaoException("Error creating challenge", e);
        }
    }

    @Override
    public List<MatchChallenge> getChallengesReceivedByTeam(int teamId) {
        List<MatchChallenge> challenges = new ArrayList<>();
        String sql = "SELECT challenge_id, challenger_team_id, challenged_team_id, status, challenge_date, " +
                "hidden_sender, hidden_receiver, location_name, location_address, match_time " +
                "FROM match_challenge WHERE challenged_team_id = ? AND hidden_receiver = FALSE";
        SqlRowSet rs = jdbcTemplate.queryForRowSet(sql, teamId);
        while (rs.next()) {
            challenges.add(mapRowToChallenge(rs));
        }
        return challenges;
    }

    @Override
    public List<MatchChallenge> getChallengesSentByTeam(int teamId) {
        List<MatchChallenge> challenges = new ArrayList<>();
        String sql = "SELECT challenge_id, challenger_team_id, challenged_team_id, status, challenge_date, " +
                "hidden_sender, hidden_receiver, location_name, location_address, match_time " +
                "FROM match_challenge WHERE challenger_team_id = ? AND hidden_sender = FALSE";
        SqlRowSet rs = jdbcTemplate.queryForRowSet(sql, teamId);
        while (rs.next()) {
            challenges.add(mapRowToChallenge(rs));
        }
        return challenges;
    }

    @Override
    public MatchChallenge getChallengeById(int challengeId) {
        String sql = "SELECT challenge_id, challenger_team_id, challenged_team_id, status, challenge_date, " +
                "hidden_sender, hidden_receiver, location_name, location_address, match_time " +
                "FROM match_challenge WHERE challenge_id = ?";
        SqlRowSet rs = jdbcTemplate.queryForRowSet(sql, challengeId);
        if (rs.next()) {
            return mapRowToChallenge(rs);
        }
        return null;
    }

    @Override
    public void updateChallengeStatus(int challengeId, String status) {
        String sql = "UPDATE match_challenge SET status = ? WHERE challenge_id = ?";
        jdbcTemplate.update(sql, status, challengeId);
    }

    @Override
    public void hideSent(int challengeId) {
        String sql = "UPDATE match_challenge SET hidden_sender = TRUE WHERE challenge_id = ?";
        jdbcTemplate.update(sql, challengeId);
    }

    @Override
    public void hideReceived(int challengeId) {
        String sql = "UPDATE match_challenge SET hidden_receiver = TRUE WHERE challenge_id = ?";
        jdbcTemplate.update(sql, challengeId);
    }

    @Override
    public List<MatchChallenge> getAllAcceptedChallenges() {
        List<MatchChallenge> challenges = new ArrayList<>();
        String sql = "SELECT challenge_id, challenger_team_id, challenged_team_id, status, challenge_date, " +
                "hidden_sender, hidden_receiver, location_name, location_address, match_time " +
                "FROM match_challenge WHERE status = 'ACCEPTED'";
        SqlRowSet rs = jdbcTemplate.queryForRowSet(sql);
        while (rs.next()) {
            challenges.add(mapRowToChallenge(rs));
        }
        return challenges;
    }

    private MatchChallenge mapRowToChallenge(SqlRowSet rs) {
        MatchChallenge challenge = new MatchChallenge();
        challenge.setChallengeId(rs.getInt("challenge_id"));
        challenge.setChallengerTeamId(rs.getInt("challenger_team_id"));
        challenge.setChallengedTeamId(rs.getInt("challenged_team_id"));
        challenge.setStatus(rs.getString("status"));
        challenge.setChallengeDate(rs.getTimestamp("challenge_date").toLocalDateTime());
        challenge.setHiddenSender(rs.getBoolean("hidden_sender"));
        challenge.setHiddenReceiver(rs.getBoolean("hidden_receiver"));
        challenge.setLocationName(rs.getString("location_name"));
        challenge.setLocationAddress(rs.getString("location_address"));
        Timestamp matchTime = rs.getTimestamp("match_time");
        if (matchTime != null) challenge.setMatchTime(matchTime.toLocalDateTime());
        return challenge;
    }
}