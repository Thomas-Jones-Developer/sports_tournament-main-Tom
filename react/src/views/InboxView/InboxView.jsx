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
      console.log("user.teamId:", user.teamId);
      console.log("user.id:", user.id);

      try {
        // Fetch teams and users first for enrichment
        const teamsRes = await axios.get("/team");
        const teamsData = teamsRes.data || [];
        const teamMap = {};
        teamsData.forEach((t) => { teamMap[t.teamId] = t.teamName; });
        

        const usersRes = await axios.get("/users");
        const userMap = {};
        (usersRes.data || []).forEach((u) => { userMap[u.id] = u; });

        // Sent: join requests this user made (player requesting a team)
        const sentRes = await axios.get(`/teams/user/${user.id}/join-requests`);
        console.log("Sent data:", sentRes.data);
        const enrichedSent = (sentRes.data || []).map((r) => ({
          ...r,
          teamName: teamMap[r.teamId] || `Team ${r.teamId}`,
          toName: teamMap[r.teamId] || `Team ${r.teamId}`,
        }));

        // If owner, also fetch invites their team sent to players
        let allSent = enrichedSent;
        if (user.teamId) {
          const invitesSentRes = await axios.get(`/teams/${user.teamId}/sent-invites`);
          const enrichedInvitesSent = (invitesSentRes.data || []).map((r) => ({
            ...r,
            teamName: teamMap[r.teamId] || `Team ${r.teamId}`,
            toName: userMap[r.userId]
              ? `${userMap[r.userId].firstName} ${userMap[r.userId].lastName}`
              : `User ${r.userId}`,
          }));
          allSent = [...enrichedSent, ...enrichedInvitesSent];
        }
        setSent(allSent);

        // Received: two cases
        if (user.teamId) {
          // Owner — show join requests sent to their team
          const receivedRes = await axios.get(`/teams/${user.teamId}/join-requests`);
          const enrichedReceived = (receivedRes.data || []).map((r) => ({
            ...r,
            fromName: userMap[r.userId]
              ? `${userMap[r.userId].firstName} ${userMap[r.userId].lastName}`
              : `User ${r.userId}`,
            fromInitial: userMap[r.userId]?.firstName?.charAt(0) || "?",
            teamName: teamMap[r.teamId] || `Team ${r.teamId}`,
          }));
          setReceived(enrichedReceived);
        } else {
          // Player — show invites sent to them by team owners
          const invitesRes = await axios.get(`/teams/invites/user/${user.id}`);
          const enrichedInvites = (invitesRes.data || []).map((r) => ({
            ...r,
            fromName: teamMap[r.teamId] || `Team ${r.teamId}`,
            fromInitial: (teamMap[r.teamId] || "T").charAt(0),
            teamName: teamMap[r.teamId] || `Team ${r.teamId}`,
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

const handleAccept = (requestId) => {
  axios.put(`/teams/join-request/${requestId}`, { status: "ACCEPTED" })
    .then(() => {
      setReceived(prev => prev.map(m =>
        m.requestId === requestId ? { ...m, status: "ACCEPTED" } : m
      ));
      refreshUser(user); // refresh so teamId updates in nav
    })
    .catch((err) => console.error("Failed to accept:", err));
};

  const handleDeny = (requestId) => {
    axios.put(`/teams/join-request/${requestId}`, { status: "DENIED" })
      .then(() => {
        setReceived(prev => prev.map(m =>
          m.requestId === requestId ? { ...m, status: "DENIED" } : m
        ));
      })
      .catch((err) => console.error("Failed to deny:", err));
  };

  const handleDeleteReceived = (requestId) => {
    setReceived(prev => prev.filter(m => m.requestId !== requestId));
  };

  const handleDeleteSent = (requestId) => {
    setSent(prev => prev.filter(m => m.requestId !== requestId));
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
                <div key={msg.requestId} className={`${styles.messageCard} ${styles[msg.status?.toLowerCase()]}`}>
                  <div className={styles.messageLeft}>
                    <div className={styles.messageAvatar}>{msg.fromInitial}</div>
                    <div className={styles.messageBody}>
                      <div className={styles.messageFrom}>{msg.fromName}</div>
                      <div className={styles.messageTeam}>Re: {msg.teamName}</div>
                      <div className={styles.messageText}>
                        {user.teamId ? "Wants to join your team" : "You've been invited to join this team"}
                      </div>
                      <div className={styles.messageDate}>{new Date(msg.requestDate).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className={styles.messageActions}>
                    {msg.status === "PENDING" ? (
                      <>
                        <button className={styles.acceptBtn} onClick={() => handleAccept(msg.requestId)}>Accept</button>
                        <button className={styles.denyBtn} onClick={() => handleDeny(msg.requestId)}>Deny</button>
                      </>
                    ) : (
                      <span className={`${styles.statusPill} ${styles[msg.status?.toLowerCase()]}`}>
                        {msg.status.charAt(0) + msg.status.slice(1).toLowerCase()}
                      </span>
                    )}
                    <button className={styles.deleteBtn} onClick={() => handleDeleteReceived(msg.requestId)}>Delete</button>
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
                <div key={msg.requestId} className={`${styles.messageCard} ${styles[msg.status?.toLowerCase()]}`}>
                  <div className={styles.messageLeft}>
                    <div className={styles.messageAvatar}>→</div>
                    <div className={styles.messageBody}>
                      <div className={styles.messageFrom}>To: {msg.teamName}</div>
                      <div className={styles.messageFrom}>
                        {msg.type === "INVITE" ? `To: ${msg.toName}` : `To: ${msg.teamName}`}
                      </div>
                      <div className={styles.messageDate}>Sent: {new Date(msg.requestDate).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className={styles.messageActions}>
                    <span className={`${styles.statusPill} ${styles[msg.status?.toLowerCase()]}`}>
                      {msg.status.charAt(0) + msg.status.slice(1).toLowerCase()}
                    </span>
                    <button className={styles.deleteBtn} onClick={() => handleDeleteSent(msg.requestId)}>Delete</button>
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