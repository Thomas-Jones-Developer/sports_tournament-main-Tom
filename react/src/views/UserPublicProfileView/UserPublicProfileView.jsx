import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styles from "../TomsGlobal/TomsGlobal.module.css";
import UsersService from "../../services/UsersService";

export default function UserPublicProfileView() {
  const { id } = useParams(); // Grab the ID from URL
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requested, setRequested] = useState(false); // Track request state

  useEffect(() => {
    if (!id) return;

    UsersService.getUserById(id)
      .then((response) => {
        setUser(response.data); // response.data is the user object
      })
      .catch((err) => {
        console.error("Error fetching user data:", err);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  // Toggle the request state on click
  const handleClick = () => {
    setRequested(prev => !prev);
  };

  if (loading) return <div className={styles.pageContainer}>Loading user profile...</div>;
  if (!user) return <div className={styles.pageContainer}>User not found.</div>;

  return (
    <div className={styles.pageContainer}>
      <div className={styles.mainContent}>
        <div className={styles.formContainer}>
          <h1 className={styles.title}>{user.firstName} {user.lastName}</h1>

          <div className={styles.subtitle}>
            Below is how your page looks to public viewers
          </div>

          <div className={styles.pageContainerv2}>
            <div className={styles.pageContent1}>
              <div className={styles.columns}>
                <h2 className={styles.profileRow}>{user.firstName} {user.lastName}</h2>
                <img
                  src={user.imageUrl || "src/assets/UserImage.png"}
                  alt="User Image"
                  className={styles.profileImage}
                />
              </div>
            </div>

            <div className={styles.pageContent2}>
              <div className={styles.columns}>
                <div className={styles.leftColumn}>
                  <h2 className={styles.profileRow}>Team</h2>
                  <h2 className={styles.profileRow}>Current Sport</h2>
                  <h2 className={styles.profileRow}>Availability</h2>
                </div>
                <div className={styles.rightColumn}>
                  <h2 className={styles.profileRow}>{user.teamName || "N/A"}</h2>
                  <h2 className={styles.profileRow}>{user.sportName || "N/A"}</h2>
                  <h2 className={styles.profileRow}>{user.availability || "Not Available"}</h2>
                </div>
              </div>
            </div>

            <div className={styles.pageContent3}>
              <div className={styles.columns}>
                <button
                  className={requested ? styles.requestedBtn : styles.profileRow2}
                  onClick={handleClick}
                >
                  {requested ? "Request Sent" : "Request Player"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}