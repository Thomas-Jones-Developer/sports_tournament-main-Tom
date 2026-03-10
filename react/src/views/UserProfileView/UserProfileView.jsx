import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../../services/AuthService";
import { UserContext } from "../../context/UserContext";
import styles from "./UserProfileView.module.css";
import allSports from "../../assets/basketball/BasketballPics/pexels-chris-wade-ntezicimpa-564856410-31756788.jpg";

export default function UserProfileView() {
  const navigate = useNavigate();
  const { user: authUser } = useContext(UserContext);

  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    //!Adding more options "is Administrator"
    role: "ROLE_PLAYER",
  });

  useEffect(() => {
    if (!authUser?.id) {
      navigate("/login");
      return;
    }

    setLoading(true);
    AuthService.getUserProfile(authUser.id)
      .then((res) => {
        const d = res?.data || {};
        setProfile({
          username: d.username || "",
          firstName: d.firstName || "",
          lastName: d.lastName || "",
          email: d.email || "",
          // ! New option === THIS MIGHT NOT BE WHAT ITS CALLED
          role: d.authorities?.[0]?.name || "", //! leaving blank as a test // Cool seemed to work
        });
      })
      .catch((err) => {
        alert(err.response?.data?.message || "Failed to load your profile.");
        if (err.response?.status === 401) navigate("/login");
      })
      .finally(() => setLoading(false));
  }, [authUser?.id, navigate]);

  function handleChange(e) {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSave(e) {
    e.preventDefault();
    try {
      await AuthService.updateUserProfile(authUser.id, {
        username: profile.username.trim(),
        firstName: profile.firstName.trim(),
        lastName: profile.lastName.trim(),
        email: profile.email.trim(),
        role: profile.role
      });
      setIsEditing(false);
      alert("Profile updated!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update profile.");
      if (err.response?.status === 401) navigate("/login");
    }
  }

  if (loading) return <p>Loading…</p>;


  return (
    <div
      className={styles.profilePage}
      style={{
        background: `url(${allSports}) no-repeat center center fixed`,
        backgroundSize: "cover",
        minHeight: "100vh",
      }}
    >


      <div className={styles.pageInner}>
        <div className={styles.profileContainer}>
          <h2 className={styles.profileHeader}>Your Profile</h2>

          {!isEditing ? (
            <div className={styles.profileDetails}>
              <p><strong>Username:</strong> {profile.username}</p>
              <p><strong>First Name:</strong> {profile.firstName}</p>
              <p><strong>Last Name:</strong> {profile.lastName}</p>
              <p><strong>Email:</strong> {profile.email}</p>
            {/* NEW SHIT */}
              <p>
                <strong>Account Type:</strong>{" "}
                {profile.role === "ROLE_ADMIN" ? "Administrator" : "Player"}
              </p>


              <div className={styles.actions}>
                <button className={styles.editBtn} onClick={() => setIsEditing(true)}>
                  Edit
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSave}>
              <div className={styles.formControl}>
                <label>Username</label>
                <input name="username" value={profile.username} onChange={handleChange} required />
              </div>

              <div className={styles.formControl}>
                <label>First Name</label>
                <input name="firstName" value={profile.firstName} onChange={handleChange} required />
              </div>

              <div className={styles.formControl}>
                <label>Last Name</label>
                <input name="lastName" value={profile.lastName} onChange={handleChange} required />
              </div>

              <div className={styles.formControl}>
                <label>Email</label>
                <input type="email" name="email" value={profile.email} onChange={handleChange} required />
              </div>
              <div className={styles.formControl}>
                <label>Account Type</label>
                <select name="role" value={profile.role} onChange={handleChange}>
                  <option value="ROLE_PLAYER">Player</option>
                  <option value="ROLE_ADMIN">Administrator</option>
                </select>
              </div>

              <div className={styles.actions}>
                <button type="submit" className={styles.primaryBtn}>Save</button>
                <button type="button" className={styles.secondaryBtn} onClick={() => setIsEditing(false)}>
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
