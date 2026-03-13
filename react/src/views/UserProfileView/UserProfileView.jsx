import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../../services/AuthService";
import { UserContext } from "../../context/UserContext";
import styles from "./UserProfileView.module.css";

export default function UserProfileView() {
  const navigate = useNavigate();
  const { user: authUser, setUser } = useContext(UserContext);

  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [profile, setProfile] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    role: "ROLE_PLAYER",
  });

  useEffect(() => {
    if (!authUser?.id) { navigate("/login"); return; }
    setLoading(true);
    AuthService.getUserProfile(authUser.id)
      .then((res) => {
        const d = res?.data || {};
        setProfile({
          username: d.username || "",
          firstName: d.firstName || "",
          lastName: d.lastName || "",
          email: d.email || "",
          role: d.authorities?.[0]?.name || "",
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
        role: profile.role,
      });
      setIsEditing(false);
      alert("Profile updated!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update profile.");
      if (err.response?.status === 401) navigate("/login");
    }
  }

  async function handleDeleteAccount() {
    try {
      await AuthService.deleteAccount(authUser.id);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setUser(null);
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete account.");
    }
  }

  async function handleLeaveTeam() {
    // Wire up to your TeamService when ready
    alert("Leave team functionality coming soon.");
    setShowLeaveConfirm(false);
  }

  if (loading) return <div className={styles.loading}>Loading profile...</div>;

  const initials = `${profile.firstName?.charAt(0) || ""}${profile.lastName?.charAt(0) || ""}` || "?";
  const isAdmin = profile.role === "ROLE_ADMIN";

  return (
    <div className={styles.page}>

      {/* Hero */}
      <div className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.avatarCircle}>{initials}</div>
          <div className={styles.heroText}>
            <div className={styles.heroPill}>{isAdmin ? "Administrator" : "Player"}</div>
            <h1 className={styles.heroName}>{profile.firstName} {profile.lastName}</h1>
            <p className={styles.heroUsername}>@{profile.username}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className={styles.content}>

        {!isEditing ? (
          <>
            {/* Stat cards */}
            <div className={styles.statsRow}>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>Username</span>
                <span className={styles.statValue}>@{profile.username}</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>Email</span>
                <span className={styles.statValue}>{profile.email}</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>Account Type</span>
                <span className={styles.statValue}>{isAdmin ? "Admin" : "Player"}</span>
              </div>
            </div>

            {/* Info + Team cards */}
            <div className={styles.infoSection}>
              <div className={styles.infoCard}>
                <h2 className={styles.infoTitle}>Personal Info</h2>
                <div className={styles.infoGrid}>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>First Name</span>
                    <span className={styles.infoValue}>{profile.firstName || "—"}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Last Name</span>
                    <span className={styles.infoValue}>{profile.lastName || "—"}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Email</span>
                    <span className={styles.infoValue}>{profile.email || "—"}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Role</span>
                    <span className={styles.infoValue}>{isAdmin ? "Administrator" : "Player"}</span>
                  </div>
                </div>
              </div>

              <div className={styles.infoCard}>
                <h2 className={styles.infoTitle}>Team Membership</h2>
                <div className={styles.infoGrid}>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Member of</span>
                    <span className={styles.infoValue}>{authUser?.teamName || "No team"}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Team Captain of</span>
                    <span className={styles.infoValue}>{authUser?.captainOf || "None"}</span>
                  </div>
                </div>

                {/* Leave Team */}
                {authUser?.teamId && !showLeaveConfirm && (
                  <button className={styles.leaveBtn} onClick={() => setShowLeaveConfirm(true)}>
                    Leave Team
                  </button>
                )}
                {showLeaveConfirm && (
                  <div className={styles.confirmBox}>
                    <p className={styles.confirmText}>Are you sure you want to leave your team?</p>
                    <div className={styles.confirmActions}>
                      <button className={styles.confirmDanger} onClick={handleLeaveTeam}>Yes, Leave</button>
                      <button className={styles.confirmCancel} onClick={() => setShowLeaveConfirm(false)}>Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div className={styles.actionRow}>
              <button className={styles.editBtn} onClick={() => setIsEditing(true)}>
                Edit Profile
              </button>
              {!showDeleteConfirm ? (
                <button className={styles.deleteBtn} onClick={() => setShowDeleteConfirm(true)}>
                  Delete Account
                </button>
              ) : (
                <div className={styles.confirmBox}>
                  <p className={styles.confirmText}>This will permanently delete your account. Are you sure?</p>
                  <div className={styles.confirmActions}>
                    <button className={styles.confirmDanger} onClick={handleDeleteAccount}>Yes, Delete</button>
                    <button className={styles.confirmCancel} onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          /* Edit Form */
          <div className={styles.formCard}>
            <h2 className={styles.infoTitle}>Edit Profile</h2>
            <form onSubmit={handleSave}>
              <div className={styles.formGrid}>
                <div className={styles.formControl}>
                  <label>Username</label>
                  <input name="username" value={profile.username} onChange={handleChange} required />
                </div>
                <div className={styles.formControl}>
                  <label>Email</label>
                  <input type="email" name="email" value={profile.email} onChange={handleChange} required />
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
                  <label>Account Type</label>
                  <select name="role" value={profile.role} onChange={handleChange}>
                    <option value="ROLE_PLAYER">Player</option>
                    <option value="ROLE_ADMIN">Administrator</option>
                  </select>
                </div>
              </div>

              <div className={styles.actionRow}>
                <button type="submit" className={styles.editBtn}>Save Changes</button>
                <button type="button" className={styles.cancelBtn} onClick={() => setIsEditing(false)}>Cancel</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
