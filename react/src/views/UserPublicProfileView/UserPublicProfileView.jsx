import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import UsersService from "../../services/UsersService";
import UserImage from "../../assets/UserImage.png";
import styles from "./UserPublicProfileView.module.css";
import { UserContext } from "../../context/UserContext";
import axios from "axios";

export default function UserPublicProfileView() {
  const { id } = useParams();
  const { user: currentUser } = useContext(UserContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requested, setRequested] = useState(false);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      UsersService.getUserById(id),
      UsersService.getTeams()
    ])
      .then(([userRes, teamsRes]) => {
        const userData = userRes.data;
        const teamsData = teamsRes.data || [];
        const userTeam = teamsData.find((t) => t.userId === userData.id);
        setUser({
          ...userData,
          teamName: userTeam?.teamName || "No Team",
          sportName: userTeam?.sportName || "N/A",
        });
      })
      .catch((err) => {
        console.error("Error fetching user data:", err);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleInvite = () => {
    if (!currentUser?.teamId) {
      alert("You need to own a team to invite players.");
      return;
    }
    axios.post(`/teams/${currentUser.teamId}/invite/${id}`)
      .then(() => setRequested(true))
      .catch((err) => {
        console.error("Failed to send invite:", err);
        alert("Failed to send invite. You may have already invited this player.");
      });
  };

  if (loading) return <div className={styles.loading}>Loading profile...</div>;
  if (!user) return <div className={styles.loading}>User not found.</div>;

  return (
    <div className={styles.page}>

      <div className={styles.hero}>
        <div className={styles.heroInner}>
          <img src={UserImage} alt="Player" className={styles.avatar} />
          <div className={styles.heroText}>
            <div className={styles.heroPill}>Player Profile</div>
            <h1 className={styles.heroName}>{user.firstName} {user.lastName}</h1>
            <p className={styles.heroUsername}>@{user.username}</p>
          </div>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.statsRow}>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Team</span>
            <span className={styles.statValue}>{user.teamName || "No Team"}</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Sport</span>
            <span className={styles.statValue}>{user.sportName || "N/A"}</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Availability</span>
            <span className={`${styles.statValue} ${user.acceptingMembers ? styles.available : styles.unavailable}`}>
              {user.acceptingMembers ? "Available" : "Not Available"}
            </span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Role</span>
            <span className={styles.statValue}>{user.role?.replace("ROLE_", "") || "Player"}</span>
          </div>
        </div>

        <div className={styles.infoSection}>
          <div className={styles.infoCard}>
            <h2 className={styles.infoTitle}>Player Info</h2>
            <div className={styles.infoGrid}>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>First Name</span>
                <span className={styles.infoValue}>{user.firstName || "—"}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Last Name</span>
                <span className={styles.infoValue}>{user.lastName || "—"}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Username</span>
                <span className={styles.infoValue}>@{user.username || "—"}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Email</span>
                <span className={styles.infoValue}>{user.email || "—"}</span>
              </div>
            </div>
          </div>

          <div className={styles.actionCard}>
            <h2 className={styles.infoTitle}>Recruit This Player</h2>
            <p className={styles.actionDesc}>
              Interested in having {user.firstName} join your team? Send them a request.
            </p>
            {!currentUser ? (
              <p className={styles.actionDesc}>Log in to recruit players.</p>
            ) : !currentUser.teamId ? (
              <p className={styles.actionDesc}>You need to own a team to invite players.</p>
            ) : (
              <button
                className={requested ? styles.requestedBtn : styles.requestBtn}
                onClick={handleInvite}
                disabled={requested}
              >
                {requested ? "✓ Invite Sent" : "Request Player"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}