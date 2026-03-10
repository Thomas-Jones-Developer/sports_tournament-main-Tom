
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./UserPublicProfileView.module.css";




export default function UserPublicProfileView() {
    return (

        //! EDIT EVERYTHING BELOW
        <div className={styles.pageContainer}>
            <div className={styles.mainContent}>
                <div className={styles.formContainer}>
                    <h1 className={styles.title}>My Profile</h1>

                    <div className={styles.subtitle}>
                        Below is how my page looks to public viewers
                    </div>


                    <div className={styles.subContainer}>
                        <h1 className={styles.profileRow}>My Name</h1>
                        <h1 className={styles.profileRow}>My Picture</h1>
                    </div>


                    <div className={styles.subContainer}>
                        <h1 className={styles.profileRow}>Team</h1>
                        <h1 className={styles.profileRow}>My Team</h1>
                    </div>


                    <div className={styles.subContainer}>
                        <h1 className={styles.profileRow}>Current Sport</h1>
                        <h1 className={styles.profileRow}>Soccer</h1>
                    </div>

                    <div className={styles.subContainer}>
                        <h1 className={styles.profileRow}>Availablily</h1>
                        <h1 className={styles.profileRow}>NO man</h1>
                    </div>


                </div>
            </div>
        </div>
    );
}
{/* //! A table for being deleted */ }
{/* <table className={styles.playersTable}>
            <thead>
              <tr className={styles.tableHeader}>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Team</th>
                <th>Role</th>
              </tr>
            </thead>
          </table> */}

{/* <div className={styles.buttonRow}>
            <button className={styles.roundedBtn} onClick={() => sortData("firstName")}>
              Sort by First Name {sortConfig.key === "firstName" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
            </button>
            <button className={styles.roundedBtn} onClick={() => sortData("lastName")}>
              Sort by Last Name {sortConfig.key === "lastName" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
            </button>
            <button className={styles.roundedBtn} onClick={() => sortData("teamName")}>
              Sort by Team {sortConfig.key === "teamName" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
            </button>
          </div> */}