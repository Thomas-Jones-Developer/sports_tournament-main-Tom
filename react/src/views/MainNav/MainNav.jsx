import { useContext, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import logo from "../../assets/greenTElogo.jpg";
import styles from "./MainNav.module.css";

export default function MainNav() {
  const { user } = useContext(UserContext);
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (name) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const closeDropdown = () => setOpenDropdown(null);

  return (
    <nav id="main-nav" className={styles.nav}>
      <div className={styles.logoContainer}>
        <NavLink to="/">
          <img src={logo} alt="TESport Logo" className={styles.logo} />
        </NavLink>
      </div>

      {/* Top-level links */}
      <div className={styles.navLink}>
        <NavLink to="/">Home</NavLink>
      </div>

      {/* Teams Dropdown */}
      <div className={styles.dropdown}>
        <button
          className={`${styles.dropdownToggle} ${openDropdown === 'teams' ? styles.open : ''}`}
          onClick={() => toggleDropdown('teams')}
        >
          Teams ▾
        </button>
        {openDropdown === 'teams' && (
          <div className={styles.dropdownMenu}>
            <NavLink to="/createTeam" onClick={closeDropdown}>Create Team</NavLink>
            <NavLink to="/viewTeams" onClick={closeDropdown}>Browse Teams</NavLink>
          </div>
        )}
      </div>

      {/* Tournaments Dropdown */}
      <div className={styles.dropdown}>
        <button
          className={`${styles.dropdownToggle} ${openDropdown === 'tournaments' ? styles.open : ''}`}
          onClick={() => toggleDropdown('tournaments')}
        >
          Tournaments ▾
        </button>
        {openDropdown === 'tournaments' && (
          <div className={styles.dropdownMenu}>
            <NavLink to="/createTournament" onClick={closeDropdown}>Create Tournament</NavLink>
            <NavLink to="/browseTournaments" onClick={closeDropdown}>Browse Tournaments</NavLink>
          </div>
        )}
      </div>

      {/* Players Dropdown */}
      <div className={styles.dropdown}>
        <button
          className={`${styles.dropdownToggle} ${openDropdown === 'players' ? styles.open : ''}`}
          onClick={() => toggleDropdown('players')}
        >
          Players ▾
        </button>
        {openDropdown === 'players' && (
          <div className={styles.dropdownMenu}>
            <NavLink to="/browsePlayers" onClick={closeDropdown}>Browse Players</NavLink>
            {user && (
              <NavLink to={`/publicProfile/${user.id}`} onClick={closeDropdown}>Player Profile</NavLink>
            )}
          </div>
        )}
      </div>

      {/* Auth-dependent links */}
      {user ? (
        <>
          {/* Profile Dropdown */}
          <div className={styles.dropdown}>
            <button
              className={`${styles.dropdownToggle} ${openDropdown === 'profile' ? styles.open : ''}`}
              onClick={() => toggleDropdown('profile')}
            >
              {user.username} ▾
            </button>
            {openDropdown === 'profile' && (
              <div className={styles.dropdownMenu}>
                <NavLink to={user.teamId ? `/SingleTeam/${user.teamId}` : '/createTeam'} onClick={closeDropdown}>
                  {user.teamId ? 'My Team' : 'No Team Yet'}
                </NavLink>
                <NavLink to="/Inbox" onClick={closeDropdown}>Inbox</NavLink>
                <NavLink to="/userProfile" onClick={closeDropdown}>Edit Profile</NavLink>
              </div>
            )}
          </div>

          <div className={styles.navLink}>
            <Link to="/logout">Logout</Link>
          </div>
        </>
      ) : (
        <>
          <div className={styles.navLink}>
            <NavLink to="/register">Create an account</NavLink>
          </div>
          <div className={styles.navLink}>
            <NavLink to="/login">Login</NavLink>
          </div>
        </>
      )}
    </nav>
  );
}