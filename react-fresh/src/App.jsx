import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomeView from './views/HomeView/HomeView';
import LoginView from './views/LoginView/LoginView';
import LogoutView from './views/LogoutView';
import RegisterView from './views/RegisterView/RegisterView';
import UserProfileView from './views/UserProfileView/UserProfileView';
import MainNav from './components/MainNav/MainNav';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {

  return (
    <BrowserRouter>
      <div id="app">
          <MainNav />
          <main id="main-content">
            <Routes>
              <Route path="/" element={<HomeView />} />
              <Route path="/login" element={<LoginView />} />
              <Route path="/logout" element={<LogoutView />} />
              <Route path="/register" element={<RegisterView />} />
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
      </div>
    </BrowserRouter>
  );
}
