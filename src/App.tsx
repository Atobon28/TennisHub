import { Navigate, Route, Routes } from "react-router-dom";
import SelectRolePage from "./pages/SelectRolePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import PlayerHomePage from "./pages/player/PlayerHomePage";
import FindMatchesPage from "./pages/player/FindMatchesPage";
import BookCourtPage from "./pages/player/BookCourtPage";
import TournamentsPage from "./pages/player/TournamentsPage";
import PlayerProfilePage from "./pages/player/PlayerProfilePage";
import NotificationsPage from "./pages/player/NotificationsPage";
import TournamentViewPage from "./pages/player/TournamentViewPage";
import CourtViewPage from "./pages/player/CourtViewPage";
import PlayersPage from "./pages/player/PlayersPage";
import PlayerViewPage from "./pages/player/PlayerViewPage";
import FindCoachPage from "./pages/player/FindCoachPage";
import CoachViewPage from "./pages/player/CoachViewPage";
import ProfileTournamentsPage from "./pages/player/ProfileTournamentsPage";
import ProfileChangePasswordPage from "./pages/player/ProfileChangePasswordPage";
import CreateMatchPage from "./pages/player/CreateMatchPage";
import CoachHomePage from "./pages/coach/CoachHomePage";
import AdminHomePage from "./pages/admin/AdminHomePage";
import NotFoundPage from "./pages/NotFoundPage";
import PlayerLayout from "./layouts/PlayerLayout";
import RegisterCoachPage from "./pages/RegisterCoachPage";
import CoachLayout from "./layouts/CoachLayout";
import CoachProfilePage from "./pages/coach/CoachProfilePage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<SelectRolePage />} />{" "}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/register-coach" element={<RegisterCoachPage />} />
      <Route path="/player" element={<PlayerLayout />}>
        <Route index element={<Navigate to="home" replace />} />
        <Route path="home" element={<PlayerHomePage />} />
        <Route path="tournaments" element={<TournamentsPage />} />
        <Route path="tournaments/view" element={<TournamentViewPage />} />
        <Route path="courts" element={<BookCourtPage />} />
        <Route path="courts/view" element={<CourtViewPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="profile" element={<PlayerProfilePage />} />
        <Route
          path="profile/tournaments"
          element={<ProfileTournamentsPage />}
        />
        <Route
          path="profile/change-password"
          element={<ProfileChangePasswordPage />}
        />
        <Route path="players" element={<PlayersPage />} />
        <Route path="players/view" element={<PlayerViewPage />} />
        <Route path="coaches" element={<FindCoachPage />} />
        <Route path="coaches/view" element={<CoachViewPage />} />
        <Route path="create-match" element={<CreateMatchPage />} />
        <Route path="matches" element={<FindMatchesPage />} />
      </Route>
      <Route path="/coach" element={<CoachLayout />}>
        <Route index element={<Navigate to="home" replace />} />
        <Route path="home" element={<CoachHomePage />} />
        <Route path="profile" element={<CoachProfilePage />} />
      </Route>
      <Route path="/admin/home" element={<AdminHomePage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
