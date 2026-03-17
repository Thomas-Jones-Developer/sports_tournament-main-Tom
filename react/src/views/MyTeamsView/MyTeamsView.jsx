import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import axios from "axios";
import styles from "./MyTeamsView.module.css";

export default function MyTeamsView() {
  const { user, refreshUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [ownedTeams, setOwnedTeams] = useState([]);
  const [memberTeams, setMemberTeams] = useState([]);
  const [loading, setLoading] = useState(true);
 const [showLeaveConfirm, setShowLeaveConfirm] = useState(null);


  useEffect(() => {
    if (!user) return;

    Promise.all([
      axios.get(`/team/owned/${user.id}`),
      axios.get(`/team/member/${user.id}`)
    ])
.then(([ownedRes, memberRes]) => {
  setOwnedTeams(ownedRes.data || []);
  setMemberTeams(memberRes.data || []); // fix this line
})
      .catch((err) => console.error("Failed to load teams:", err))
      .finally(() => setLoading(false));
  }, [user]);

const handleLeaveTeam = async (teamId) => {
  try {
    await axios.delete(`/team/${teamId}/members/${user.id}`);
    setMemberTeams(prev => prev.filter(t => t.teamId !== teamId));
    setShowLeaveConfirm(null);
    refreshUser(user);
  } catch (err) {
    alert(err.response?.data?.message || "Failed to leave team.");
  }
};

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
  {memberTeams.length === 0 ? (
    <div className={styles.empty}>You haven't joined any teams yet.</div>
  ) : (
    <div className={styles.teamGrid}>
      {memberTeams.map((memberTeam) => (
        <div className={styles.teamCard} key={memberTeam.teamId}>
          <div onClick={() => navigate(`/SingleTeam/${memberTeam.teamId}`)} style={{ cursor: "pointer" }}>
            <div className={styles.teamCardHeader}>
              <span className={styles.memberBadge}>✓ Member</span>
            </div>
            <div className={styles.teamName}>{memberTeam.teamName}</div>
            <div className={styles.teamMeta}>{memberTeam.sportName}</div>
            <div className={styles.teamMeta}>
              {memberTeam.numberOfMembers} roster spots · {memberTeam.acceptingMembers ? "Recruiting" : "Closed"}
            </div>
          </div>
          <button
            className={styles.leaveBtn}
            onClick={(e) => { e.stopPropagation(); setShowLeaveConfirm(memberTeam.teamId); }}
          >
            Leave Team
          </button>
          {showLeaveConfirm === memberTeam.teamId && (
            <div className={styles.confirmBox}>
              <p className={styles.confirmText}>Are you sure you want to leave {memberTeam.teamName}?</p>
              <div className={styles.confirmActions}>
                <button className={styles.confirmDanger} onClick={() => handleLeaveTeam(memberTeam.teamId)}>Yes, Leave</button>
                <button className={styles.confirmCancel} onClick={() => setShowLeaveConfirm(null)}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )}
</div>
      </div>
    </div>
  );
}