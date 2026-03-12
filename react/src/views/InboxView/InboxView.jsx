import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../TomsGlobal/TomsGlobal.module.css";

export default function InboxView() {











































  return (
    <div className={styles.pageContainer}>
      <div className={styles.mainContent}>
        <div className={styles.formContainer}>
          <h1 className={styles.title}>Inbox</h1>

          <div className={styles.subtitle}>
            Below is your inbox where you can reply to requests and view messages from other users
          </div>

          <div className={styles.pageContainerv2}>

            {/* Sent Messages Section */}
            <div className={styles.pageContent1}>
              <h2>Sent Messages</h2>
            </div>


              <table className={styles.Table}>
                <thead>
                  <tr className={styles.tableHeader}>
                    <th className={styles.tableCell}>Date Sent</th>
                    <th className={styles.tableCell}>Date Received</th>
                    <th className={styles.tableCell}>Sender</th>
                    <th className={styles.tableCell}>Team</th>
                    <th className={styles.tableCell}>Accept/Deny</th>
                    <th className={styles.tableCell}>Message</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className={styles.tableCell}>1</td>
                    <td className={styles.tableCell}>2</td>
                    <td className={styles.tableCell}>3</td>
                    <td className={styles.tableCell}>4</td>
                    <td className={styles.tableCell}>5</td>
                    <td className={styles.tableCell}>6</td>
                  </tr>
                </tbody>
              </table>


            {/* Received Messages Section */}
            <div className={styles.pageContent1}>
              <h2>Received Messages</h2>
            </div>


              <table className={styles.Table}>
                <thead>
                  <tr className={styles.tableHeader}>
                    <th className={styles.tableCell}>From</th>
                    <th className={styles.tableCell}>Message</th>
                    <th className={styles.tableCell}>Reply</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className={styles.tableCell}>a</td>
                    <td className={styles.tableCell}>b</td>
                    <td className={styles.tableCell}>c</td>
                  </tr>
                </tbody>
              </table>


          </div>
        </div>
      </div>
    </div>
  );
}