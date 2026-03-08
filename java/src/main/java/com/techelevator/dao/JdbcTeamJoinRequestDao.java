package com.techelevator.dao;

import com.techelevator.model.TeamJoinRequest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class JdbcTeamJoinRequestDao implements TeamJoinRequestDao{

    private final JdbcTemplate jdbcTemplate;

    public JdbcTeamJoinRequestDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void createJoinRequest(int teamId, int userId) {
        String sql = "INSERT INTO team_join_request (team_id, user_id) VALUES (?, ?) " +
                "ON CONFLICT (team_id, user_id) DO NOTHING";
        jdbcTemplate.update(sql, teamId, userId);
    }

    @Override
    public List<TeamJoinRequest> getRequestsForTeam(int teamId) {
        List<TeamJoinRequest> requests = new ArrayList<>();
        String sql = "SELECT request_id, team_id, user_id, status, request_date " +
                "FROM team_join_request WHERE team_id = ?";
        SqlRowSet rs = jdbcTemplate.queryForRowSet(sql, teamId);
        while (rs.next()) {
            TeamJoinRequest request = mapRowToTeamJoinRequest(rs);
            requests.add(request);
        }
        return requests;
    }

    @Override
    public void updateRequestStatus(int requestId, String status) {
        String sql = "UPDATE team_join_request SET status = ? WHERE request_id = ?";
        jdbcTemplate.update(sql, status, requestId);
    }

    private TeamJoinRequest mapRowToTeamJoinRequest(SqlRowSet rs) {
        TeamJoinRequest request = new TeamJoinRequest();
        request.setRequestId(rs.getInt("request_id"));
        request.setTeamId(rs.getInt("team_id"));
        request.setUserId(rs.getInt("user_id"));
        request.setStatus(rs.getString("status"));
        request.setRequestDate(rs.getTimestamp("request_date").toLocalDateTime());
        return request;
    }
}


