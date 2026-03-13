import { useState } from 'react';
import TournamentService from '../services/TournamentService';
import { useNavigate } from 'react-router-dom';
import styles from './CreateTournament.module.css';

import sportsBackground from '../assets/chess/sports-tools.jpg';

const SPORT_ID_BY_NAME = {
  Soccer: 1,
  VolleyBall: 2,
  Basketball: 3,
  PickleBall: 4,
  Chess: 5,
  MarioKart: 6,
};

export default function CreateTournament() {
  const [tournament, setTournament] = useState({
    sportId: '',
    name: '',
    season: '',
    startDate: '',
    endDate: '',
    numberOfRounds: '',
    entryFee: '',
    prizeDescription: '',
    location: '',
    tournamentState: '',
    sportName: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTournament(prev => {
      const next = { ...prev, [name]: value };
      if (name === 'sportName') next.sportId = SPORT_ID_BY_NAME[value] ?? '';
      return next;
    });
  };

  async function submitForm(e) {
    e.preventDefault();
    const payload = {
      ...tournament,
      sportId: tournament.sportId ? Number(tournament.sportId) : null,
      numberOfRounds: Number(tournament.numberOfRounds),
      entryFee: Number(tournament.entryFee),
    };

    try {
      const res = await TournamentService.createTournament(payload);
      if (res.status === 201) {
        alert('Tournament created successfully');
        navigate('/');
      }
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 403) {
        alert('You must be an admin to create a tournament.');
      } else {
        alert('Failed to create tournament');
      }
    }
  }

  return (
  <div className={styles.pageContainer} style={{ backgroundImage: `url(${sportsBackground})` }}>
    <div className={styles.formContainer}>
      <div className={styles.title}>Create Tournament</div>


          <form onSubmit={submitForm} className={styles.form}>
            <div className={styles.formControl}>
              <label htmlFor="name">Tournament Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={tournament.name}
                className={styles.input}
                required
                onChange={handleChange}
              />
            </div>

            <div className={styles.formControl}>
              <label htmlFor="sportName">Sport:</label>
              <select
                id="sportName"
                name="sportName"
                value={tournament.sportName}
                className={styles.select}
                onChange={handleChange}
                required
              >
                <option value="" disabled>Select your sport…</option>
                {Object.keys(SPORT_ID_BY_NAME).map(sport => (
                  <option key={sport} value={sport}>{sport}</option>
                ))}
              </select>
            </div>

            <div className={styles.formControl}>
              <label htmlFor="season">Season:</label>
              <select
                id="season"
                name="season"
                value={tournament.season}
                className={styles.select}
                onChange={handleChange}
                required
              >
                <option value="" disabled>Select season…</option>
                <option value="Fall">Fall</option>
                <option value="Winter">Winter</option>
                <option value="Spring">Spring</option>
                <option value="Summer">Summer</option>
              </select>
            </div>

            <div className={styles.formControl}>
              <label htmlFor="startDate">Start Date:</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={tournament.startDate}
                className={styles.input}
                required
                onChange={handleChange}
              />
            </div>

            <div className={styles.formControl}>
              <label htmlFor="endDate">End Date:</label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={tournament.endDate}
                className={styles.input}
                required
                onChange={handleChange}
              />
            </div>

            <div className={styles.formControl}>
              <label htmlFor="numberOfRounds">Number of Rounds:</label>
              <select
                id="numberOfRounds"
                name="numberOfRounds"
                value={tournament.numberOfRounds}
                className={styles.select}
                onChange={handleChange}
                required
              >
                <option value="" disabled>Select number of rounds…</option>
                {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>

            <div className={styles.formControl}>
              <label htmlFor="entryFee">Entry Fee (USD):</label>
              <input
                type="number"
                id="entryFee"
                name="entryFee"
                min="0"
                step="1"
                placeholder="e.g., 100"
                value={tournament.entryFee}
                className={styles.input}
                required
                onChange={handleChange}
              />
            </div>

            <div className={styles.formControl}>
              <label htmlFor="prizeDescription">Prize Description:</label>
              <input
                type="text"
                id="prizeDescription"
                name="prizeDescription"
                value={tournament.prizeDescription}
                className={styles.input}
                placeholder="Gold medal, cash prize, trophies…"
                onChange={handleChange}
              />
            </div>

            <div className={styles.formControl}>
              <label htmlFor="location">Location:</label>
              <select
                id="location"
                name="location"
                value={tournament.location}
                className={styles.select}
                onChange={handleChange}
              >
                <option value="" disabled>Select location…</option>
                <option value="Columbus">Columbus</option>
                <option value="Cincinnati">Cincinnati</option>
                <option value="Cleveland">Cleveland</option>
                <option value="Dayton">Dayton</option>
                <option value="Chicago">Chicago</option>
                <option value="Bellwood">Bellwood</option>
                <option value="Aurora">Aurora</option>
                <option value="Rockford">Rockford</option>
                <option value="New York">New York</option>
              </select>
            </div>

            <div className={styles.formControl}>
              <label htmlFor="tournamentState">Tournament state:</label>
              <input
                type="number"
                id="tournamentState"
                name="tournamentState"
                min="0"
                step="1"
                placeholder="e.g., 100"
                value={tournament.tournamentState}
                className={styles.input}
                required
                onChange={handleChange}
              />
            </div>


            <button type="submit" className={styles.submitButton}>
              Create Tournament
            </button>
          </form>
        </div>
      </div>
  );
}



























// import { useState } from 'react';
// import TournamentService from '../services/TournamentService';
// import { useNavigate } from 'react-router-dom';
// import styles from './CreateTournament.module.css';
// import sportsBackground from '../assets/chess/chess-3791454_1280.jpg';

// // import sportsBackground from '../../assets/chess/sports-tools.jpg';




// const SPORT_ID_BY_NAME = {
//   Soccer: 1,
//   VolleyBall: 2,
//   Basketball: 3,
//   PickleBall: 4,
//   Chess: 5,
//   MarioKart: 6,
// };


// export default function CreateTournament() {
//   const [tournament, setTournament] = useState({
//     sportId: '',
//     name: '',
//     season: '',
//     startDate: '',
//     endDate: '',
//     numberOfRounds: '',
//     entryFee: '',
//     prizeDescription: '',
//     location: '',
//     sportName: '',
//   });
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setTournament(prev => {
//       const next = { ...prev, [name]: value };
//       if (name === 'sportName') next.sportId = SPORT_ID_BY_NAME[value] ?? '';
//       return next;
//     });
//   };

//   async function submitForm(e) {
//     e.preventDefault();
//     const payload = {
//       ...tournament,
//       sportId: tournament.sportId ? Number(tournament.sportId) : null,
//       numberOfRounds: Number(tournament.numberOfRounds),
//       entryFee: Number(tournament.entryFee),
//     };

//     try {
//       const res = await TournamentService.createTournament(payload);
//       if (res.status === 201) {
//         alert('Tournament created successfully');
//         navigate('/');
//       }
//     } catch (err) {
//       console.error(err);
//       if (err.response && err.response.status === 403) {
//         alert('You must be an admin to create a tournament.');
//       } else {
//         alert('Failed to create tournament');
//       }
//     }
//   }

//   return (
//     <>


// <div className={styles.pageContainer}>
//   <div className={styles.mainContent} style={{backgroundImage: `url(${sportsBackground})`}}>
//     <div className={styles.formContainer}>
//       <div className={styles.title}>Create Tournament</div>
//       <form onSubmit={submitForm} className={styles.form}>

//         <div className={styles.formControl}>
//           <label htmlFor="name">Tournament Name:</label>
//           <input className={styles.input} type="text"
//     name="name"
//     value={tournament.name}
//     onChange={handleChange}
//     required
//   />

//           <p className={styles.description}>Save time with our free sports league scheduler</p>
//           </div>
        

//         <div className={styles.formControl}>
//           <label htmlFor="sportName">Sport:</label>
//           <select className={styles.select}>...</select>
//         </div>

   

//         <button type="submit" className={styles.submitButton}>
//           Create Tournament
//         </button>
//       </form>
//     </div>
//   </div>
// </div>
//     </>
//   );
// }


{/* <div className={styles.headerContainer}>
<div className={styles.mainHeading}></div>
</div>

<div className={styles.inputBox}>
<div className={styles.topic1}>
  <h2>Create Tournament</h2>
  <p className={styles.description}>Save time with our free sports league scheduler</p>
</div>

<form onSubmit={submitForm}>
  <p className={styles.scheduler}>Tournament Name</p>
  <input
    className={styles.tournamentInput}
    type="text"
    name="name"
    value={tournament.name}
    onChange={handleChange}
    required
  />

  <p className={styles.scheduler}>Sport</p>
  <select
    className={styles.dropDownScheduler}
    name="sportName"
    value={tournament.sportName}
    onChange={handleChange}
    required
  >
    <option value="" disabled>Select your sport…</option>
    {Object.keys(SPORT_ID_BY_NAME).map(sport => (
      <option key={sport} value={sport}>{sport}</option>
    ))}
  </select>

  <p className={styles.scheduler}>Season</p>
  <select
    className={styles.dropDownScheduler}
    name="season"
    value={tournament.season}
    onChange={handleChange}
    required
  >
    <option value="" disabled>Select season…</option>
    <option value="Fall">Fall</option>
    <option value="Winter">Winter</option>
    <option value="Spring">Spring</option>
    <option value="Summer">Summer</option>
  </select>

  <p className={styles.scheduler}>Start date</p>
  <input
    className={styles.dropDownSchedulerDate}
    type="date"
    name="startDate"
    value={tournament.startDate}
    onChange={handleChange}
    required
  />

  <p className={styles.scheduler}>End date</p>
  <input
    className={styles.dropDownSchedulerDate}
    type="date"
    name="endDate"
    value={tournament.endDate}
    onChange={handleChange}
    required
  />

  <p className={styles.scheduler}>Rounds</p>
  <select
    className={styles.dropDownScheduler}
    name="numberOfRounds"
    value={tournament.numberOfRounds}
    onChange={handleChange}
    required
  >
    <option value="" disabled>Select number of rounds…</option>
    {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n}</option>)}
  </select>

  <p className={styles.scheduler}>Entry Fee (USD)</p>
  <input
    className={styles.dropDownSchedulerDate}
    type="number"
    name="entryFee"
    min="0"
    step="1"
    placeholder="e.g., 100"
    value={tournament.entryFee}
    onChange={handleChange}
    required
  />

  <p className={styles.scheduler}>Prize description</p>
  <input
    className={styles.dropDownSchedulerDate}
    type="text"
    name="prizeDescription"
    value={tournament.prizeDescription}
    onChange={handleChange}
    placeholder="Gold medal, cash prize, trophies…"
  />

  <p className={styles.scheduler}>Location</p>
  <select
    className={styles.dropDownScheduler}
    name="location"
    value={tournament.location}
    onChange={handleChange}
  >
    <option value="" disabled>Select location…</option>
    <option value="Columbus">Columbus</option>
    <option value="Cincinnati">Cincinnati</option>
    <option value="Cleveland">Cleveland</option>
    <option value="Dayton">Dayton</option>
    <option value="Chicago">Chicago</option>
    <option value="Bellwood">Bellwood</option>
    <option value="Aurora">Aurora</option>
    <option value="Rockford">Rockford</option>
    <option value="New York">New York</option>
  </select>
    
    
  <p className={styles.submitDesign}>Click this button to submit!</p>
  <button type="submit" className={styles.signUp}>Create</button>

</form>
</div> */}