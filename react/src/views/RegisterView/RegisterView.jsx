import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthService from '../../services/AuthService';
import Notification from '../../components/Notification/Notification';
import sportsBackground from '../../assets/chess/leanna-cushman-_GF3sgGkSB0-unsplash.jpg';

import styles from './RegisterView.module.css';

export default function RegisterView() {
  const navigate = useNavigate();

  const [notification, setNotification] = useState(null);

  // Setup state for the registration data
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('')
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');

  function handleSubmit(event) {
    event.preventDefault();

    // Validate the form data
    if (password !== confirmPassword) {
      // Passwords don't match, so display error notification
      setNotification({ type: 'error', message: 'Passwords do not match.' });
    } else {
      // If no errors, send data to server
      AuthService.register({
        username,
        password,
        confirmPassword,
        role,
        firstName,
        lastName,
        email,
      })
        .then(() => {
          setNotification({ type: 'success', message: 'Registration successful' });
          navigate('/login');
        })
        .catch((error) => {
          // Check for a response message, but display a default if that doesn't exist
          const message = error.response?.data?.message || 'Registration failed.';
          setNotification({ type: 'error', message: message });
        });
    }
  }

  return (
    <div className={styles.pageContainer}>

      {/* Main content area with background */}
      <div
        className={styles.mainContent}
        style={{ backgroundImage: `url(${sportsBackground})` }}
      >
        <div className={styles.formContainer}>
        <div className={styles.title}>Create Account</div>

          <Notification
            notification={notification}
            clearNotification={() => setNotification(null)}
          />

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formControl}>
              <label htmlFor="username">Username:</label>
              <input
                type="text"
                id="username"
                value={username}
                className={styles.input}
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
                className={styles.input}
                required
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>

            <div className={styles.formControl}>
              <label htmlFor="confirmPassword">Confirm Password:</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                className={styles.input}
                required
                onChange={(event) => setConfirmPassword(event.target.value)}
              />
            </div>

            <div className={styles.formControl}>
              <label htmlFor="role">Role:</label>
              <select
                id="role"
                value={role}
                className={styles.select}
                onChange={(event) => setRole(event.target.value)}
                required
              >
                <option value="">-- Select a role --</option>
                <option value="ADMIN">Organizer</option>
                <option value="PLAYER">Player</option>
                <option value="CAPTAIN">Captain</option>
              </select>
            </div>

            <div className={styles.formControl}>
              <label htmlFor="firstName">First Name:</label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                className={styles.input}
                required
                onChange={(event) => setFirstName(event.target.value)}
              />
            </div>

            <div className={styles.formControl}>
              <label htmlFor="lastName">Last Name:</label>
              <input
                type="text"
                id="lastName"
                value={lastName}
                className={styles.input}
                required
                onChange={(event) => setLastName(event.target.value)}
              />
            </div>

            <div className={styles.formControl}>
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                value={email}
                className={styles.input}
                required
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>

            <button type="submit" className={styles.submitButton}>
              Register
            </button>

            <Link to="/login" className={styles.loginLink}>
              Have an account? Log-in
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}