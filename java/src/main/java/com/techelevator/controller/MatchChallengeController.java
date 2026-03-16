package com.techelevator.controller;

import com.techelevator.dao.MatchChallengeDao;
import com.techelevator.model.MatchChallenge;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/challenges")
@CrossOrigin
public class MatchChallengeController {

    private final MatchChallengeDao matchChallengeDao;

    public MatchChallengeController(MatchChallengeDao matchChallengeDao) {
        this.matchChallengeDao = matchChallengeDao;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MatchChallenge createChallenge(@RequestBody MatchChallenge challenge) {
        return matchChallengeDao.createChallenge(
                challenge.getChallengerTeamId(),
                challenge.getChallengedTeamId(),
                challenge.getLocationName(),
                challenge.getLocationAddress(),
                challenge.getMatchTime()
        );
    }

    @GetMapping("/received/{teamId}")
    public List<MatchChallenge> getChallengesReceived(@PathVariable int teamId) {
        return matchChallengeDao.getChallengesReceivedByTeam(teamId);
    }

    @GetMapping("/sent/{teamId}")
    public List<MatchChallenge> getChallengesSent(@PathVariable int teamId) {
        return matchChallengeDao.getChallengesSentByTeam(teamId);
    }

    public static class StatusUpdate {
        private String status;
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }

    @PutMapping("/{challengeId}")
    public String updateStatus(@PathVariable int challengeId, @RequestBody StatusUpdate update) {
        matchChallengeDao.updateChallengeStatus(challengeId, update.getStatus().toUpperCase());
        return "Challenge " + challengeId + " updated to " + update.getStatus().toUpperCase();
    }

    @PutMapping("/{challengeId}/hide-sent")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void hideSent(@PathVariable int challengeId) {
        matchChallengeDao.hideSent(challengeId);
    }

    @PutMapping("/{challengeId}/hide-received")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void hideReceived(@PathVariable int challengeId) {
        matchChallengeDao.hideReceived(challengeId);
    }

    @GetMapping("/accepted")
    public List<MatchChallenge> getAllAcceptedChallenges() {
        return matchChallengeDao.getAllAcceptedChallenges();
    }
}
