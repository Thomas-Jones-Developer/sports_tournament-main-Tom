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
  const [challenged, setChallenged] = useState(false);
  const [matchTime, setMatchTime] = useState("");

  // Park dropdown state
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [parks, setParks] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedPark, setSelectedPark] = useState(null);

  // Modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [selectedTransferUser, setSelectedTransferUser] = useState("");

  useEffect(() => {
    Promise.all([
      TeamService.getTeamById(id),
      axios.get(`/team/${id}/members`),
      axios.get("/parks/states")
    ])
      .then(([teamRes, membersRes, statesRes]) => {
        const teamData = teamRes.data;
        setTeam(teamData);
        setMembers(membersRes.data || []);
        setStates(statesRes.data || []);

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

  const handleStateChange = (e) => {
    const state = e.target.value;
    setSelectedState(state);
    setSelectedCity("");
    setSelectedPark(null);
    setParks([]);
    axios.get(`/parks/cities?state=${state}`)
      .then(res => setCities(res.data || []));
  };

  const handleCityChange = (e) => {
    const city = e.target.value;
    setSelectedCity(city);
    setSelectedPark(null);
    axios.get(`/parks?city=${city}&state=${selectedState}`)
      .then(res => setParks(res.data || []));
  };

  const handleParkChange = (e) => {
    const park = parks.find(p => String(p.parkId) === e.target.value);
    setSelectedPark(park || null);
  };

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

  const handleChallenge = () => {
    if (!selectedPark || !matchTime) {
      alert("Please select a park and match time.");
      return;
    }
    const formattedTime = matchTime.length === 16 ? matchTime + ":00" : matchTime;
    axios.post(`/challenges`, {
      challengerTeamId: currentUser.teamId,
      challengedTeamId: parseInt(id),
      locationName: selectedPark.parkName,
      locationAddress: `${selectedPark.address}, ${selectedPark.city}, ${selectedPark.state}`,
      matchTime: formattedTime,
    })
      .then(() => {
        setChallenged(true);
        setShowChallengeModal(false);
      })
      .catch((err) => {
        console.error("Failed to send challenge:", err);
        alert("Failed to send challenge.");
      });
  };

  const isCaptain = currentUser && team && currentUser.id === team.userId;
  const isMember = currentUser && members.some(m => m.id === currentUser.id);
  const isExternalCaptain = currentUser && !isCaptain && !isMember && currentUser.teamId;

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
              <button className={styles.cancelBtn} onClick={() => setShowDeleteModal(false)}>Cancel</button>
              <button className={styles.confirmDeleteBtn} onClick={handleDelete}>Yes, Delete Team</button>
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
              <button className={styles.cancelBtn} onClick={() => setShowTransferModal(false)}>Cancel</button>
              <button className={styles.confirmTransferBtn} onClick={handleTransfer} disabled={!selectedTransferUser}>
                Yes, Transfer Ownership
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Challenge Modal */}
      {showChallengeModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2 className={styles.modalTitle}>⚔️ Issue a Challenge</h2>
            <p className={styles.modalText}>
              You are about to challenge <strong>{team.teamName}</strong> to a match. Fill in the details below.
            </p>
            <div className={styles.challengePreview}>
              <div className={styles.challengeTeam}>Your Team</div>
              <div className={styles.challengeVs}>VS</div>
              <div className={styles.challengeTeam}>{team.teamName}</div>
            </div>
            <div className={styles.challengeFields}>
              <div className={styles.challengeField}>
                <label className={styles.challengeFieldLabel}>State</label>
                <select className={styles.challengeFieldInput} value={selectedState} onChange={handleStateChange}>
                  <option value="" disabled>Select state...</option>
                  {states.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className={styles.challengeField}>
                <label className={styles.challengeFieldLabel}>City</label>
                <select className={styles.challengeFieldInput} value={selectedCity} onChange={handleCityChange} disabled={!selectedState}>
                  <option value="" disabled>Select city...</option>
                  {cities.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className={styles.challengeField}>
                <label className={styles.challengeFieldLabel}>Park</label>
                <select className={styles.challengeFieldInput} value={selectedPark?.parkId || ""} onChange={handleParkChange} disabled={!selectedCity}>
                  <option value="" disabled>Select park...</option>
                  {parks.map(p => <option key={p.parkId} value={p.parkId}>{p.parkName}</option>)}
                </select>
              </div>
              {selectedPark && (
                <div className={styles.challengeField}>
                  <label className={styles.challengeFieldLabel}>Address</label>
                  <div className={styles.addressPreview}>
                    📍 {selectedPark.parkName} — {selectedPark.address}, {selectedPark.city}, {selectedPark.state}
                  </div>
                </div>
              )}
              <div className={styles.challengeField}>
                <label className={styles.challengeFieldLabel}>Match Date & Time</label>
                <input
                  className={styles.challengeFieldInput}
                  type="datetime-local"
                  value={matchTime}
                  onChange={(e) => setMatchTime(e.target.value)}
                />
              </div>
            </div>
            <div className={styles.modalActions}>
              <button className={styles.cancelBtn} onClick={() => setShowChallengeModal(false)}>Cancel</button>
              <button
                className={styles.confirmChallengeBtn}
                onClick={handleChallenge}
                disabled={!selectedPark || !matchTime}
              >
                ⚔️ This looks good, send it!
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
            {isCaptain && <div className={styles.captainHeroBadge}>You are Captain</div>}
            {isMember && !isCaptain && <div className={styles.memberHeroBadge}>✓ Team Member</div>}
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
              {isCaptain ? "Manage Team" : "Actions"}
            </h2>
            {isCaptain ? (
              <div className={styles.captainActions}>
                <p className={styles.actionDesc}>As captain you can transfer ownership or delete this team.</p>
                <button className={styles.transferBtn} onClick={() => setShowTransferModal(true)} disabled={members.length === 0}>
                  Transfer Ownership
                </button>
                <button className={styles.deleteBtn} onClick={() => setShowDeleteModal(true)}>
                  Delete Team
                </button>
              </div>
            ) : (
              <div className={styles.captainActions}>
                <p className={styles.actionDesc}>
                  {team.acceptingMembers
                    ? `${team.teamName} is actively looking for new players.`
                    : `${team.teamName} is not currently accepting new members.`}
                </p>
                {!currentUser ? (
                  <p className={styles.actionDesc}>Log in to interact with this team.</p>
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
                {isExternalCaptain && (
                  <>
                    <hr style={{ margin: "16px 0", border: "none", borderTop: "1px solid #f0f0ec" }} />
                    <p className={styles.actionDesc}>Think your team can take them on?</p>
                    <button
                      className={challenged ? styles.challengedBtn : styles.challengeBtn}
                      onClick={() => setShowChallengeModal(true)}
                      disabled={challenged}
                    >
                      {challenged ? "Challenge Sent" : "⚔️ Challenge Team"}
                    </button>
                  </>
                )}
              </div>
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
                  <td><span className={styles.captainBadge}>Captain</span></td>
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