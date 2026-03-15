import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TeamService from "../../services/TeamService";
import UserImage from "../../assets/UserImage.png";
import styles from "./SingleTeamView.module.css";
import UsersService from "../../services/UsersService";
import { UserContext } from "../../context/UserContext";
import axios from "axios";
import { SPORT_ICONS } from '../../constants/sportsIcons';

export default function SingleTeamView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser, refreshUser } = useContext(UserContext);
  const [team, setTeam] = useState(null);
  const [members, setMembers] = useState([]);
  const [captain, setCaptain] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requested, setRequested] = useState(false);

  // Modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [selectedTransferUser, setSelectedTransferUser] = useState("");

  useEffect(() => {
    Promise.all([
      TeamService.getTeamById(id),
      axios.get(`/team/${id}/members`)
    ])
      .then(([teamRes, membersRes]) => {
        const teamData = teamRes.data;
        setTeam(teamData);
        setMembers(membersRes.data || []);

        if (teamData.userId) {
          UsersService.getUserById(teamData.userId)
            .then((userRes) => {
              setCaptain(userRes.data);
              setTeam((prev) => ({ ...prev, ownerUsername: userRes.data.username }));
            })
            .catch((err) => console.error("Failed to load captain:", err));
        }
      })
      .catch((error) => console.error("Failed to load team:", error))
      .finally(() => setLoading(false));
  }, [id]);

  const handleRequestClick = () => {
    if (!currentUser) {
      alert("You need to be logged in to request to join a team.");
      return;
    }
    axios.post(`/teams/${id}/join-request`)
      .then(() => setRequested(true))
      .catch((err) => {
        console.error("Failed to send join request:", err);
        alert("Failed to send request. You may have already requested to join this team.");
      });
  };

  const handleDelete = () => {
    axios.delete(`/team/${id}`)
      .then(() => {
        refreshUser(currentUser);
        navigate("/myTeams");
      })
      .catch((err) => console.error("Failed to delete team:", err));
  };

  const handleTransfer = () => {
    if (!selectedTransferUser) return;
    axios.put(`/team/${id}`, { ...team, userId: parseInt(selectedTransferUser) })
      .then(() => {
        refreshUser(currentUser);
        navigate("/myTeams");
      })
      .catch((err) => console.error("Failed to transfer team:", err));
  };

  const isCaptain = currentUser && team && currentUser.id === team.userId;
  const isMember = currentUser && members.some(m => m.id === currentUser.id);

  if (loading) return <div className={styles.loading}>Loading team info...</div>;
  if (!team) return <div className={styles.loading}>Team not found.</div>;

  const totalSlots = team.numberOfMembers || 0;
  const filledSlots = members.length;
  const emptySlots = Math.max(0, totalSlots - filledSlots);

  return (
    <div className={styles.page}>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2 className={styles.modalTitle}>Delete Team</h2>
            <p className={styles.modalText}>
              Are you sure you want to delete <strong>{team.teamName}</strong>? This action cannot be undone and will remove all members from the team.
            </p>
            <div className={styles.modalActions}>
              <button className={styles.cancelBtn} onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button className={styles.confirmDeleteBtn} onClick={handleDelete}>
                Yes, Delete Team
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transfer Confirmation Modal */}
      {showTransferModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2 className={styles.modalTitle}>Transfer Ownership</h2>
            <p className={styles.modalText}>
              Select a team member to transfer ownership of <strong>{team.teamName}</strong> to. You will lose captain privileges.
            </p>
            <select
              className={styles.modalSelect}
              value={selectedTransferUser}
              onChange={(e) => setSelectedTransferUser(e.target.value)}
            >
              <option value="">-- Select a member --</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.firstName} {m.lastName} (@{m.username})
                </option>
              ))}
            </select>
            <div className={styles.modalActions}>
              <button className={styles.cancelBtn} onClick={() => setShowTransferModal(false)}>
                Cancel
              </button>
              <button
                className={styles.confirmTransferBtn}
                onClick={handleTransfer}
                disabled={!selectedTransferUser}
              >
                Yes, Transfer Ownership
              </button>
            </div>
          </div>
        </div>
      )}

