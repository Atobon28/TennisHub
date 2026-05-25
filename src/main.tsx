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
import { ToastProvider } from "./context/ToastContext";
import Toast from "./components/common/Toast";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <CourtsProvider>
            <TournamentsProvider>
              <MatchesProvider>
                <CoachesProvider>
                  <PlayersProvider>
                    <ProfileProvider>
                      <DashboardProvider>
                        <App />
                        <Toast />
                      </DashboardProvider>
                    </ProfileProvider>
                  </PlayersProvider>
                </CoachesProvider>
              </MatchesProvider>
            </TournamentsProvider>
          </CourtsProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
