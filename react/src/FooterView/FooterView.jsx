import React from 'react';
import styles from './Footer.module.css';
import { FaTwitter, FaFacebookF, FaInstagram } from 'react-icons/fa';

export default function FooterView() {
  return (
    <footer className={styles.footer}>
      {/* Top row: Links only */}
      <div className={styles.topRow}>
        <div className={styles.links}>
          <a href="/">Home</a>
          <a href="/createTeam">Create Team</a>
          <a href="/browseTournaments">Browse Tournaments</a>
          <a href="/userProfile">Profile</a>
        </div>
      </div>

      {/* Bottom row: Social icons */}
      <div className={styles.socialRow}>
        <a href="#"><FaTwitter /></a>
        <a href="#"><FaFacebookF /></a>
        <a href="#"><FaInstagram /></a>
      </div>
    </footer>
  );
}