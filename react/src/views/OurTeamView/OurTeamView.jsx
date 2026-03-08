import React from 'react';
import styles from './OurTeamView.module.css';

// Using placeholder images for now
const placeholderImg = 'https://via.placeholder.com/150';

export default function OurTeamView() {
  const teamMembers = [
    { img: placeholderImg, name: 'Clara'},
    { img: placeholderImg, name: 'Cain'},
    { img: placeholderImg, name: 'Kamal'},
    { img: placeholderImg, name: 'Nahom'},
    { img: placeholderImg, name: 'Thomas'},
    { img: placeholderImg, name: 'Clarabel'},
  ];

  return (
    <>
      <div className={styles.ourTeamPage}>
        <h1 className={styles.pageHeader}>Our Team</h1>
  
        <div className={styles.membersGrid}>
          {teamMembers.map((member, index) => (
            <div key={index} className={styles.memberCard}>
              <div className={styles.avatar}>
                <img src={member.img} alt={member.name} />
              </div>
              <h3>{member.name}</h3>
              <p>{member.role}</p>
            </div>
          ))}
        </div>
      </div>
  
      <div className={styles.placeholderRow}>
        <h1>Placeholder</h1>
      </div>
    </>
  );
}