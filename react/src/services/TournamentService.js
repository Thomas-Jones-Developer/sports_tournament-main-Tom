import axios from 'axios'

export default {

    createTournament(tournamentBody) {
        return axios.post('/tournament', tournamentBody)
    },

    getTournament(){
        return axios.get('/tournament')
    },

    updateTournamentState(tournamentState, id) {

        console.log(tournamentState);
        return axios.put(`tournament/update-pairing/${id}`, tournamentState)
    }


}