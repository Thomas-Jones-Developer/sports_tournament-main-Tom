import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import TeamService from '../../services/TeamService';
import styles from './CreateTeam.module.css';
import sportsBackground from '../../assets/soccer/SoccerPics/pexels-jonathanborba-18026365.jpg';
import { SPORT_ICONS } from '../../constants/sportsIcons';
import { UserContext } from '../../context/UserContext';

const SPORT_MAP = {
  'Soccer': '1',
  'Baseball': '2',
  'PickleBall': '3',
  'Chess': '4',
  'Esport Mario Kart': '5',
  'Esport Pokemon Unite': '6',
};


export default function CreateTeam() {
  const [team, setTeam] = useState({
    teamName: '',
    sportName: '',
    acceptingMembers: false,
    numberOfMembers: ''
  });

 const navigate = useNavigate();
  const { user, refreshUser } = useContext(UserContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTeam((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckbox = (e) => {
    const { name, checked } = e.target;
    setTeam((prev) => ({ ...prev, [name]: checked }));
  };

  const submitForm = async (e) => {
    e.preventDefault();

    const payload = {
      teamName: team.teamName,
      sportId: SPORT_MAP[team.sportName],
      numberOfMembers: team.numberOfMembers.toString(),
      acceptingMembers: team.acceptingMembers.toString()
    };

    try {
      const res = await TeamService.createTeam(payload);
      if (res.status === 201) {
        await refreshUser(user);
        navigate('/myTeams');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to create team');
    }
  };

  return (
    <div className={styles.pageContainer} style={{ backgroundImage: `url(${sportsBackground})` }}>
      <div className={styles.formContainer}>
        <form onSubmit={submitForm} className={styles.form}>
          <div className={styles.title}>Create Team</div>

          <div className={styles.formControl}>
            <label className={styles.label}>Sport</label>
            <select
              className={styles.input}
              name="sportName"
              value={team.sportName}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Select your sport…
              </option>
              {Object.keys(SPORT_MAP).map((sport) => (
                <option key={sport} value={sport}>
                  {SPORT_ICONS[SPORT_MAP[sport]]} {sport}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formControl}>
            <label className={styles.label}>Team Name</label>
            <input
              className={styles.input}
              type="text"
              name="teamName"
              value={team.teamName}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formControl}>
            <label className={styles.label}>Accepting New Members?</label>
            <label className={styles.checkboxRow}>
              <input
                type="checkbox"
                name="acceptingMembers"
                checked={team.acceptingMembers}
                onChange={handleCheckbox}
              />
              <span>Yes, we are recruiting</span>
            </label>
          </div>

          <div className={styles.formControl}>
            <label className={styles.label}>Number of Members</label>
            <select
              className={styles.input}
              name="numberOfMembers"
              value={team.numberOfMembers}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Select team size…
              </option>
              {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className={styles.submitButton}>
            Create Team
          </button>
        </form>
      </div>
    </div>
  );
}