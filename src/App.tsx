import { Navigate, Route, Routes } from "react-router-dom";
import SelectRolePage from "./pages/SelectRolePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import RegisterCoachPage from "./pages/RegisterCoachPage";
import RegisterAdminPage from "./pages/RegisterAdminPage";
import PlayerHomePage from "./pages/player/PlayerHomePage";
import BookCourtPage from "./pages/player/BookCourtPage";
import TournamentsPage from "./pages/player/TournamentsPage";
import PlayerProfilePage from "./pages/player/PlayerProfilePage";
import TournamentViewPage from "./pages/player/TournamentViewPage";
import CourtViewPage from "./pages/player/CourtViewPage";
import PlayersPage from "./pages/player/PlayersPage";
import PlayerViewPage from "./pages/player/PlayerViewPage";
import FindCoachPage from "./pages/player/FindCoachPage";
import CoachViewPage from "./pages/player/CoachViewPage";
import CreateMatchPage from "./pages/player/CreateMatchPage";
import FindMatchesPage from "./pages/player/FindMatchesPage";
import MatchViewPage from "./pages/player/MatchViewPage";
import CoachHomePage from "./pages/coach/CoachHomePage";
import CoachProfilePage from "./pages/coach/CoachProfilePage";
import AdminHomePage from "./pages/admin/AdminHomePage";
import AdminCourtsPage from "./pages/admin/AdminCourtsPage";
import AdminCourtViewPage from "./pages/admin/AdminCourtViewPage";
import AdminTournamentsPage from "./pages/admin/AdminTournamentsPage";
import AdminTournamentViewPage from "./pages/admin/AdminTournamentViewPage";
import AdminProfilePage from "./pages/admin/AdminProfilePage";
import NotFoundPage from "./pages/NotFoundPage";
import PlayerLayout from "./layouts/PlayerLayout";
import CoachLayout from "./layouts/CoachLayout";
import AdminLayout from "./layouts/AdminLayout";

function App() {
  return (
    <Routes>
      <Route path="/" element={<SelectRolePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/register-coach" element={<RegisterCoachPage />} />
      <Route path="/register-admin" element={<RegisterAdminPage />} />

      <Route path="/player" element={<PlayerLayout />}>
        <Route index element={<Navigate to="home" replace />} />
        <Route path="home" element={<PlayerHomePage />} />
        <Route path="tournaments" element={<TournamentsPage />} />
        <Route path="tournaments/view/:id" element={<TournamentViewPage />} />
        <Route path="courts" element={<BookCourtPage />} />
        <Route path="courts/view/:id" element={<CourtViewPage />} />
        <Route path="profile" element={<PlayerProfilePage />} />
        <Route path="players" element={<PlayersPage />} />
        <Route path="players/view/:uid" element={<PlayerViewPage />} />
        <Route path="coaches" element={<FindCoachPage />} />
        <Route path="coaches/view/:uid" element={<CoachViewPage />} />
        <Route path="create-match" element={<CreateMatchPage />} />
        <Route path="matches" element={<FindMatchesPage />} />
        <Route path="matches/view/:id" element={<MatchViewPage />} />
      </Route>

      <Route path="/coach" element={<CoachLayout />}>
        <Route index element={<Navigate to="home" replace />} />
        <Route path="home" element={<CoachHomePage />} />
        <Route path="profile" element={<CoachProfilePage />} />
      </Route>

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="home" replace />} />
        <Route path="home" element={<AdminHomePage />} />
        <Route path="courts" element={<AdminCourtsPage />} />
        <Route path="courts/view/:id" element={<AdminCourtViewPage />} />
        <Route path="tournaments" element={<AdminTournamentsPage />} />
        <Route
          path="tournaments/view/:id"
          element={<AdminTournamentViewPage />}
        />
        <Route path="profile" element={<AdminProfilePage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
