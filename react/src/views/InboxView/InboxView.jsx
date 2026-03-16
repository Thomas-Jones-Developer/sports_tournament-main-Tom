import { useState, useEffect, useContext } from "react";
import styles from "./InboxView.module.css";
import { UserContext } from "../../context/UserContext";
import axios from "axios";

const TABS = ["Received", "Sent"];

export default function InboxView() {
  const { user, refreshUser } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState("Received");
  const [received, setReceived] = useState([]);
  const [sent, setSent] = useState([]);
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const teamsRes = await axios.get("/team");
        const teamsData = teamsRes.data || [];
        const teamMap = {};
        teamsData.forEach((t) => { teamMap[t.teamId] = t.teamName; });

        const usersRes = await axios.get("/users");
        const userMap = {};
        (usersRes.data || []).forEach((u) => { userMap[u.id] = u; });

        // Sent: join requests this user made
        const sentRes = await axios.get(`/teams/user/${user.id}/join-requests`);
        const enrichedSent = (sentRes.data || []).map((r) => ({
          ...r,
          teamName: teamMap[r.teamId] || `Team ${r.teamId}`,
          toName: teamMap[r.teamId] || `Team ${r.teamId}`,
          messageType: "JOIN_REQUEST",
        }));

        // If owner, also fetch invites their team sent
        let allSent = enrichedSent;
        if (user.teamId) {
          const invitesSentRes = await axios.get(`/teams/${user.teamId}/sent-invites`);
          const enrichedInvitesSent = (invitesSentRes.data || []).map((r) => ({
            ...r,
            teamName: teamMap[r.teamId] || `Team ${r.teamId}`,
            toName: userMap[r.userId]
              ? `${userMap[r.userId].firstName} ${userMap[r.userId].lastName}`
              : `User ${r.userId}`,
            messageType: "INVITE",
          }));
          allSent = [...enrichedSent, ...enrichedInvitesSent];

          // Also fetch challenges sent by this user's team
          const challengesSentRes = await axios.get(`/challenges/sent/${user.teamId}`);
          const enrichedChallengesSent = (challengesSentRes.data || []).map((c) => ({
            ...c,
            requestId: c.challengeId,
            teamName: teamMap[c.challengedTeamId] || `Team ${c.challengedTeamId}`,
            toName: teamMap[c.challengedTeamId] || `Team ${c.challengedTeamId}`,
            requestDate: c.challengeDate,
            messageType: "CHALLENGE",
          }));
          allSent = [...allSent, ...enrichedChallengesSent];
        }
        setSent(allSent);

        // Received
        if (user.teamId) {
          // Owner — show join requests and challenges received
          const receivedRes = await axios.get(`/teams/${user.teamId}/join-requests`);
          const enrichedReceived = (receivedRes.data || []).map((r) => ({
            ...r,
            fromName: userMap[r.userId]
              ? `${userMap[r.userId].firstName} ${userMap[r.userId].lastName}`
              : `User ${r.userId}`,
            fromInitial: userMap[r.userId]?.firstName?.charAt(0) || "?",
            teamName: teamMap[r.teamId] || `Team ${r.teamId}`,
            messageType: "JOIN_REQUEST",
          }));

          // Also fetch challenges received by this team
          const challengesReceivedRes = await axios.get(`/challenges/received/${user.teamId}`);
          const enrichedChallengesReceived = (challengesReceivedRes.data || []).map((c) => ({
            ...c,
            requestId: c.challengeId,
            fromName: teamMap[c.challengerTeamId] || `Team ${c.challengerTeamId}`,
            fromInitial: (teamMap[c.challengerTeamId] || "T").charAt(0),
            teamName: teamMap[c.challengedTeamId] || `Team ${c.challengedTeamId}`,
            requestDate: c.challengeDate,
            messageType: "CHALLENGE",
          }));

          setReceived([...enrichedReceived, ...enrichedChallengesReceived]);
        } else {
          // Player — show invites
          const invitesRes = await axios.get(`/teams/invites/user/${user.id}`);
          const enrichedInvites = (invitesRes.data || []).map((r) => ({
            ...r,
            fromName: teamMap[r.teamId] || `Team ${r.teamId}`,
            fromInitial: (teamMap[r.teamId] || "T").charAt(0),
            teamName: teamMap[r.teamId] || `Team ${r.teamId}`,
            messageType: "INVITE",
          }));
          setReceived(enrichedInvites);
        }
      } catch (err) {
        console.error("Failed to load inbox:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleAccept = (requestId, messageType) => {
    const url = messageType === "CHALLENGE"
      ? `/challenges/${requestId}`
      : `/teams/join-request/${requestId}`;
    axios.put(url, { status: "ACCEPTED" })
      .then(() => {
        setReceived(prev => prev.map(m =>
          m.requestId === requestId ? { ...m, status: "ACCEPTED" } : m
        ));
        if (messageType !== "CHALLENGE") refreshUser(user);
      })
      .catch((err) => console.error("Failed to accept:", err));
  };

  const handleDeny = (requestId, messageType) => {
    const url = messageType === "CHALLENGE"
      ? `/challenges/${requestId}`
      : `/teams/join-request/${requestId}`;
    axios.put(url, { status: "DENIED" })
      .then(() => {
        setReceived(prev => prev.map(m =>
          m.requestId === requestId ? { ...m, status: "DENIED" } : m
        ));
      })
      .catch((err) => console.error("Failed to deny:", err));
  };

  const handleDeleteReceived = (requestId, messageType) => {
    const url = messageType === "CHALLENGE"
      ? `/challenges/${requestId}/hide-received`
      : `/teams/join-request/${requestId}/hide-received`;
    axios.put(url)
      .then(() => {
        setReceived(prev => prev.filter(m => m.requestId !== requestId));
      })
      .catch((err) => console.error("Failed to hide message:", err));
  };

  const handleDeleteSent = (requestId, messageType) => {
    const url = messageType === "CHALLENGE"
      ? `/challenges/${requestId}/hide-sent`
      : `/teams/join-request/${requestId}/hide-sent`;
    axios.put(url)
      .then(() => {
        setSent(prev => prev.filter(m => m.requestId !== requestId));
      })
      .catch((err) => console.error("Failed to hide message:", err));
  };

  const unreadCount = received.filter(m => m.status === "PENDING").length;

  if (!user) return <div className={styles.empty}>Please log in to view your inbox.</div>;
  if (loading) return <div className={styles.empty}>Loading...</div>;

  return (
    <div className={styles.page}>

      {/* Hero */}
      <div className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroText}>
            <div className={styles.heroPill}>Messages</div>
            <h1 className={styles.heroName}>Inbox</h1>
            <p className={styles.heroSub}>Manage your team requests and messages</p>
          </div>
          {unreadCount > 0 && (
            <div className={styles.unreadBadge}>
              <span className={styles.unreadNum}>{unreadCount}</span>
              <span className={styles.unreadLabel}>Pending</span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className={styles.content}>

        {/* Tabs */}
        <div className={styles.tabs}>
          {TABS.map(tab => (
            <button
              key={tab}
              className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
              {tab === "Received" && unreadCount > 0 && (
                <span className={styles.tabBadge}>{unreadCount}</span>
              )}
            </button>
          ))}
        </div>

       {/* Received Messages */}
{activeTab === "Received" && (
  <div className={styles.messageList}>
    {received.length === 0 ? (
      <div className={styles.empty}>
        {user.teamId ? "No pending requests for your team." : "No invites received yet."}
      </div>
    ) : (
      received.map(msg => (
        <div
          key={msg.requestId}
          className={`${styles.messageCard} ${msg.messageType === "CHALLENGE"
              ? styles.challengeCard
              : styles[msg.status?.toLowerCase()]
            }`}
        >
          <div className={styles.messageLeft}>
            <div className={`${styles.messageAvatar} ${msg.messageType === "CHALLENGE" ? styles.challengeAvatar : ""}`}>
              {msg.messageType === "CHALLENGE" ? "⚔️" : msg.fromInitial}
            </div>
            <div className={styles.messageBody}>
              {msg.messageType === "CHALLENGE" && (
                <div className={styles.challengeLabel}>⚔️ CHALLENGE ISSUED</div>
              )}
              <div className={styles.messageFrom}>{msg.fromName}</div>
              <div className={styles.messageTeam}>
                {msg.messageType === "CHALLENGE"
                  ? `${msg.fromName} wants to face your team in a match`
                  : `Re: ${msg.teamName}`}
              </div>
              {msg.messageType === "CHALLENGE" ? (
                <>
                  {msg.matchTime && (
                    <div className={styles.messageText}>📅 {new Date(msg.matchTime).toLocaleString()}</div>
                  )}
                  {msg.locationName && (
                    <div className={styles.messageText}>
                      📍 {msg.locationName}{msg.locationAddress ? ` — ${msg.locationAddress}` : ""}
                    </div>
                  )}
                </>
              ) : (
                <div className={styles.messageText}>
                  {user.teamId ? "Wants to join your team" : "You've been invited to join this team"}
                </div>
              )}
              <div className={styles.messageDate}>{new Date(msg.requestDate).toLocaleString()}</div>
            </div>
          </div>
          <div className={styles.messageActions}>
            {msg.status === "PENDING" ? (
              <>
                <button className={styles.acceptBtn} onClick={() => handleAccept(msg.requestId, msg.messageType)}>Accept</button>
                <button className={styles.denyBtn} onClick={() => handleDeny(msg.requestId, msg.messageType)}>Deny</button>
              </>
            ) : (
              <span className={`${styles.statusPill} ${styles[msg.status?.toLowerCase()]}`}>
                {msg.status.charAt(0) + msg.status.slice(1).toLowerCase()}
              </span>
            )}
            <button className={styles.deleteBtn} onClick={() => handleDeleteReceived(msg.requestId, msg.messageType)}>Delete</button>
          </div>
        </div>
      ))
    )}
  </div>
)}

{/* Sent Messages */}
{activeTab === "Sent" && (
  <div className={styles.messageList}>
    {sent.length === 0 ? (
      <div className={styles.empty}>No requests sent yet.</div>
    ) : (
      sent.map(msg => (
        <div
          key={msg.requestId}
          className={`${styles.messageCard} ${msg.messageType === "CHALLENGE"
              ? styles.challengeCard
              : styles[msg.status?.toLowerCase()]
            }`}
        >
          <div className={styles.messageLeft}>
            <div className={`${styles.messageAvatar} ${msg.messageType === "CHALLENGE" ? styles.challengeAvatar : ""}`}>
              {msg.messageType === "CHALLENGE" ? "⚔️" : "→"}
            </div>
            <div className={styles.messageBody}>
              {msg.messageType === "CHALLENGE" && (
                <div className={styles.challengeLabel}>⚔️ CHALLENGE ISSUED</div>
              )}
              <div className={styles.messageFrom}>
                {msg.messageType === "INVITE" ? `To: ${msg.toName}` : `To: ${msg.teamName}`}
              </div>
              {msg.messageType === "CHALLENGE" ? (
                <>
                  {msg.matchTime && (
                    <div className={styles.messageText}>📅 {new Date(msg.matchTime).toLocaleString()}</div>
                  )}
                  {msg.locationName && (
                    <div className={styles.messageText}>
                      📍 {msg.locationName}{msg.locationAddress ? ` — ${msg.locationAddress}` : ""}
                    </div>
                  )}
                </>
              ) : (
                <div className={styles.messageText}>
                  {msg.messageType === "INVITE" ? "Invited player to join team" : "Request to join team"}
                </div>
              )}
              <div className={styles.messageDate}>Sent: {new Date(msg.requestDate).toLocaleString()}</div>
            </div>
          </div>
          <div className={styles.messageActions}>
            <span className={`${styles.statusPill} ${styles[msg.status?.toLowerCase()]}`}>
              {msg.status.charAt(0) + msg.status.slice(1).toLowerCase()}
            </span>
            <button className={styles.deleteBtn} onClick={() => handleDeleteSent(msg.requestId, msg.messageType)}>Delete</button>
          </div>
        </div>
      ))
    )}
  </div>
)}

      </div>
    </div>
  );
}