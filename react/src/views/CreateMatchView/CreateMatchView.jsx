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
    const [matchTime, setMatchTime] = useState("");
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [parks, setParks] = useState([]);
    const [selectedState, setSelectedState] = useState("");
    const [selectedCity, setSelectedCity] = useState("");
    const [selectedPark, setSelectedPark] = useState(null);

    useEffect(() => {
        if (!user) return;
        Promise.all([
            axios.get("/team"),
            axios.get(`/team/owned/${user.id}`),
            axios.get("/parks/states")
        ])
            .then(([allRes, ownedRes, statesRes]) => {
                setAllTeams(allRes.data || []);
                const owned = ownedRes.data || [];
                setOwnedTeams(owned);
                if (owned.length > 0) setChallengerTeamId(String(owned[0].teamId));
                setStates(statesRes.data || []);
            })
            .catch((err) => console.error("Failed to load teams:", err))
            .finally(() => setLoading(false));
    }, [user]);

    const availableOpponents = allTeams.filter(
        (t) => String(t.teamId) !== String(challengerTeamId)
    );

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

    const handleChallenge = () => {
        if (!challengerTeamId || !challengedTeamId) {
            alert("Please select both teams.");
            return;
        }
        if (!selectedPark || !matchTime) {
            alert("Please select a park and match time.");
            return;
        }
        const formattedTime = matchTime.length === 16 ? matchTime + ":00" : matchTime;
        axios.post("/challenges", {
            challengerTeamId: parseInt(challengerTeamId),
            challengedTeamId: parseInt(challengedTeamId),
            locationName: selectedPark.parkName,
            locationAddress: `${selectedPark.address}, ${selectedPark.city}, ${selectedPark.state}`,
            matchTime: formattedTime,
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
                            <button className={styles.primaryBtn} onClick={() => {
                                setSent(false);
                                setChallengedTeamId("");
                                setSelectedState("");
                                setSelectedCity("");
                                setSelectedPark(null);
                                setMatchTime("");
                            }}>
                                Send Another Challenge
                            </button>
                            <button className={styles.secondaryBtn} onClick={() => navigate("/Inbox")}>
                                Go to Inbox
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className={styles.matchCard}>

                        {/* Team selection */}
                        <div className={styles.matchSetup}>
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

                            <div className={styles.vsBlock}>
                                <div className={styles.vsText}>VS</div>
                            </div>

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

                        {/* Match details */}
                        <div className={styles.locationSection}>
                            <h3 className={styles.locationTitle}>Match Details</h3>
                            <div className={styles.locationGrid}>
                                <div className={styles.locationField}>
                                    <label className={styles.fieldLabel}>State</label>
                                    <select
                                        className={styles.fieldInput}
                                        value={selectedState}
                                        onChange={handleStateChange}
                                    >
                                        <option value="" disabled>Select state...</option>
                                        {states.map(s => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className={styles.locationField}>
                                    <label className={styles.fieldLabel}>City</label>
                                    <select
                                        className={styles.fieldInput}
                                        value={selectedCity}
                                        onChange={handleCityChange}
                                        disabled={!selectedState}
                                    >
                                        <option value="" disabled>Select city...</option>
                                        {cities.map(c => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className={styles.locationField}>
                                    <label className={styles.fieldLabel}>Park</label>
                                    <select
                                        className={styles.fieldInput}
                                        value={selectedPark?.parkId || ""}
                                        onChange={handleParkChange}
                                        disabled={!selectedCity}
                                    >
                                        <option value="" disabled>Select park...</option>
                                        {parks.map(p => (
                                            <option key={p.parkId} value={p.parkId}>{p.parkName}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className={styles.locationField}>
                                    <label className={styles.fieldLabel}>Match Date & Time</label>
                                    <input
                                        className={styles.fieldInput}
                                        type="datetime-local"
                                        value={matchTime}
                                        onChange={(e) => setMatchTime(e.target.value)}
                                        required
                                    />
                                </div>
                                {selectedPark && (
                                    <div className={styles.locationField} style={{ gridColumn: "1 / -1" }}>
                                        <label className={styles.fieldLabel}>Address</label>
                                        <div className={styles.addressPreview}>
                                            📍 {selectedPark.parkName} — {selectedPark.address}, {selectedPark.city}, {selectedPark.state}
                                        </div>
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
                                disabled={!challengerTeamId || !challengedTeamId || !selectedPark || !matchTime}
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