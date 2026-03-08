import { useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
// import CreateTournament from '../CreateTournament';
import logo from "../../assets/greenTElogo.jpg"; 
// import styles from '../../components/MainNav/MainNav.module.css';
import styles from "../MainNav/MainNav.module.css";


export default function MainNav() {
  const { user } = useContext(UserContext);

  return (


    <nav id="main-nav" className="nav-link">
    <div className={styles.logoContainer}>
      <NavLink to="/">
        <img src={logo} alt="TESport Logo" className={styles.logo}/>
      </NavLink>
    </div>

    
      <div className={styles.navLink}>
        <NavLink to="/"> Home </NavLink>
      </div>

      <div className={styles.navLink}>
        <NavLink to="register"> Create an account </NavLink>
      </div>

      <div className={styles.navLink}>
        <NavLink to="createTeam"> Create Team</NavLink>
      </div>


      <div className={styles.navLink}>
        <NavLink to="createTournament"> Create Tournament</NavLink>
      </div>

      <div className={styles.navLink}>
        <NavLink to="browseTournaments">Browse Tournaments</NavLink>
      </div>

      {/* <div className={styles.navLink}>
        <NavLink to="browseUsers">Browse Players</NavLink>
      </div> */}

      <div className={styles.navLink}>
        <NavLink to="viewTeams">Browse Teams</NavLink>
      </div>

      {/* <div className={styles.navLink}>
        <NavLink to="ourTeam">Our Team</NavLink>
      </div> */}


      {/* <div className={styles.navLink}>
        <NavLink to="bracketsView">View Brackets</NavLink>
      </div> */}

      {/* <div className={styles.navLink}>
        <NavLink to="joinTeam">Join Teams</NavLink>
      </div> */}

      {/* <div className={styles.navLink}>
        <NavLink to="joinTournament">Join Tournament</NavLink>
      </div> */}






      {/* Profile - Login - Log-out */}
      {user ? (
  <>
    <div className={styles.navLink}>
      <NavLink to="/userProfile">Profile</NavLink>
    </div>
    <div className={styles.navLink}>
      <Link to="/logout">Logout</Link>
    </div>
  </>
) : (
  <div className={styles.navLink}>
    <NavLink to="/login">Login</NavLink>
  </div>
)}




    </nav>
  );
}
