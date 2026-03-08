package com.techelevator.controller;

import com.techelevator.dao.MatchDao;
import com.techelevator.dao.UserDao;
import com.techelevator.exception.DaoException;
import com.techelevator.model.Match;
import com.techelevator.model.Team;
import com.techelevator.model.User;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/matches")
@CrossOrigin
public class MatchController {

    private final MatchDao matchDao;
    private final UserDao userDao;

    @Autowired
    public MatchController(MatchDao matchDao, UserDao userDao) {
        this.matchDao = matchDao;
        this.userDao = userDao;
    }

    @RequestMapping(method = RequestMethod.GET)
    public List<Match> getAllMatches() {
        try {
            return matchDao.getMatches();
        } catch (DaoException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage(), e);
        }
    }

    @RequestMapping(path = "/{matchId}", method = RequestMethod.GET)
    public Match getMatchById(@PathVariable int matchId) {
        Match match = matchDao.getMatchById(matchId);
        if (match == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "match not found.");
        }
        return match;
    }

    @RequestMapping(path = "/register", method = RequestMethod.POST)
    public ResponseEntity<Match> createMatch(@Valid @RequestBody Match match, Principal principal) {
        String username = principal.getName();
        User user = userDao.getUserByUsername(username);

        if (user == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Match not found.");
        }

        Match createdMatch = matchDao.createMatch(match, user.getId());
        return new ResponseEntity<>(createdMatch, HttpStatus.CREATED);
    }

    @RequestMapping(path = "/{matchId}", method = RequestMethod.PUT)
    public Match updateMatchById(@PathVariable int matchId,
                                 @Valid @RequestBody Match updatedmatch,
                                 Principal principal) {
        Match existingMatch = matchDao.getMatchById(matchId);
        if (existingMatch == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Tournament not found.");
        }
        updatedmatch.setMatchId(matchId);
        return matchDao.updateMatch(matchId, updatedmatch);
//        return matchDao.getMatchById(matchId);
    }

    @RequestMapping(path = "/{matchId}", method = RequestMethod.DELETE)
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<String> deleteMatchById(@PathVariable int matchId, Principal principal) {
        int existingMatch = matchDao.deleteMatchById(matchId);
        if (existingMatch == 0) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Match not found.");
        }
        matchDao.deleteMatchById(matchId);

        return new ResponseEntity<>(HttpStatus.OK);

    }
}

