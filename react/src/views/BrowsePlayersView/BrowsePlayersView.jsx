import { useState, useEffect } from "react";
import AuthService from "../../services/AuthService";
import "../BrowsePlayersView/BrowsePlayersView.css";

export default function ViewUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AuthService.getUsers()
      .then((response) => {
        const data = Array.isArray(response.data) ? response.data : [];
        setUsers(data);
      })
      .catch((err) => {
        console.error("Failed to fetch users:", err);
        setUsers([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="card">
      <h1>TEsport</h1>
      <hr className="divider" />

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
            </tr>
          </thead>

          <tbody>
            {(loading || users.length === 0) &&
              Array.from({ length: 8 }).map((_, i) => (
                <tr key={`skeleton-${i}`}>
                  <td />
                  <td />
                  <td />
                </tr>
              ))}

            {!loading &&
              users.map((u, i) => (
                <tr key={u.userId ?? u.email ?? i}>
                  <td>{u.firstName}</td>
                  <td>{u.lastName}</td>
                  <td>{u.email}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
