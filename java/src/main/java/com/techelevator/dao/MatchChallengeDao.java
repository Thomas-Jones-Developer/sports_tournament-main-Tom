package com.techelevator.dao;

import com.techelevator.model.MatchChallenge;
import java.time.LocalDateTime;
import java.util.List;

public interface MatchChallengeDao {
    MatchChallenge createChallenge(int challengerTeamId, int challengedTeamId, String locationName, String locationAddress, LocalDateTime matchTime);
    List<MatchChallenge> getChallengesReceivedByTeam(int teamId);
    List<MatchChallenge> getChallengesSentByTeam(int teamId);
    MatchChallenge getChallengeById(int challengeId);
    void updateChallengeStatus(int challengeId, String status);
    void hideSent(int challengeId);
    void hideReceived(int challengeId);
    List<MatchChallenge> getAllAcceptedChallenges();
}