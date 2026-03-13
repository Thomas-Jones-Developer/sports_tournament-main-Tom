import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import UsersService from "../../services/UsersService";
import UserImage from "../../assets/UserImage.png";
import styles from "./UserPublicProfileView.module.css";

export default function UserPublicProfileView() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requested, setRequested] = useState(false);

  useEffect(() => {
    if (!id) return;
    UsersService.getUserById(id)
      .then((response) => setUser(response.data))
      .catch((err) => { console.error("Error fetching user data:", err); setUser(null); })
      .finally(() => setLoading(false));
  }, [id]);

  const handleClick = () => setRequested(prev => !prev);

  if (loading) return <div className={styles.loading}>Loading profile...</div>;
  if (!user) return <div className={styles.loading}>User not found.</div>;

  return (
    <div className={styles.page}>

      {/* Hero banner */}
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

      {/* Content */}
      <div className={styles.content}>

        {/* Stats cards */}
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

        {/* Info section */}
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

          {/* Action card */}
          <div className={styles.actionCard}>
            <h2 className={styles.infoTitle}>Recruit This Player</h2>
            <p className={styles.actionDesc}>
              Interested in having {user.firstName} join your team? Send them a request.
            </p>
            <button
              className={requested ? styles.requestedBtn : styles.requestBtn}
              onClick={handleClick}
            >
              {requested ? "✓ Request Sent" : "Request Player"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
