import axios from "axios";

export default {
  getUsers() {
    return axios.get("/users");
  },

  getUserById(id) {
    return axios.get(`/users/${id}`);
  },

  getTeams() {
    return axios.get("/team");
  },

  updateUser(userState, id) {
    return axios.put(`/users/${id}`, userState);
  }
};