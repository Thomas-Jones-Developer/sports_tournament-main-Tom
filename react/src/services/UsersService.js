import axios from "axios";

export default {

  createUser(userBody) {
    return axios.post("/users", userBody);
  },

  getUsers() {
    return axios.get("/users");
  },

  getTeams() {
    return axios.get("/team");
  },

  updateUser(userState, id) {
    return axios.put(`/users/${id}`, userState);
  }

};