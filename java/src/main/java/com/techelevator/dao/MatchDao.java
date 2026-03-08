package com.techelevator.dao;

import com.techelevator.model.Match;
import java.util.List;

public interface MatchDao {
    Match getMatchById(int matchId);

    Match createMatch(Match match, int id);

    List<Match> getMatches();

    Match updateMatch(int matchId, Match match);


    int deleteMatchById(int matchId);
}


