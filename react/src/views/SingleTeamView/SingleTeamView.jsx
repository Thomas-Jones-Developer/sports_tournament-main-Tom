import { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // <-- get the teamId from URL
import styles from "../TomsGlobal/TomsGlobal.module.css";
import TeamService from "../../services/TeamService";

export default function SingleTeamView() {
  const { id } = useParams(); // <-- get the teamId from URL
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requested, setRequested] = useState(false); // Track request state

  useEffect(() => {
    if (!id) return;

    // Fetch single team by ID from the backend
    TeamService.getTeams() // Ideally use getTeamById(id)
      .then((response) => {
        const teamData = response.data.find((t) => t.teamId.toString() === id.toString());
        setTeam(teamData || null);
      })
      .catch((err) => {
        console.error("Error fetching team data:", err);
        setTeam(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  // Toggle request state
  const handleRequestClick = () => {
    setRequested(prev => !prev);
  };

  if (loading) return <div className={styles.pageContainer}>Loading team info...</div>;
  if (!team) return <div className={styles.pageContainer}>Team not found.</div>;

  return (
    <div className={styles.pageContainer}>
      <div className={styles.mainContent}>
        <div className={styles.formContainer}>
          <h1 className={styles.title}>{team.teamName}</h1>

          <div className={styles.pageContainerv2}>
            <div className={styles.pageContent1}>
              <div className={styles.columns}>
                <img
                  src={team.imageUrl || "src/assets/UserImage.png"}
                  alt="Team Image"
                  className={styles.profileImage}
                />
                <h2 className={styles.profileRow}>{team.teamName}</h2>
              </div>
            </div>

            <div className={styles.pageContent2}>
              <div className={styles.columns}>
                <div className={styles.leftColumn}>
                  <h2 className={styles.profileRow}>Sport</h2>
                  <h2 className={styles.profileRow}>Open Positions</h2>
                  <h2 className={styles.profileRow}>Team Captain</h2>
                </div>

                <div className={styles.rightColumn}>
                  <h2 className={styles.profileRow}>{team.sportName || "Unknown"}</h2>
                  <h2 className={styles.profileRow}>{team.openPositions || "Not Available"}</h2>
                  <h2 className={styles.profileRow}>{team.captain || "TBD"}</h2>
                </div>
              </div>
            </div>

            {/* Request Button Section */}
            <div className={styles.pageContent3}>
              <div className={styles.columns}>
                <button
                  className={requested ? styles.requestedBtn : styles.profileRow2}
                  onClick={handleRequestClick}
                >
                  {requested ? "Request Sent" : "Request to Join Team"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}