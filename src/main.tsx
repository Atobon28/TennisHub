import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import {
  AuthProvider,
  CourtsProvider,
  TournamentsProvider,
  MatchesProvider,
  CoachesProvider,
  PlayersProvider,
  ProfileProvider,
  DashboardProvider,
} from "./context";

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