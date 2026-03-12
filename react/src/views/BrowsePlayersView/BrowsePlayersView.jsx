import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UsersService from "../../services/UsersService";
import styles from "./BrowsePlayersView.module.css";

export default function ViewUsers() {
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([UsersService.getUsers(), UsersService.getTeams()])
      .then(([usersRes, teamsRes]) => {
        const usersData = usersRes.data || [];
        const teamsData = teamsRes.data || [];

        setTeams(teamsData);

        // Map userId -> teamName
        const teamMap = {};
        teamsData.forEach((membership) => {
          teamMap[membership.userId] = membership.teamName;
        });

        // Combine users with team names
        const combinedUsers = usersData.map((user) => ({
          ...user,
          teamName: teamMap[user.id] || "No Team",
        }));

        setUsers(combinedUsers);
      })
      .catch((error) => {
        console.error("Failed to load data:", error);
        setUsers([]);
        setTeams([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const sortData = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") direction = "desc";
    setSortConfig({ key, direction });

    const sorted = [...users].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setUsers(sorted);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className={styles.pageContainer}>
      <div className={styles.mainContent}>
        <div className={styles.formContainer}>
          <h1 className={styles.title}>Our Players</h1>

          <div className={styles.playerSubtitle}>
            Looking for players for your team? Browse our list of registered players and find your next teammate!
          </div>

          <div className={styles.buttonRow}>
            <button className={styles.roundedBtn} onClick={() => sortData("firstName")}>
              Sort by First Name {sortConfig.key === "firstName" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
            </button>
            <button className={styles.roundedBtn} onClick={() => sortData("lastName")}>
              Sort by Last Name {sortConfig.key === "lastName" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
            </button>
            <button className={styles.roundedBtn} onClick={() => sortData("teamName")}>
              Sort by Team {sortConfig.key === "teamName" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
            </button>
          </div>

          <table className={styles.playersTable}>
            <thead>
              <tr className={styles.tableHeader}>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Team</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className={styles.clickableRow}
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(`/publicProfile/${user.id}`)}
                >
                  <td>{user.firstName}</td>
                  <td>{user.lastName}</td>
                  <td>{user.email}</td>
                  <td>{user.teamName}</td>
                  <td>{user.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}