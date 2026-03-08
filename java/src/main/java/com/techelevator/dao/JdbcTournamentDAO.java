package com.techelevator.dao;

import com.techelevator.exception.DaoException;
import com.techelevator.model.Tournament;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.jdbc.CannotGetJdbcConnectionException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Component
public class JdbcTournamentDAO implements TournamentDao {

    private JdbcTemplate template;

    private JdbcTemplate jdbcTemplate;

    @Autowired
    public JdbcTournamentDAO(DataSource dataSource) {
        this.jdbcTemplate = new JdbcTemplate(dataSource);
    }

    @Override
    public List<Tournament> getTournaments() {
        List<Tournament> tournaments = new ArrayList<>();

        String sql = "SELECT t.tournament_id, t.name, t.season, t.start_date, t.end_date, " +
                "t.number_of_rounds, t.entry_fee, t.prize_description, t.location, " +
                "t.sport_id, sp.sport_name, t.organizer_id, t.tournament_state " +
                "FROM tournament t " +
                "JOIN sport sp ON t.sport_id = sp.sport_id";

        SqlRowSet results = jdbcTemplate.queryForRowSet(sql);
        while (results.next()) {
            tournaments.add(mapRowToTournament(results));
        }

        return tournaments;
    }


    @Override
    public Tournament createTournament(Tournament tournament, int organizerId) {
        String sql = """
                    INSERT INTO tournament (sport_id, name, season, start_date, end_date,
                    number_of_rounds, organizer_id, entry_fee, prize_description, location, tournament_state)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    RETURNING tournament_id
                """;

        tournament.setTournamentState("X,X,X,X,X,X,X,X,X,X,X,X,X,X,X");

        Integer tournamentId = jdbcTemplate.queryForObject(
                sql,
                Integer.class,
                tournament.getSportId(),
                tournament.getName(),
                tournament.getSeason(),
                tournament.getStartDate(),
                tournament.getEndDate(),
                tournament.getNumberOfRounds(),
                organizerId,
                tournament.getEntryFee(),
                tournament.getPrizeDescription(),
                tournament.getLocation(),
                tournament.getTournamentState()
        );

        tournament.setTournamentId(tournamentId);
        tournament.setOrganizerId(organizerId);

        // Now fetch the sportName by sportId and set it on tournament
        String sportNameSql = "SELECT sport_name FROM sport WHERE sport_id = ?";
        String sportName = jdbcTemplate.queryForObject(sportNameSql, String.class, tournament.getSportId());
        tournament.setSportName(sportName);

        return tournament;
    }

    @Override
    public Tournament updateTournament(int id, Tournament tournament) throws DaoException {
        String sql = "UPDATE tournament " +
                "SET sport_id = ?, " +
                "    name = ?, " +
                "    season = ?, " +
                "    start_date = ?, " +
                "    end_date = ?, " +
                "    number_of_rounds = ?, " +
                "    entry_fee = ?, " +
                "    prize_description = ?, " +
                "    location = ? " +
                "WHERE tournament_id = ?";

        try {
            int rowsAffected = jdbcTemplate.update(sql,
                    tournament.getSportId(),
                    tournament.getName(),
                    tournament.getSeason(),
                    tournament.getStartDate(),
                    tournament.getEndDate(),
                    tournament.getNumberOfRounds(),
                    tournament.getEntryFee(),
                    tournament.getPrizeDescription(),
                    tournament.getLocation(),
                    id
            );

            if (rowsAffected == 0) {
                throw new DaoException("No tournament found with ID: " + id);
            }

            // Fetch the updated row from DB
            return getTournamentById(id);

        } catch (CannotGetJdbcConnectionException e) {
            throw new DaoException("Unable to connect to server or database", e);
        } catch (DataIntegrityViolationException e) {
            throw new DaoException("Data integrity violation", e);
        }
    }


    @Override
    public Tournament getTournamentById(int tournamentId) {
        Tournament tournament = null;

        String sql = "SELECT t.tournament_id, t.name, t.season, t.start_date, t.end_date, " +
                "t.number_of_rounds, t.entry_fee, t.prize_description, t.location, " +
                "t.sport_id, sp.sport_name, t.organizer_id, t.tournament_state " +
                "FROM tournament t " +
                "JOIN sport sp ON t.sport_id = sp.sport_id " +
                "WHERE t.tournament_id = ?";

        try {
            SqlRowSet results = jdbcTemplate.queryForRowSet(sql, tournamentId);
            if (results.next()) {
                tournament = mapRowToTournament(results);
            }
        } catch (CannotGetJdbcConnectionException e) {
            throw new DaoException("Unable to connect to server or database", e);
        }

        return tournament;
    }


    @Override
    public int deleteTournamentById(int tournamentId) {
        int tournament = 0;

        String sql = "DELETE FROM tournament WHERE tournament_id = ?";

        try {
            tournament = jdbcTemplate.update(sql, tournamentId);
        } catch(CannotGetJdbcConnectionException e){
                throw new DaoException("Unable to connect to server or database", e);
            } catch(DataIntegrityViolationException e){
                throw new DaoException("Data integrity violation", e);
            }
            return tournament;
        }

    @Override
    public Tournament updatePairings(String status, int tournamentId) {

        String sql = "UPDATE tournament set tournament_state = ? WHERE tournament_id = ?";

        jdbcTemplate.update(sql, status, tournamentId );

        return getTournamentById(tournamentId);
    }


    private Tournament mapRowToTournament (SqlRowSet rs){
            Tournament tournament = new Tournament();

            tournament.setTournamentId(rs.getInt("tournament_id"));
            tournament.setSportId(rs.getInt("sport_id"));
            tournament.setName(rs.getString("name"));
            tournament.setSeason(rs.getString("season"));
            tournament.setStartDate(LocalDate.parse(rs.getString("start_date")));
            tournament.setEndDate(LocalDate.parse(rs.getString("end_date")));
            tournament.setNumberOfRounds(rs.getInt("number_of_rounds"));
            tournament.setEntryFee(rs.getInt("entry_fee"));
            tournament.setPrizeDescription(rs.getString("prize_description"));
            tournament.setLocation(rs.getString("location"));
            tournament.setOrganizerId(rs.getInt("organizer_id"));  // <-- Add this line
            tournament.setSportName(rs.getString("sport_name")); // new field
            tournament.setTournamentState(rs.getString("tournament_state"));

            return tournament;
        }

    }


