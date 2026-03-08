package com.techelevator.controller;

import com.techelevator.dao.TournamentDao;
import com.techelevator.dao.UserDao;
import com.techelevator.exception.DaoException;
import com.techelevator.model.Tournament;
import com.techelevator.model.TournamentStatusDTO;
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
@RequestMapping("/tournament")
//@PreAuthorize("isAuthenticated()")
public class TournamentController {

    private final TournamentDao tournamentDao;
    private final UserDao userDao;

    @Autowired
    public TournamentController(TournamentDao tournamentDao, UserDao userDao) {
        this.tournamentDao = tournamentDao;
        this.userDao = userDao;
    }

    // GET all tournaments
    @RequestMapping(method = RequestMethod.GET)
    public List<Tournament> getTournaments() {
        try {
            return tournamentDao.getTournaments();
        } catch (DaoException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage(), e);
        }
    }

    //TODO: Front End , pick the teams that will be in the 1st round. Populate the 1st 8 slots of the array
    // send this array to this endpoint:

    @RequestMapping(path="/update-pairing/{id}", method=RequestMethod.PUT)
    public Tournament something(@RequestBody TournamentStatusDTO tournamentStatusDTO, @PathVariable int id) {
        return tournamentDao.updatePairings(tournamentStatusDTO.getStatus(), id);
    }

    // POST: create a new tournament
// POST: create a new tournament
    @PreAuthorize("isAuthenticated()")
    @PostMapping
    public ResponseEntity<Tournament> createTournament(@RequestBody Tournament tournament, Principal principal) {
        String username = principal.getName();
        User user = userDao.getUserByUsername(username);

        if (user == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found.");
        }

        // Check if user has the ADMIN role
        boolean isAdmin = user.getAuthorities().stream()
                .anyMatch(a -> "ROLE_ADMIN".equalsIgnoreCase(a.getName()));

        if (!isAdmin) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You must be an admin to create a tournament.");
        }

        Tournament createdTournament = tournamentDao.createTournament(tournament, user.getId());
        return new ResponseEntity<>(createdTournament, HttpStatus.CREATED);
    }

    // PUT: update an existing tournament
    @PreAuthorize("isAuthenticated()")
    @ResponseStatus(HttpStatus.OK)
    @RequestMapping(path = "/{tournamentId}", method = RequestMethod.PUT)
    public Tournament updateTournament(@PathVariable int tournamentId,
                                       @Valid @RequestBody Tournament updatedTournament,
                                       Principal principal) {
        // Fetch the existing tournament
        Tournament existingTournament = tournamentDao.getTournamentById(tournamentId);
        if (existingTournament == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Tournament not found.");
        }

        // Ensure the path ID matches the object ID
        updatedTournament.setTournamentId(tournamentId);

        // Update the tournament via DAO
        return tournamentDao.updateTournament(tournamentId, updatedTournament);
    }

    @PreAuthorize("isAuthenticated()")
    @ResponseStatus(HttpStatus.OK)
    @RequestMapping(path = "/{tournamentId}", method = RequestMethod.DELETE)
    public void deleteTournament(@PathVariable int tournamentId) {
        this.tournamentDao.deleteTournamentById(tournamentId);
    }

    @PreAuthorize("isAuthenticated()")
    @ResponseStatus(HttpStatus.OK)
    @RequestMapping(path = "/{tournamentId}", method = RequestMethod.GET)
    public Tournament getTournamentById(@PathVariable int tournamentId, Principal principal) {
        Tournament tournament = null;

        try {
            tournament = tournamentDao.getTournamentById(tournamentId);
        }
        catch (DaoException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }
        return tournament;
    }

}