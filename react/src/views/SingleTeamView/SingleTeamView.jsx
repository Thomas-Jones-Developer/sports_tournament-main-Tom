import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import TeamService from "../../services/TeamService";
import UserImage from "../../assets/UserImage.png";
import styles from "./SingleTeamView.module.css";
import UsersService from "../../services/UsersService";

export default function SingleTeamView() {
  const { id } = useParams();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requested, setRequested] = useState(false);

useEffect(() => {
  TeamService.getTeamById(id)
    .then((res) => {
      const teamData = res.data;
      setTeam(teamData);

      // Fetch the captain's username using the userId
      if (teamData.userId) {
        UsersService.getUserById(teamData.userId)
          .then((userRes) => {
            setTeam((prev) => ({ ...prev, ownerUsername: userRes.data.username }));
          })
          .catch((err) => console.error("Failed to load captain:", err));
      }
    })
    .catch((error) => console.error("Failed to load team:", error))
    .finally(() => setLoading(false));
}, [id]);

  const handleRequestClick = () => setRequested(true);

  if (loading) return <div className={styles.loading}>Loading team info...</div>;
  if (!team) return <div className={styles.loading}>Team not found.</div>;

  return (
    <div className={styles.page}>

      {/* Hero */}
      <div className={styles.hero}>
        <div className={styles.heroInner}>
          <img src={UserImage} alt="Team" className={styles.avatar} />
          <div className={styles.heroText}>
            <div className={styles.heroPill}>Team Profile</div>
            <h1 className={styles.heroName}>{team.teamName}</h1>
            <p className={styles.heroSport}>{team.sportName || "Sport TBD"}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className={styles.content}>

        {/* Stat cards */}
        <div className={styles.statsRow}>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Sport</span>
            <span className={styles.statValue}>{team.sportName || "N/A"}</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Open Positions</span>
            <span className={`${styles.statValue} ${team.acceptingMembers ? styles.available : styles.unavailable}`}>
              {team.acceptingMembers ? "Available" : "Closed"}
            </span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Members</span>
            <span className={styles.statValue}>{team.numberOfMembers ?? "—"}</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Team Captain</span>
            <span className={styles.statValue}>{team.ownerUsername || team.userId || "—"}</span>
          </div>
        </div>

        {/* Info + Action */}
        <div className={styles.infoSection}>
          <div className={styles.infoCard}>
            <h2 className={styles.infoTitle}>Team Details</h2>
            <div className={styles.infoGrid}>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Team Name</span>
                <span className={styles.infoValue}>{team.teamName || "—"}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Sport</span>
                <span className={styles.infoValue}>{team.sportName || "—"}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Captain</span>
                <span className={styles.infoValue}>{team.ownerUsername || team.userId || "—"}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Roster Size</span>
                <span className={styles.infoValue}>{team.numberOfMembers ?? "—"}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Recruiting</span>
                <span className={styles.infoValue}>{team.acceptingMembers ? "Yes" : "No"}</span>
              </div>
            </div>
          </div>

          <div className={styles.actionCard}>
            <h2 className={styles.infoTitle}>Join This Team</h2>
            <p className={styles.actionDesc}>
              {team.acceptingMembers
                ? `${team.teamName} is actively looking for new players. Send a request to join.`
                : `${team.teamName} is not currently accepting new members.`}
            </p>
            <button
              className={requested ? styles.requestedBtn : styles.requestBtn}
              onClick={handleRequestClick}
              disabled={!team.acceptingMembers && !requested}
            >
              {requested ? "✓ Request Sent" : "Request to Join"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
