package com.techelevator.dao;

import com.techelevator.model.TeamJoinRequest;
import java.util.List;

public interface TeamJoinRequestDao {
    void createJoinRequest(int teamId, int userId, String type);
    List<TeamJoinRequest> getRequestsForTeam(int teamId);
    List<TeamJoinRequest> getInvitesForUser(int userId);
    List<TeamJoinRequest> getRequestsByUserId(int userId);
    void updateRequestStatus(int requestId, String status);
}