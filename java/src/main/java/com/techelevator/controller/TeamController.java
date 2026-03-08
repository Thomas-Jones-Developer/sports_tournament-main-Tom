package com.techelevator.controller;

import com.techelevator.dao.TeamDAO;
import com.techelevator.dao.UserDao;
import com.techelevator.exception.DaoException;
import com.techelevator.model.Team;
import com.techelevator.model.User;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.security.Principal;
import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/team")
//@PreAuthorize("isAuthenticated()")
public class TeamController {

    private final TeamDAO teamDao;
    private final UserDao userDao;

    @Autowired
    public TeamController(TeamDAO teamDao, UserDao userDao) {
        this.teamDao = teamDao;
        this.userDao = userDao;
    }

    // GET all teams
    @RequestMapping(method = RequestMethod.GET)
    public List<Team> getTeams() {
        try {
            return teamDao.getTeams();
        } catch (DaoException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage(), e);
        }
    }

    // GET team by ID
    @PreAuthorize("isAuthenticated()")
    @RequestMapping(path = "/{teamId}", method = RequestMethod.GET)
    public Team getTeamById(@PathVariable int teamId) {
        Team team = teamDao.getTeamById(teamId);
        if (team == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Team not found.");
        }
        return team;
    }

    // POST: create a new team
    @PreAuthorize("isAuthenticated()")
    @RequestMapping(path = "/register", method = RequestMethod.POST)
    public ResponseEntity<Team> createTeam(@Valid @RequestBody Team team, Principal principal) {
        String username = principal.getName();
        User user = userDao.getUserByUsername(username);

        if (user == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found.");
        }

        // Optional: Restrict to captains only
        // if (!user.getRole().equalsIgnoreCase("CAPTAIN")) {
        //     throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only captains can create teams.");
        // }

        Team createdTeam = teamDao.createTeam(team, user.getId());
        return new ResponseEntity<>(createdTeam, HttpStatus.CREATED);
    }

    // PUT: update an existing team
    @PreAuthorize("isAuthenticated()")
    @RequestMapping(path = "/{teamId}", method = RequestMethod.PUT)
    @ResponseStatus(HttpStatus.OK)
    public Team updateTeam(@PathVariable int teamId,
                           @Valid @RequestBody Team updatedTeam,
                           Principal principal) {
        Team existingTeam = teamDao.getTeamById(teamId);
        if (existingTeam == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Team not found.");
        }

        // Ownership check (optional)
        // String username = principal.getName();
        // User user = userDao.getUserByUsername(username);
        // if (user.getId() != existingTeam.getCaptainUserId()) {
        //     throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not the captain of this team.");
        // }

        updatedTeam.setTeamId(teamId);
        return teamDao.updateTeam(teamId, updatedTeam);
    }

    // DELETE: delete team by ID
    @PreAuthorize("isAuthenticated()")
    @RequestMapping(path = "/{teamId}", method = RequestMethod.DELETE)
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<String> deleteTeamById(@PathVariable int teamId, Principal principal) {
        Team existingTeam = teamDao.getTeamById(teamId);
        if (existingTeam == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Team not found.");
        }

        // Ownership check (optional)
        // String username = principal.getName();
        // User user = userDao.getUserByUsername(username);
        // if (user.getId() != existingTeam.getCaptainUserId()) {
        //     throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not the captain of this team.");
        // }

        teamDao.deleteTeamById(teamId);
        String message = "The following team was deleted: " + existingTeam.getTeamName() + " (ID: " + existingTeam.getTeamId() + ")";
        return new ResponseEntity<>(message, HttpStatus.OK);
    }
}
