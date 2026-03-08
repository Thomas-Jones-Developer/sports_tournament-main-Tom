import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";

// import Register from './RegisterMember';
import LoginPage from './loginpage/LoginPage';
import HomePage from './HomePage/HomePage';
import RegisterUser from './RegisterUserPage/RegisterUser';
import CreateTournament from './CreateTournamentPage/CreateTournament';
import BrowseTournamentsPage from './browseTournamentPage/BrowseTournamentsPage';

const Header = () => {
  const navigate = useNavigate();

  return (
    <header>
      <nav style={{ display: 'flex', gap: '10px', padding: '10px', background: '#eee' }}>
        <button onClick={() => navigate('/homepage')}>Home</button>
        <button onClick={() => navigate('/Login')}>Login</button>
        <button onClick={() => navigate('/registerUser')}>Register</button>
        <button onClick={() => navigate('/CreateTournament')}>Create Tournament</button>
        <button onClick={() => navigate('/BrowseTournamentsPage')}>View Tournaments</button>
      </nav>
    </header>
  );
};

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/CreateTournament" element={<CreateTournament />} />
        <Route path="/registerUser" element={<RegisterUser />} />
        <Route path="/Login" element={<LoginPage />} />
        <Route path="/BrowseTournamentsPage" element={<BrowseTournamentsPage />} />
        {/* Optionally, add a redirect or default route */}
        {/* <Route path="*" element={<HomePage />} /> */}
      </Routes>
    </Router>
  );
}


//   return (


//       <Router>
//         <Routes>



//           <Route path="/homepage" element={<HomePage />} />
//           <Route path="/CreateTournament" element={<CreateTournament />} />
//           <Route path='/registerUser' element={<RegisterUser/>} />
//           <Route path='/Login' element={<LoginPage/>} />
//           <Route path='/BrowseTournamentsPage' element={<BrowseTournamentsPage/>}/>


//         </Routes>
//       </Router>


// // // Stuff that is old
// //     <div className="App">
// //       <HomePage/>
// //       <SoccerPage/>
// //       <RegisterUser/>
// //       {/* below this line is shit tom made */}

//       // <Register/>
//       // <Login/>
//       // <CreateTournament />
//     // </div>
//   );
// }

export default App;
