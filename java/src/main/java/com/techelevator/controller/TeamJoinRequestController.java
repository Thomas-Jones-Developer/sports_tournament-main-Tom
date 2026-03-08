package com.techelevator.controller;

import com.techelevator.dao.TeamJoinRequestDao;
import com.techelevator.dao.UserDao;
import com.techelevator.model.TeamJoinRequest;
import com.techelevator.model.User;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/teams")
@CrossOrigin
public class TeamJoinRequestController {

    private final TeamJoinRequestDao teamJoinRequestDao;
    private final UserDao userDao;

    public TeamJoinRequestController(TeamJoinRequestDao teamJoinRequestDao, UserDao userDao) {
        this.teamJoinRequestDao = teamJoinRequestDao;
        this.userDao = userDao;
    }

    // Player sends request to join team
    @PostMapping("/{teamId}/join-request")
    @ResponseStatus(HttpStatus.CREATED)
    public String createJoinRequest(@PathVariable int teamId, Principal principal) {
        User currentUser = userDao.getUserByUsername(principal.getName());
        teamJoinRequestDao.createJoinRequest(teamId, currentUser.getId());
        return "Join request sent for team ID: " + teamId;
    }

    // Captain views pending requests for their team
    @GetMapping("/{teamId}/join-requests")
    public List<TeamJoinRequest> getRequestsForTeam(@PathVariable int teamId) {
        return teamJoinRequestDao.getRequestsForTeam(teamId);
    }

    // DTO class to map JSON body for status update
    public static class StatusUpdate {
        private String status;
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }

    // Captain approves or rejects request
    @PutMapping("/join-request/{requestId}")
    public String updateRequestStatus(@PathVariable int requestId, @RequestBody StatusUpdate update) {
        String status = update.getStatus().toUpperCase();
        teamJoinRequestDao.updateRequestStatus(requestId, status);
        return "Request ID " + requestId + " updated to " + status;
    }
}
