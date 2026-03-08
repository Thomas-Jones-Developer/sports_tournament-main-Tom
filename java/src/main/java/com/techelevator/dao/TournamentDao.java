package com.techelevator.dao;

import com.techelevator.exception.DaoException;
import com.techelevator.model.Tournament;
import com.techelevator.model.User;

import java.security.Principal;
import java.util.List;

public interface TournamentDao {
   Tournament getTournamentById(int tournamentId);

    List<Tournament> getTournaments();

    Tournament createTournament(Tournament tournament, int organizerId);

    Tournament updateTournament(int id, Tournament tournament) throws DaoException;

    int deleteTournamentById(int tournamentId);

    Tournament updatePairings(String status, int tournamentId);
}
