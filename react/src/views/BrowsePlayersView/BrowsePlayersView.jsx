import { useState, useEffect } from "react";
import AuthService from "../../services/AuthService";
import "./BrowsePlayersView.css"; // <-- just the normal CSS import

export default function ViewUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });

  useEffect(() => {
    AuthService.getUsers()
      .then((response) => setUsers(Array.isArray(response.data) ? response.data : []))
      .catch((err) => {
        console.error("Failed to fetch users:", err);
        setUsers([]);
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

  return (
    <div className="pageContainer">
      <div className="mainContent">
        <div className="formContainer">
          <h1 className="title">Our Players</h1>
          <div className="playerSubtitle">
              Ready to compete? Find a tournament to join here!
          </div>
          <table className="playersTable">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Sport ID</th>
                <th>Sport</th>
                <th>Start</th>
                <th>End</th>
                <th>Status</th>
                <th>Winner</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.sportId}</td>
                  <td>{user.sport}</td>
                  <td>{user.startDate}</td>
                  <td>{user.endDate}</td>
                  <td>{user.status}</td>
                  <td>{user.winner ? "Yes" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}