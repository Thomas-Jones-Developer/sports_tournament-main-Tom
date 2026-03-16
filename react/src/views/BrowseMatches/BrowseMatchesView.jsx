import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import axios from "axios";
import { SPORT_ICONS } from "../../constants/sportsIcons";
import styles from "./BrowseMatchesView.module.css";

export default function BrowseMatchesView() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [allMatches, setAllMatches] = useState([]);
  const [teamMap, setTeamMap] = useState({});
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    Promise.all([
      axios.get("/challenges/accepted"),
      axios.get("/team")
    ])
      .then(([matchesRes, teamsRes]) => {
        const teams = teamsRes.data || [];
        const map = {};
        teams.forEach((t) => { map[t.teamId] = t; });
        setTeamMap(map);
        setAllMatches(matchesRes.data || []);
      })
      .catch((err) => console.error("Failed to load matches:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className={styles.empty}>Loading matches...</div>;

  // Split into my matches and all other matches
  const myTeamIds = user
    ? allMatches
        .filter(m => m.challengerTeamId === user.teamId || m.challengedTeamId === user.teamId)
        .map(m => m.challengeId)
    : [];

  const myMatches = allMatches.filter(m => myTeamIds.includes(m.challengeId));
  const otherMatches = allMatches.filter(m => !myTeamIds.includes(m.challengeId));

const MatchCard = ({ match }) => {
  const challenger = teamMap[match.challengerTeamId];
  const challenged = teamMap[match.challengedTeamId];
  const isMyMatch = myTeamIds.includes(match.challengeId);

return (
    <div className={`${styles.matchCard} ${isMyMatch ? styles.myMatchCard : ""}`}>
      {isMyMatch && <div className={styles.myMatchBadge}>⚔️ Your Match</div>}
      <div className={styles.matchup}>
        <div className={styles.teamBlock} onClick={() => navigate(`/SingleTeam/${match.challengerTeamId}`)}>
          <div className={styles.teamEmoji}>{SPORT_ICONS[challenger?.sportId]}</div>
          <div className={styles.teamName}>{challenger?.teamName || `Team ${match.challengerTeamId}`}</div>
          <div className={styles.teamSport}>{challenger?.sportName || "—"}</div>
        </div>
        <div className={styles.vsBlock}>
          <div className={styles.vsText}>VS</div>
          <div className={styles.matchDate}>
            {match.matchTime
              ? new Date(match.matchTime).toLocaleString()
              : new Date(match.challengeDate).toLocaleDateString()}
          </div>
        </div>
        <div className={styles.teamBlock} onClick={() => navigate(`/SingleTeam/${match.challengedTeamId}`)}>
          <div className={styles.teamEmoji}>{SPORT_ICONS[challenged?.sportId]}</div>
          <div className={styles.teamName}>{challenged?.teamName || `Team ${match.challengedTeamId}`}</div>
          <div className={styles.teamSport}>{challenged?.sportName || "—"}</div>
        </div>
      </div>
      {(match.locationName || match.locationAddress) && (
        <div className={styles.matchLocation}>
          📍 {match.locationName}{match.locationAddress ? ` — ${match.locationAddress}` : ""}
        </div>
      )}
    </div>
  );
};

  return (
    <div className={styles.page}>

      <div className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroText}>
            <div className={styles.heroPill}>Matches</div>
            <h1 className={styles.heroName}>Confirmed Matches</h1>
            <p className={styles.heroSub}>All accepted match challenges across the platform</p>
          </div>
          <div className={styles.heroStat}>
            <span className={styles.heroStatNum}>{allMatches.length}</span>
            <span className={styles.heroStatLabel}>Confirmed Matches</span>
          </div>
        </div>
      </div>

      <div className={styles.content}>

        {/* My Matches */}
        {user && myMatches.length > 0 && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>⚔️ Your Matches</h2>
            <div className={styles.matchList}>
              {myMatches.map(match => (
                <MatchCard key={match.challengeId} match={match} />
              ))}
            </div>
          </div>
        )}

        {/* All Other Matches */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>All Matches</h2>
          {otherMatches.length === 0 && myMatches.length === 0 ? (
            <div className={styles.empty}>No confirmed matches yet.</div>
          ) : otherMatches.length === 0 ? (
            <div className={styles.empty}>No other matches on the platform yet.</div>
          ) : (
            <div className={styles.matchList}>
              {otherMatches.map(match => (
                <MatchCard key={match.challengeId} match={match} />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}