import { useState, useEffect } from "react";
import styles from "./InboxView.module.css";

const TABS = ["Received", "Sent"];

// Placeholder data - replace with real API calls
const MOCK_RECEIVED = [
  { id: 1, from: "Alex Johnson", team: "XRavens", message: "We'd love to have you on our team!", date: "2026-03-10", status: "pending" },
  { id: 2, from: "Maria Chen", team: "Thunder FC", message: "Are you interested in joining our soccer team?", date: "2026-03-08", status: "pending" },
  { id: 3, from: "James Park", team: "Chess Kings", message: "Looking for a strong player for our chess team.", date: "2026-03-05", status: "accepted" },
];

const MOCK_SENT = [
  { id: 1, to: "XRavens", message: "Request to join your team.", dateSent: "2026-03-09", dateReceived: "2026-03-09", status: "pending" },
  { id: 2, to: "Spike Squad", message: "Request to join your volleyball team.", dateSent: "2026-03-07", dateReceived: "2026-03-07", status: "denied" },
];

export default function InboxView() {
  const [activeTab, setActiveTab] = useState("Received");
  const [received, setReceived] = useState(MOCK_RECEIVED);
  const [sent, setSent] = useState(MOCK_SENT);

  const handleAccept = (id) => {
    setReceived(prev => prev.map(m => m.id === id ? { ...m, status: "accepted" } : m));
  };

  const handleDeny = (id) => {
    setReceived(prev => prev.map(m => m.id === id ? { ...m, status: "denied" } : m));
  };

  const handleDeleteReceived = (id) => {
  setReceived(prev => prev.filter(m => m.id !== id));
};

const handleDeleteSent = (id) => {
  setSent(prev => prev.filter(m => m.id !== id));
};

  const unreadCount = received.filter(m => m.status === "pending").length;

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
              <div className={styles.empty}>No messages received yet.</div>
            ) : (
              received.map(msg => (
                <div key={msg.id} className={`${styles.messageCard} ${styles[msg.status]}`}>
                  <div className={styles.messageLeft}>
                    <div className={styles.messageAvatar}>
                      {msg.from.charAt(0)}
                    </div>
                    <div className={styles.messageBody}>
                      <div className={styles.messageFrom}>{msg.from}</div>
                      <div className={styles.messageTeam}>Re: {msg.team}</div>
                      <div className={styles.messageText}>{msg.message}</div>
                      <div className={styles.messageDate}>{msg.date}</div>
                    </div>
                  </div>
                  <div className={styles.messageActions}>
  {msg.status === "pending" ? (
    <>
      <button className={styles.acceptBtn} onClick={() => handleAccept(msg.id)}>Accept</button>
      <button className={styles.denyBtn} onClick={() => handleDeny(msg.id)}>Deny</button>
    </>
  ) : (
    <span className={`${styles.statusPill} ${styles[msg.status]}`}>
      {msg.status.charAt(0).toUpperCase() + msg.status.slice(1)}
    </span>
  )}
  <button className={styles.deleteBtn} onClick={() => handleDeleteReceived(msg.id)}>Delete</button>
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
              <div className={styles.empty}>No messages sent yet.</div>
            ) : (
              sent.map(msg => (
                <div key={msg.id} className={`${styles.messageCard} ${styles[msg.status]}`}>
                  <div className={styles.messageLeft}>
                    <div className={styles.messageAvatar}>→</div>
                    <div className={styles.messageBody}>
                      <div className={styles.messageFrom}>To: {msg.to}</div>
                      <div className={styles.messageText}>{msg.message}</div>
                      <div className={styles.messageDate}>Sent: {msg.dateSent} · Received: {msg.dateReceived}</div>
                    </div>
                  </div>
                  <div className={styles.messageActions}>
  <span className={`${styles.statusPill} ${styles[msg.status]}`}>
    {msg.status.charAt(0).toUpperCase() + msg.status.slice(1)}
  </span>
  <button className={styles.deleteBtn} onClick={() => handleDeleteSent(msg.id)}>Delete</button>
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
