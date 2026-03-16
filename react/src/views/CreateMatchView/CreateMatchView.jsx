import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import axios from "axios";
import styles from "./CreateMatchView.module.css";

export default function SetUpMatchView() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [allTeams, setAllTeams] = useState([]);
  const [ownedTeams, setOwnedTeams] = useState([]);
  const [challengerTeamId, setChallengerTeamId] = useState("");
  const [challengedTeamId, setChallengedTeamId] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      axios.get("/team"),
      axios.get(`/team/owned/${user.id}`)
    ])
      .then(([allRes, ownedRes]) => {
        setAllTeams(allRes.data || []);
        const owned = ownedRes.data || [];
        setOwnedTeams(owned);
        if (owned.length > 0) setChallengerTeamId(String(owned[0].teamId));
      })
      .catch((err) => console.error("Failed to load teams:", err))
      .finally(() => setLoading(false));
  }, [user]);

  const availableOpponents = allTeams.filter(
    (t) => String(t.teamId) !== String(challengerTeamId)
  );

  const handleChallenge = () => {
    if (!challengerTeamId || !challengedTeamId) {
      alert("Please select both teams.");
      return;
    }
    axios.post("/challenges", {
      challengerTeamId: parseInt(challengerTeamId),
      challengedTeamId: parseInt(challengedTeamId),
    })
      .then(() => setSent(true))
      .catch((err) => {
        console.error("Failed to send challenge:", err);
        alert("Failed to send challenge.");
      });
  };

  if (!user) return <div className={styles.empty}>Please log in to set up a match.</div>;
  if (loading) return <div className={styles.empty}>Loading...</div>;

  const challengerTeam = allTeams.find(t => String(t.teamId) === String(challengerTeamId));
  const challengedTeam = allTeams.find(t => String(t.teamId) === String(challengedTeamId));

  return (
    <div className={styles.page}>

      <div className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroText}>
            <div className={styles.heroPill}>Matches</div>
            <h1 className={styles.heroName}>Set Up a Match</h1>
            <p className={styles.heroSub}>Challenge another team to a match</p>
          </div>
        </div>
      </div>

      <div className={styles.content}>
        {sent ? (
          <div className={styles.successCard}>
            <div className={styles.successIcon}>⚔️</div>
            <h2 className={styles.successTitle}>Challenge Sent!</h2>
            <p className={styles.successText}>
              Your challenge has been sent to <strong>{challengedTeam?.teamName}</strong>. They will receive it in their inbox and can accept or deny it.
            </p>
            <div className={styles.successActions}>
              <button className={styles.primaryBtn} onClick={() => { setSent(false); setChallengedTeamId(""); }}>
                Send Another Challenge
              </button>
              <button className={styles.secondaryBtn} onClick={() => navigate("/Inbox")}>
                Go to Inbox
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.matchCard}>
            <div className={styles.matchSetup}>

              {/* Challenger */}
              <div className={styles.teamSelector}>
                <div className={styles.selectorLabel}>Your Team</div>
                <select
                  className={styles.teamSelect}
                  value={challengerTeamId}
                  onChange={(e) => {
                    setChallengerTeamId(e.target.value);
                    setChallengedTeamId("");
                  }}
                >
                  <option value="" disabled>Select your team</option>
                  {ownedTeams.map((t) => (
                    <option key={t.teamId} value={t.teamId}>{t.teamName}</option>
                  ))}
                </select>
                {challengerTeam && (
                  <div className={styles.teamPreview}>
                    <div className={styles.teamPreviewName}>{challengerTeam.teamName}</div>
                    <div className={styles.teamPreviewMeta}>{challengerTeam.sportName}</div>
                  </div>
                )}
              </div>

              {/* VS */}
              <div className={styles.vsBlock}>
                <div className={styles.vsText}>VS</div>
              </div>

              {/* Challenged */}
              <div className={styles.teamSelector}>
                <div className={styles.selectorLabel}>Opponent</div>
                <select
                  className={styles.teamSelect}
                  value={challengedTeamId}
                  onChange={(e) => setChallengedTeamId(e.target.value)}
                  disabled={!challengerTeamId}
                >
                  <option value="" disabled>Select opponent</option>
                  {availableOpponents.map((t) => (
                    <option key={t.teamId} value={t.teamId}>{t.teamName}</option>
                  ))}
                </select>
                {challengedTeam && (
                  <div className={styles.teamPreview}>
                    <div className={styles.teamPreviewName}>{challengedTeam.teamName}</div>
                    <div className={styles.teamPreviewMeta}>{challengedTeam.sportName}</div>
                  </div>
                )}
              </div>

            </div>

            <div className={styles.challengeFooter}>
              <p className={styles.challengeNote}>
                The opposing team will receive this challenge in their inbox and must accept before the match is confirmed.
              </p>
              <button
                className={styles.challengeBtn}
                onClick={handleChallenge}
                disabled={!challengerTeamId || !challengedTeamId}
              >
                ⚔️ Send Challenge
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}