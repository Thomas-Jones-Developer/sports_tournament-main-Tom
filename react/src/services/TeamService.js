// src/services/TeamService.js
import axios from 'axios';

export default {
  // GET all teams
  getTeams() {
    return axios.get('/team');
  },

  // GET team by id
  getTeamById(teamId) {
    return axios.get(`/team/${teamId}`);
  },

getTeamByUserId(userId) {
  return axios.get(`/team/user/${userId}`);
},



  // POST create team
  createTeam(team) {
    return axios.post('/team/register', team);
  },

  // PUT update team
  updateTeam(teamId, team) {
    return axios.put(`/team/${teamId}`, team);
  },

  // DELETE delete team
  deleteTeam(teamId) {
    return axios.delete(`/team/${teamId}`);
  }
};
