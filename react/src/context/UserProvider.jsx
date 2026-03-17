import { useState } from 'react';
import { UserContext } from './UserContext';
import axios from 'axios';
import TeamService from '../services/TeamService';

export default function UserProvider({ children }) {
  const [user, setUser] = useState(() => getUserAndTokenFromStorage());

  function getUserAndTokenFromStorage() {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    if (user && token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      return user;
    }

    return null;
  }

function refreshUser(currentUser) {
  if (!currentUser) return Promise.resolve();
  return Promise.all([
    TeamService.getTeams(),
    axios.get(`/team/member/${currentUser.id}`)
  ]).then(([teamsRes, memberRes]) => {
    const teams = teamsRes.data || [];
    const ownedTeam = teams.find((t) => t.userId === currentUser.id);
    const memberTeams = memberRes.data || [];
    // Use first member team for teamId (for challenge/invite logic)
    const firstMemberTeam = Array.isArray(memberTeams) ? memberTeams[0] : memberTeams;
    const enrichedUser = {
      ...currentUser,
      teamId: ownedTeam?.teamId || firstMemberTeam?.teamId || null,
    };
    localStorage.setItem('user', JSON.stringify(enrichedUser));
    setUser(enrichedUser);
  }).catch((err) => console.error("Failed to refresh user:", err));
}

  return (
    <UserContext.Provider value={{ user, setUser, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
}