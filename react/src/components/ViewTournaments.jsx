// import { useState, useEffect } from "react"
// import TournamentService from "../services/TournamentService";

// export default function ViewTournaments() {


//     const [tournament, setTournament] = useState([]);

//     useEffect(
//         () => {
//             TournamentService.getTournament().then(
//                 (response) => {
//                     console.log(response.data)
//                     setTournament(response.data)
//                 }
//             )
//         },[]
//     )

    



//     return(
//         <>
//            <p>hello</p>
//            { 
//             tournament.map(
//                 (x) => (
//                     <p key={x.tournamentId}> {x.name} </p>
//                     <p key={x.sportId} </p
//                 )
//             )
//             }
//         </>
//     )
// }