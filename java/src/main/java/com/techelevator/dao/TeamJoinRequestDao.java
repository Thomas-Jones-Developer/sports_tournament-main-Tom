package com.techelevator.dao;

import com.techelevator.model.TeamJoinRequest;

import java.util.List;

public interface TeamJoinRequestDao {

    void createJoinRequest(int teamId, int userId);
    List<TeamJoinRequest> getRequestsForTeam(int teamId);
    void updateRequestStatus(int requestId, String status); // APPROVED or REJECTED

}
