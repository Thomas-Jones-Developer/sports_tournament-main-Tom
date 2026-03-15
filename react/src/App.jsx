import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomeView from './views/HomeView/HomeView';
import LoginView from './views/LoginView/LoginView';
import LogoutView from './views/LogoutView';
import RegisterView from './views/RegisterView/RegisterView';
import UserProfileView from './views/UserProfileView/UserProfileView';
import MainNav from './views/MainNav/MainNav.jsx';
import ProtectedRoute from './components/ProtectedRoute';
import CreateTournament from './components/CreateTournament';
import TeamsView from './views/TeamsView/TeamsView.jsx';
import JoinTeamView from './views/JoinTeamView/JoinTeamView.jsx';
import JoinTournamentView from './views/JoinTournamentView/JoinTournamentView.jsx';
import BrowseTournaments from './views/BrowseTournamentView/BrowseTournaments.jsx';
import BrowsePlayersView from './views/BrowsePlayersView/BrowsePlayersView.jsx';
import CreateTeamView from './views/CreateTeamView/CreateTeamView.jsx';
import BracketsView from './views/BracketsView/BracketsVIew.jsx';
import OurTeamView from './views/OurTeamView/OurTeamView.jsx';


import UserPublicProfileView from './views/UserPublicProfileView/UserPublicProfileView.jsx' //! New stuff
import SingleTeamView from './views/SingleTeamView/SingleTeamView.jsx' //! New stuff
import InboxView from './views/InboxView/InboxView.jsx' //! New stuff
import MyTeamsView from './views/MyTeamsView/MyTeamsView.jsx'; //! New stuff


import FooterView from './FooterView/FooterView'; // site-wide footer
import styles from './App.module.css';

export default function App() {
  return (
    <BrowserRouter>
      <div className={styles.app}>
        <MainNav />

        <div className={styles.mainArea}>
          <main className={styles.mainContent}>
            <Routes>
              <Route path="/register" element={<RegisterView />} />
              <Route path="/createTournament" element={<CreateTournament />} />
              <Route path="/browseTournaments" element={<BrowseTournaments />} />


              <Route path="/browsePlayers" element={<BrowsePlayersView />} /> //! just added this
              <Route path="/publicProfile/:id?" element={<UserPublicProfileView />} />
              <Route path="/myTeams" element={<MyTeamsView />} />
              <Route path="/SingleTeam/:id" element={<SingleTeamView/>} /> //! more new stuff
              <Route path="/Inbox" element={<InboxView />} />


              <Route path="/createTeam" element={<CreateTeamView />} />
              <Route path="/viewTeams" element={<TeamsView />} />
              <Route path="/joinTeam" element={<JoinTeamView />} />
              <Route path="/joinTournament" element={<JoinTournamentView />} />
              <Route path="/" element={<HomeView />} />
              <Route path="/login" element={<LoginView />} />
              <Route path="/logout" element={<LogoutView />} />
              <Route path="/browseUsers" element={<BrowsePlayersView />} />
              <Route path="/tournament/:id" element={<BracketsView />} />
              <Route path="/ourTeam" element={<OurTeamView />} />
              <Route
                path="/userProfile"
                element={
                  <ProtectedRoute>
                    <UserProfileView />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <FooterView />
        </div>
      </div>
    </BrowserRouter>
  );
}
