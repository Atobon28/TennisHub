import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import NotFoundPage from './pages/NotFoundPage'
import PlayerHomePage from './pages/player/PlayerHomePage'
import FindMatchesPage from './pages/player/FindMatchesPage'
import BookCourtPage from './pages/player/BookCourtPage'
import TournamentsPage from './pages/player/TournamentsPage'
import PlayerProfilePage from './pages/player/PlayerProfilePage'
import CoachHomePage from './pages/coach/CoachHomePage'
import AdminHomePage from './pages/admin/AdminHomePage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route path="/player/home" element={<PlayerHomePage />} />
      <Route path="/player/matches" element={<FindMatchesPage />} />
      <Route path="/player/book-court" element={<BookCourtPage />} />
      <Route path="/player/tournaments" element={<TournamentsPage />} />
      <Route path="/player/profile" element={<PlayerProfilePage />} />

      <Route path="/coach/home" element={<CoachHomePage />} />
      <Route path="/admin/home" element={<AdminHomePage />} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App

