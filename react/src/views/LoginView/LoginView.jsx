import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import AuthService from '../../services/AuthService';
import TeamService from '../../services/TeamService';
import Notification from '../../components/Notification/Notification';
import { UserContext } from '../../context/UserContext';
import teamsBackground from '../../assets/carousel/image9.jpg';
import axios from 'axios';

import styles from './LoginView.module.css';

export default function LoginView() {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [notification, setNotification] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(event) {
    event.preventDefault();

    AuthService.login({ username, password })
      .then((response) => {
        const user = response.data.user;
        const token = response.data.token;
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        localStorage.setItem('token', token);

        return Promise.all([
          TeamService.getTeams(),
          axios.get(`/team/member/${user.id}`)
        ]).then(([teamsRes, memberRes]) => {
          const teams = teamsRes.data || [];
          const ownedTeam = teams.find((t) => t.userId === user.id);
          const memberTeam = memberRes.data;
          const enrichedUser = {
            ...user,
            teamId: ownedTeam?.teamId || memberTeam?.teamId || null,
          };
          localStorage.setItem('user', JSON.stringify(enrichedUser));
          setUser(enrichedUser);
        });
      })
      .catch((error) => {
        const message = error.response?.data?.message || 'Login failed.';
        setNotification({ type: 'error', message });
      })
      .finally(() => navigate('/'));
  }

  return (
    <div className={styles.pageContainer}>
      <div
        className={styles.mainContent}
        style={{ backgroundImage: `url(${teamsBackground})` }}
      >
        <div className={styles.formContainer}>
          <h1 className={styles.title}>Login</h1>

          <Notification
            notification={notification}
            clearNotification={() => setNotification(null)}
          />

          <form onSubmit={handleSubmit}>
            <div className={styles.formControl}>
              <label htmlFor="username">Username:</label>
              <input
                type="text"
                id="username"
                value={username}
                size="50"
                required
                autoFocus
                autoComplete="username"
                onChange={(event) => setUsername(event.target.value)}
              />
            </div>

            <div className={styles.formControl}>
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                value={password}
                size="50"
                required
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>

            <div className={styles.buttonRow}>
              <button type="submit" className={styles.roundedBtn}>
                Sign in
              </button>
            </div>

            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <Link to="/register" className={styles.roundedBtn}>
                New? Register here!
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}