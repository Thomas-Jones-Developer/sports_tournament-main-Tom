import { useState, useEffect } from 'react';
import TeamService from '../../services/TeamService';
import { Link, useNavigate } from 'react-router-dom';
//! Commenting changed the join button and the sort buttons
import teamsBackground from '../../assets/volleyball/VolleyballPics/beach-volleyball-6483796_1280.jpg';
import styles from './TeamView.module.css';

const TeamsView = () => {

  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requestedTeams, setRequestedTeams] = useState([]);
  const [sortOrder, setSortOrder] = useState({ column: null, ascending: true });

  const sortTeams = (column) => {
    const ascending = sortOrder.column === column ? !sortOrder.ascending : true;
    const sortedTeams = [...teams].sort((a, b) => {
      if (a[column] < b[column]) return ascending ? -1 : 1;
      if (a[column] > b[column]) return ascending ? 1 : -1;
      return 0;
    });
    setTeams(sortedTeams);
    setSortOrder({ column, ascending });
  };

  useEffect(() => {
    TeamService.getTeams()
      .then((response) => setTeams(response.data || []))
      .catch((error) => {
        console.error('Error fetching teams:', error);
        setTeams([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleJoinClick = (teamId) => setRequestedTeams((prev) => [...prev, teamId]);

  return (
    <div className={styles.pageContainer}>
      <div
        className={styles.mainContent}
        style={{ backgroundImage: `url(${teamsBackground})` }}
      >
        <div className={styles.formContainer}>
          <h1 className={styles.title}>Our Teams</h1>
          <div className={styles.buttonRow}>
            <button className={styles.roundedBtn} onClick={() => sortTeams('teamId')}>
              Sort by Team {sortOrder.column === 'teamId' ? (sortOrder.ascending ? '↑' : '↓') : ''}
            </button>
            <button className={styles.roundedBtn} onClick={() => sortTeams('sportName')}>
              Sort by Sport {sortOrder.column === 'sportName' ? (sortOrder.ascending ? '↑' : '↓') : ''}
            </button>
            <button className={styles.roundedBtn} onClick={() => sortTeams('numberOfMembers')}>
              Sort by Players {sortOrder.column === 'numberOfMembers' ? (sortOrder.ascending ? '↑' : '↓') : ''}
            </button>
          </div>


          <table className={styles.Table}>
            <thead>
              <tr className={styles.tableHeader}>
                <th>Team ID</th>
                <th>Team Name</th>
                <th>Sport ID</th>
                <th>Sport</th>
                <th>Members</th>
                <th>Accepting Members</th>
                <th>User ID</th>
                <th>Action</th>
              </tr>
            </thead>


            <tbody>
              {(loading || teams.length === 0) &&
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className={i % 2 === 0 ? styles.evenRow : styles.oddRow}>
                    {Array.from({ length: 8 }).map((_, j) => (
                      <td key={j} className={styles.skeletonCell}></td>
                    ))}
                  </tr>
                ))}
              {!loading &&
                teams.map((team, index) => {
                  const isRequested = requestedTeams.includes(team.teamId);



                  // ! We'll test the clickable here
                  return (
                    <tr
                      key={team.teamId}
                      className={`${index % 2 === 0 ? styles.evenRow : styles.oddRow} ${styles.clickableRow}`}
                      onClick={() => navigate(`/SingleTeam/${team.teamId}`)} // <-- dynamic ID
                    >

                      <td>{team.teamId}</td>
                      <td>{team.teamName}</td>
                      <td>{team.sportId}</td>
                      <td>{team.sportName}</td>
                      <td style={{ textAlign: 'center' }}>{team.numberOfMembers}</td>
                      <td>
                        <span className={team.acceptingMembers ? styles.activeStatus : styles.inactiveStatus}>
                          {team.acceptingMembers ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td>{team.userId}</td>
                      
                      
                      <td style={{ textAlign: 'center' }}>
                        {!team.acceptingMembers ? (
                          <span className={styles.disabledBtn}>Team Full</span>
                        ) : isRequested ? (
                          <span className={styles.requestedBtn}>Requested</span>
                        ) : (
                          
                          
                          <button
                            className={styles.joinBtn}
                            onClick={(e) => {
                              e.stopPropagation(); // 🔹 stop the event from reaching the <tr>
                              handleJoinClick(team.teamId);
                            }}
                          >
                            Join Team
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>

          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Link to="/browseTournaments" className={styles.roundedBtn}>
              Upcoming Events
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamsView;