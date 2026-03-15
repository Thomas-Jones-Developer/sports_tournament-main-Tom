import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import axios from "axios";
import styles from "./MyTeamsView.module.css";

export default function MyTeamsView() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [ownedTeams, setOwnedTeams] = useState([]);
  const [memberTeam, setMemberTeam] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    Promise.all([
      axios.get(`/team/owned/${user.id}`),
      axios.get(`/team/member/${user.id}`)
    ])
      .then(([ownedRes, memberRes]) => {
        setOwnedTeams(ownedRes.data || []);
        setMemberTeam(memberRes.data || null);
      })
      .catch((err) => console.error("Failed to load teams:", err))
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) return <div className={styles.empty}>Please log in to view your teams.</div>;
  if (loading) return <div className={styles.empty}>Loading...</div>;

  return (
    <div className={styles.page}>

      <div className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroText}>
            <div className={styles.heroPill}>My Teams</div>
            <h1 className={styles.heroName}>Your Teams</h1>
            <p className={styles.heroSub}>Teams you own and teams you belong to</p>
          </div>
        </div>
      </div>

      <div className={styles.content}>

        {/* Owned Teams */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Teams You Own</h2>
          {ownedTeams.length === 0 ? (
            <div className={styles.empty}>You don't own any teams yet.</div>
          ) : (
            <div className={styles.teamGrid}>
              {ownedTeams.map((team) => (
                <div
                  key={team.teamId}
                  className={styles.teamCard}
                  onClick={() => navigate(`/SingleTeam/${team.teamId}`)}
                >
                  <div className={styles.teamCardHeader}>
                    <span className={styles.captainBadge}>⭐ Captain</span>
                  </div>
                  <div className={styles.teamName}>{team.teamName}</div>
                  <div className={styles.teamMeta}>{team.sportName}</div>
                  <div className={styles.teamMeta}>
                    {team.numberOfMembers} roster spots · {team.acceptingMembers ? "Recruiting" : "Closed"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Member Of */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Teams You've Joined</h2>
          {!memberTeam ? (
            <div className={styles.empty}>You haven't joined any teams yet.</div>
          ) : (
            <div className={styles.teamGrid}>
              <div
                className={styles.teamCard}
                onClick={() => navigate(`/SingleTeam/${memberTeam.teamId}`)}
              >
                <div className={styles.teamCardHeader}>
                  <span className={styles.memberBadge}>✓ Member</span>
                </div>
                <div className={styles.teamName}>{memberTeam.teamName}</div>
                <div className={styles.teamMeta}>{memberTeam.sportName}</div>
                <div className={styles.teamMeta}>
                  {memberTeam.numberOfMembers} roster spots · {memberTeam.acceptingMembers ? "Recruiting" : "Closed"}
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}