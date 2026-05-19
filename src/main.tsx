import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import { CourtsProvider } from "./context/CourtsContext";
import { TournamentsProvider } from "./context/TournamentsContext";
import { MatchesProvider } from "./context/MatchesContext";
import { CoachesProvider } from "./context/CoachesContext";
import { PlayersProvider } from "./context/PlayersContext";
import { ProfileProvider } from "./context/ProfileContext";
import { DashboardProvider } from "./context/DashboardContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CourtsProvider>
          <TournamentsProvider>
            <MatchesProvider>
              <CoachesProvider>
                <PlayersProvider>
                  <ProfileProvider>
                    <DashboardProvider>
                      <App />
                    </DashboardProvider>
                  </ProfileProvider>
                </PlayersProvider>
              </CoachesProvider>
            </MatchesProvider>
          </TournamentsProvider>
        </CourtsProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);