import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styles from "./BracketsView.module.css";
import TournamentService from "../../services/TournamentService";
import teamsBackground from '../../assets/soccer/SoccerPics/pexels-edgar-wetsing-tankou-322731922-13920037.jpg';


export default function BracketsView() {
  const { id } = useParams();
  const [tournament, setTournament] = useState(null);
  const [teams, setTeams] = useState([]);

  // Round states
  const [round1Left, setRound1Left] = useState(["", "", "", ""]);
  const [round1Right, setRound1Right] = useState(["", "", "", ""]);
  const [round2Left, setRound2Left] = useState(["", ""]);
  const [round2Right, setRound2Right] = useState(["", ""]);
  const [finals, setFinals] = useState(["", ""]);
  const [champion, setChampion] = useState("");

  useEffect(() => {
    axios.get("http://localhost:9000/team")
      .then(res => setTeams(res.data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (!id) return;
    axios.get(`http://localhost:9000/tournament/${id}`)
      .then(res => setTournament(res.data))
      .catch(err => console.error(err));
  }, [id]);

  const handleChange = (setter, index, value, round) => {
    if (round.includes(value)) return; // prevent duplicates in same round
    const copy = [...round];
    copy[index] = value;
    setter(copy);
  };

  const getTeamName = (teamId) => {
    const team = teams.find(t => t.teamId === teamId);
    return team ? team.teamName : "";
  };

  const getMatchOptions = (teamIds) => {
    return teamIds
      .filter(Boolean)
      .map(id => teams.find(t => String(t.teamId) === String(id)))
      .filter(Boolean);
  };

  // Converts the CSV in tournament.tournamentState back into your round arrays
function hydrateFromState(csv) {
  if (!csv) return null;
  const parts = csv.split(",");
  // expected layout: 4 + 4 + 2 + 2 + 2 + 1 = 15
  if (parts.length < 15) return null;

  // keep values as strings so they drop straight into <select value="">
  const v = (x) => (x && x !== "X" ? String(x) : "");

  let i = 0;
  const r1L = [v(parts[i++]), v(parts[i++]), v(parts[i++]), v(parts[i++])];
  const r1R = [v(parts[i++]), v(parts[i++]), v(parts[i++]), v(parts[i++])];
  const r2L = [v(parts[i++]), v(parts[i++])];
  const r2R = [v(parts[i++]), v(parts[i++])];
  const fnl = [v(parts[i++]), v(parts[i++])];
  const champ = v(parts[i++]);

  return { r1L, r1R, r2L, r2R, fnl, champ };
}


useEffect(() => {
  if (!tournament?.tournamentState) return;
  const parsed = hydrateFromState(tournament.tournamentState);
  if (!parsed) return;

  setRound1Left(parsed.r1L);
  setRound1Right(parsed.r1R);
  setRound2Left(parsed.r2L);
  setRound2Right(parsed.r2R);
  setFinals(parsed.fnl);
  setChampion(parsed.champ);
}, [tournament]);




  const buildTournamentStateString = () => {
    const state = [
      ...round1Left,
      ...round1Right,
      ...round2Left,
      ...round2Right,
      ...finals,
      champion
    ];

    // Replace any empty strings with "X"
    return state.map(id => (id ? id : "X")).join(",");
  };


  const handleSaveStandings = () => {
    if (!tournament) return;
  
    const updatedTournament = {
      ...tournament,
      tournamentState: buildTournamentStateString()
    };

    console.log(updatedTournament);

    TournamentService.updateTournamentState({status : updatedTournament.tournamentState}, id).then(

      (response) => {
        if(response.status === 200) {
          alert('Tournament Updated');
        }
      }
    )
  }


  return (
    
    
    <div className={styles.pageContainer}>
      {/* Remove the JSON debug */}
      {/* {JSON.stringify(tournament)} */}

      <div
        className={styles.mainCon}
        style={{ backgroundImage: `url(${teamsBackground})` }}
      >
  
      <header className={styles.header}>
        <div>
          <h1 className={styles.heading}>
            {tournament ? tournament.name : "Loading tournament..."}
          </h1>
          {tournament && (
            <p className={styles.meta}>
              {tournament.season} • {tournament.location} • {tournament.startDate} – {tournament.endDate}
            </p>
          )}
        </div>
  
        <div className={styles.toolbar}>
          <button className={styles.primaryBtn} onClick={handleSaveStandings}>
            Save Tournament Standings
          </button>
        </div>
      </header>
  
      <main className={styles.bracket}>
        {/* First Round Left */}
        <div className={`${styles.col} ${styles.firstRoundLeft}`}>
          <div className={styles.roundTitle}>Round 1 — Left</div>
          {round1Left.map((teamId, i) => (
            <div key={i} className={styles.selectGroup}>
              <label className={styles.label}>Match {i + 1}</label>
              <select
                className={styles.select}
                value={teamId}
                onChange={e => handleChange(setRound1Left, i, e.target.value, round1Left)}
              >
                <option value="">-- Select Team --</option>
                {teams
                  .filter(t => !round1Left.includes(t.teamId) || t.teamId === teamId)
                  .map(t => (
                    <option key={t.teamId} value={t.teamId}>{t.teamName}</option>
                  ))}
              </select>
            </div>
          ))}
        </div>
  
        {/* Second Round Left */}
        <div className={`${styles.col} ${styles.secondRoundLeft}`}>
          <div className={styles.roundTitle}>Semifinals — Left</div>
          {round2Left.map((teamId, i) => {
            const matchTeams = getMatchOptions([round1Left[i * 2], round1Left[i * 2 + 1]]);
            return (
              <div key={i} className={styles.selectGroup}>
                <label className={styles.label}>Winner of L{i * 2 + 1} vs L{i * 2 + 2}</label>
                <select
                  className={styles.select}
                  value={teamId}
                  onChange={e => setRound2Left(prev => {
                    const copy = [...prev]; copy[i] = e.target.value; return copy;
                  })}
                >
                  <option value="">-- Select Winner --</option>
                  {matchTeams.map(t => (
                    <option key={t.teamId} value={t.teamId}>{t.teamName}</option>
                  ))}
                </select>
              </div>
            );
          })}
        </div>
  
        {/* Finals */}
        <div className={`${styles.col} ${styles.finals}`}>
          <div className={styles.roundTitle}>Final</div>
          {finals.map((teamId, i) => {
            const matchTeams = getMatchOptions([round2Left[i], round2Right[i]]);
            return (
              <div key={i} className={styles.selectGroup}>
                <label className={styles.label}>Finalist</label>
                <select
                  className={styles.select}
                  value={teamId}
                  onChange={e => setFinals(prev => {
                    const copy = [...prev]; copy[i] = e.target.value; return copy;
                  })}
                >
                  <option value="">-- Select Finalist --</option>
                  {matchTeams.map(t => (
                    <option key={t.teamId} value={t.teamId}>{t.teamName}</option>
                  ))}
                </select>
              </div>
            );
          })}
  
          <div className={styles.selectGroup}>
            <label className={styles.label}>Champion</label>
            <select
              className={styles.select}
              value={champion}
              onChange={e => setChampion(e.target.value)}
            >
              <option value="">-- Select Champion --</option>
              {getMatchOptions(finals).map(t => (
                <option key={t.teamId} value={t.teamId}>{t.teamName}</option>
              ))}
            </select>
          </div>
        </div>
  
        {/* Second Round Right */}
        <div className={`${styles.col} ${styles.secondRoundRight}`}>
          <div className={styles.roundTitle}>Semifinals — Right</div>
          {round2Right.map((teamId, i) => {
            const matchTeams = getMatchOptions([round1Right[i * 2], round1Right[i * 2 + 1]]);
            return (
              <div key={i} className={styles.selectGroup}>
                <label className={styles.label}>Winner of R{i * 2 + 1} vs R{i * 2 + 2}</label>
                <select
                  className={styles.select}
                  value={teamId}
                  onChange={e => setRound2Right(prev => {
                    const copy = [...prev]; copy[i] = e.target.value; return copy;
                  })}
                >
                  <option value="">-- Select Winner --</option>
                  {matchTeams.map(t => (
                    <option key={t.teamId} value={t.teamId}>{t.teamName}</option>
                  ))}
                </select>
              </div>
            );
          })}
        </div>
  
        {/* First Round Right */}
        <div className={`${styles.col} ${styles.firstRoundRight}`}>
          <div className={styles.roundTitle}>Round 1 — Right</div>
          {round1Right.map((teamId, i) => (
            <div key={i} className={styles.selectGroup}>
              <label className={styles.label}>Match {i + 1}</label>
              <select
                className={styles.select}
                value={teamId}
                onChange={e => handleChange(setRound1Right, i, e.target.value, round1Right)}
              >
                <option value="">-- Select Team --</option>
                {teams
                  .filter(t => !round1Right.includes(t.teamId) || t.teamId === teamId)
                  .map(t => (
                    <option key={t.teamId} value={t.teamId}>{t.teamName}</option>
                  ))}
              </select>
            </div>
          ))}
        </div>
        
      </main>
      </div>
    </div>
  );
}
  

//   return (
//     <div className={styles.pageContainer}>

//       {JSON.stringify(tournament)}

//       <h1 className={styles.heading}>
//         {tournament ? tournament.name : "Loading tournament..."}
//       </h1>

//       <div className={styles.bracket}>

//         {/* First Round Left */}
//         <div className={styles.firstRoundLeft}>
//           Round 1 LEFT
//           {round1Left.map((teamId, i) => (
//             <select
//               key={i}
//               className={styles.select}
//               value={teamId}
//               onChange={e => handleChange(setRound1Left, i, e.target.value, round1Left)}
//             >
//               <option value="">-- Select Team --</option>
//               {teams.filter(t => !round1Left.includes(t.teamId) || t.teamId === teamId)
//                 .map(t => (
//                   <option key={t.teamId} value={t.teamId}>{t.teamName}</option>
//                 ))}
//             </select>
//           ))}
//         </div>

//         {/* First Round Right */}
//         <div className={styles.firstRoundRight}>
//           Round 1 RIGHT

//           {round1Right.map((teamId, i) => (
//             <select
//               key={i}
//               className={styles.select}
//               value={teamId}
//               onChange={e => handleChange(setRound1Right, i, e.target.value, round1Right)}
//             >
//               <option value="">-- Select Team --</option>
//               {teams.filter(t => !round1Right.includes(t.teamId) || t.teamId === teamId)
//                 .map(t => (
//                   <option key={t.teamId} value={t.teamId}>{t.teamName}</option>
//                 ))}
//             </select>
//           ))}
//         </div>

//         {/* Second Round Left */}
//         <div className={styles.secondRoundLeft}>
//           Round 2 LEFT

//           {round2Left.map((teamId, i) => {
//             const matchTeams = getMatchOptions([round1Left[i * 2], round1Left[i * 2 + 1]]);
//             return (
//               <select
//                 key={i}
//                 className={styles.select}
//                 value={teamId}
//                 onChange={e => setRound2Left(prev => {
//                   const copy = [...prev]; copy[i] = e.target.value; return copy;
//                 })}
//               >
//                 <option value="">-- Select Winner --</option>
//                 {matchTeams.map(t => (
//                   <option key={t.teamId} value={t.teamId}>{t.teamName}</option>
//                 ))}
//               </select>
//             );
//           })}
//         </div>

//         {/* Second Round Right */}
//         <div className={styles.secondRoundRight}>
//           Round 2 LEFT

//           {round2Right.map((teamId, i) => {
//             const matchTeams = getMatchOptions([round1Right[i * 2], round1Right[i * 2 + 1]]);
//             return (
//               <select
//                 key={i}
//                 className={styles.select}
//                 value={teamId}
//                 onChange={e => setRound2Right(prev => {
//                   const copy = [...prev]; copy[i] = e.target.value; return copy;
//                 })}
//               >
//                 <option value="">-- Select Winner --</option>
//                 {matchTeams.map(t => (
//                   <option key={t.teamId} value={t.teamId}>{t.teamName}</option>
//                 ))}
//               </select>
//             );
//           })}
//         </div>

//         {/* Finals */}
//         <div className={styles.finals}>
//           {finals.map((teamId, i) => {
//             const matchTeams = getMatchOptions([round2Left[i], round2Right[i]]);
//             return (
//               <select
//                 key={i}
//                 className={styles.select}
//                 value={teamId}
//                 onChange={e => setFinals(prev => {
//                   const copy = [...prev]; copy[i] = e.target.value; return copy;
//                 })}
//               >
//                 <option value="">-- Select Finalist --</option>
//                 {matchTeams.map(t => (
//                   <option key={t.teamId} value={t.teamId}>{t.teamName}</option>
//                 ))}
//               </select>
//             );
//           })}
//         </div>

//         {/* Champion */}
//         <div className={styles.winner}>
//           <select
//             className={styles.select}
//             value={champion}
//             onChange={e => setChampion(e.target.value)}
//           >
//             <option value="">-- Select Champion --</option>
//             {getMatchOptions(finals).map(t => (
//               <option key={t.teamId} value={t.teamId}>{t.teamName}</option>
//             ))}
//           </select>
//         </div>

//         <button onClick={handleSaveStandings}>
//           Save Tournament Standings
//         </button>

//       </div>
//     </div>
//   );
// }