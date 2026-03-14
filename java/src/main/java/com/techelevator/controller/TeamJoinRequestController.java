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

    // Player sends join request
    @PostMapping("/{teamId}/join-request")
    @ResponseStatus(HttpStatus.CREATED)
    public String createJoinRequest(@PathVariable int teamId, Principal principal) {
        User currentUser = userDao.getUserByUsername(principal.getName());
        teamJoinRequestDao.createJoinRequest(teamId, currentUser.getId(), "JOIN_REQUEST");
        return "Join request sent for team ID: " + teamId;
    }


    // Owner invites a player
    @PostMapping("/{teamId}/invite/{userId}")
    @ResponseStatus(HttpStatus.CREATED)
    public String invitePlayer(@PathVariable int teamId, @PathVariable int userId) {
        teamJoinRequestDao.createJoinRequest(teamId, userId, "INVITE");
        return "Invite sent to user ID: " + userId;
    }

    @GetMapping("/{teamId}/join-requests")
    public List<TeamJoinRequest> getRequestsForTeam(@PathVariable int teamId) {
        return teamJoinRequestDao.getRequestsForTeam(teamId);
    }

    public static class StatusUpdate {
        private String status;
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }

    @PutMapping("/join-request/{requestId}")
    public String updateRequestStatus(@PathVariable int requestId, @RequestBody StatusUpdate update) {
        String status = update.getStatus().toUpperCase();
        teamJoinRequestDao.updateRequestStatus(requestId, status);

        if (status.equals("ACCEPTED")) {
            TeamJoinRequest request = teamJoinRequestDao.getRequestById(requestId);
            teamJoinRequestDao.addTeamMember(request.getTeamId(), request.getUserId());
        }

        return "Request ID " + requestId + " updated to " + status;
    }

    // User views their own sent requests
    @GetMapping("/user/{userId}/join-requests")
    public List<TeamJoinRequest> getRequestsByUser(@PathVariable int userId) {
        return teamJoinRequestDao.getRequestsByUserId(userId);
    }

    // Get all requests for a team regardless of type
    @GetMapping("/{teamId}/all-requests")
    public List<TeamJoinRequest> getAllRequestsForTeam(@PathVariable int teamId) {
        return teamJoinRequestDao.getAllRequestsForTeam(teamId);
    }

    // Player views their invites
    @GetMapping("/invites/user/{userId}")
    public List<TeamJoinRequest> getInvitesForUser(@PathVariable int userId) {
        return teamJoinRequestDao.getInvitesForUser(userId);
    }

    // Get all invites sent by a team
    @GetMapping("/{teamId}/sent-invites")
    public List<TeamJoinRequest> getInvitesByTeam(@PathVariable int teamId) {
        return teamJoinRequestDao.getInvitesByTeam(teamId);
    }
}