{/* Hero */}
<div className={styles.hero}>
  <div className={styles.heroInner}>
    <div className={styles.heroLeft}>
      <div className={styles.avatarContainer}>
        <img src={UserImage} alt="Team" className={styles.avatar} />
        <div className={styles.sportEmoji}>{SPORT_ICONS[team.sportId]}</div>
      </div>
      <div className={styles.heroText}>
        <h1 className={styles.heroName}>{team.teamName}</h1>
        <p className={styles.heroSport}>{team.sportName || "Sport TBD"}</p>
      </div>
    </div>
    <div className={styles.heroRight}>
      <div className={styles.heroPill}>Team Profile</div>
      {isCaptain && (
        <div className={styles.captainHeroBadge}>⭐ Captain</div>
      )}
      {isMember && !isCaptain && (
        <div className={styles.memberHeroBadge}>✓ Team Member</div>
      )}
    </div>
  </div>
</div>

      {/* Content */}
      <div className={styles.content}>

        {/* Stat cards */}
        <div className={styles.statsRow}>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Sport</span>
            <span className={styles.statValue}>{SPORT_ICONS[team.sportId]} {team.sportName || "N/A"}</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Open Positions</span>
            <span className={`${styles.statValue} ${team.acceptingMembers ? styles.available : styles.unavailable}`}>
              {team.acceptingMembers ? "Available" : "Closed"}
            </span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Members</span>
            <span className={styles.statValue}>{filledSlots} / {totalSlots}</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Team Captain</span>
            <span className={styles.statValue}>{team.ownerUsername || "—"}</span>
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
                <span className={styles.infoValue}>{SPORT_ICONS[team.sportId]} {team.sportName || "—"}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Captain</span>
                <span className={styles.infoValue}>{team.ownerUsername || "—"}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Roster Size</span>
                <span className={styles.infoValue}>{totalSlots}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Recruiting</span>
                <span className={styles.infoValue}>{team.acceptingMembers ? "Yes" : "No"}</span>
              </div>
            </div>
          </div>

          <div className={styles.actionCard}>
            <h2 className={styles.infoTitle}>
              {isCaptain ? "Manage Team" : "Join This Team"}
            </h2>
            {isCaptain ? (
              <div className={styles.captainActions}>
                <p className={styles.actionDesc}>As captain you can transfer ownership or delete this team.</p>
                <button
                  className={styles.transferBtn}
                  onClick={() => setShowTransferModal(true)}
                  disabled={members.length === 0}
                >
                  Transfer Ownership
                </button>
                <button
                  className={styles.deleteBtn}
                  onClick={() => setShowDeleteModal(true)}
                >
                  Delete Team
                </button>
              </div>
            ) : (
              <>
                <p className={styles.actionDesc}>
                  {team.acceptingMembers
                    ? `${team.teamName} is actively looking for new players. Send a request to join.`
                    : `${team.teamName} is not currently accepting new members.`}
                </p>
                {!currentUser ? (
                  <p className={styles.actionDesc}>Log in to request to join a team.</p>
                ) : isMember ? (
                  <p className={styles.actionDesc}>You are already part of this team.</p>
                ) : (
                  <button
                    className={requested ? styles.requestedBtn : styles.requestBtn}
                    onClick={handleRequestClick}
                    disabled={(!team.acceptingMembers && !requested) || requested}
                  >
                    {requested ? "✓ Request Sent" : "Request to Join"}
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Roster */}
        <div className={styles.rosterSection}>
          <h2 className={styles.infoTitle}>Team Roster</h2>
          <table className={styles.rosterTable}>
            <thead>
              <tr className={styles.rosterHeader}>
                <th>Player</th>
                <th>Username</th>
                <th>Role</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {captain && (
                <tr className={styles.captainRow}>
                  <td>{captain.firstName} {captain.lastName}</td>
                  <td>@{captain.username}</td>
                  <td>{captain.role?.replace("ROLE_", "") || "—"}</td>
                  <td><span className={styles.captainBadge}>⭐ Captain</span></td>
                </tr>
              )}
              {members.map((member) => (
                <tr
                  key={member.id}
                  className={styles.memberRow}
                  onClick={() => navigate(`/publicProfile/${member.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <td>{member.firstName} {member.lastName}</td>
                  <td>@{member.username}</td>
                  <td>{member.role?.replace("ROLE_", "") || "—"}</td>
                  <td><span className={styles.activeBadge}>Active</span></td>
                </tr>
              ))}
              {Array.from({ length: emptySlots }).map((_, i) => (
                <tr key={`empty-${i}`} className={styles.emptyRow}>
                  <td colSpan={4} className={styles.emptySlot}>
                    🔍 Open Position — We Are Actively Recruiting
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}