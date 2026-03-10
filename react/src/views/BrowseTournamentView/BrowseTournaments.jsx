import React, { useState, useEffect } from "react";
import styles from "./BrowseTournament.module.css";
import TournamentService from "../../services/TournamentService";
import tournamentsBackground from "../../assets/pickelball/venti-views-UfnsQzOGLu8-unsplash.jpg";
import { useNavigate } from "react-router-dom";

const TournamentsView = ({ isAdmin = false }) => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch tournaments and keep winner updated
    TournamentService.getTournament()
      .then((response) => setTournaments(response.data || []))
      .catch(() => setTournaments([]))
      .finally(() => setLoading(false));
  }, []);

  const sortData = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") direction = "desc";
    setSortConfig({ key, direction });

    const sorted = [...tournaments].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setTournaments(sorted);
  };

  const getStatus = (tournament) => {
    const today = new Date();
    const endDate = new Date(tournament.endDate);
    if (tournament.status === "Canceled") return "Canceled";
    return endDate < today ? "Complete" : "Active";
  };

  const handleStatusClick = (tournament, e) => {
    e.stopPropagation();
    const today = new Date();
    const endDate = new Date(tournament.endDate);

    if (!isAdmin || endDate < today) return;

    const newStatus = tournament.status === "Canceled" ? "Active" : "Canceled";

    TournamentService.updateTournamentStatus(tournament.tournamentId, newStatus)
      .then(() => {
        setTournaments((prev) =>
          prev.map((t) =>
            t.tournamentId === tournament.tournamentId
              ? { ...t, status: newStatus }
              : t
          )
        );
      })
      .catch((err) => console.error("Error updating status:", err));
  };

  return (
    <div className={styles.pageContainer}>
      <div
        className={styles.mainContent}
        style={{ backgroundImage: `url(${tournamentsBackground})` }}
      >
        <div className={styles.formContainer}>
          <h1 className={styles.title}>Our Tournaments</h1>
          <div className={styles.tournamentSubtitle}>
            Ready to compete? Find a tournament to join here!
          </div>
          <div className={styles.buttonRow}>
            <button className={styles.roundedBtn} onClick={() => sortData("name")}>
              Sort by Name {sortConfig.key === "name" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
            </button>
            <button className={styles.roundedBtn} onClick={() => sortData("sportName")}>
              Sort by Sport {sortConfig.key === "sportName" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
            </button>
            <button className={styles.roundedBtn} onClick={() => sortData("startDate")}>
              Sort by Start Date {sortConfig.key === "startDate" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
            </button>
          </div>
          <table className={styles.tournamentsTable}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Sport ID</th>
                <th>Sport</th>
                <th>Start</th>
                <th>End</th>
                <th>Status</th>
                <th>Winner</th>
              </tr>
            </thead>
            <tbody>
              {!loading &&
                tournaments.map((tournament) => {
                  const today = new Date();
                  const endDate = new Date(tournament.endDate);

                  const status = tournament.status
                    ? tournament.status
                    : endDate < today
                    ? "Complete"
                    : "Active";

                  return (
                    <tr
                      key={tournament.tournamentId}
                      className={styles.clickableRow}
                      onClick={() => navigate(`/tournament/${tournament.tournamentId}`)}
                    >
                      <td>{tournament.tournamentId}</td>
                      <td>{tournament.name}</td>
                      <td>{tournament.sportId}</td>
                      <td>{tournament.sportName}</td>
                      <td>{tournament.startDate}</td>
                      <td>{tournament.endDate}</td>
                      <td>
                        <span
                          className={
                            status === "Active"
                              ? styles.activeStatus
                              : status === "Canceled"
                              ? styles.canceledStatus
                              : styles.inactiveStatus
                          }
                          style={{ cursor: endDate >= today ? "pointer" : "not-allowed" }}
                          onClick={(e) => handleStatusClick(tournament, e)}
                        >
                          {status}
                        </span>
                      </td>
                      <td>{tournament.winner || "TBD"}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>

        </div>
      </div>
    </div>
  );
};

export default TournamentsView;

