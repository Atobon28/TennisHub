import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import { CourtsProvider } from "./context/CourtsContext";
import { TournamentsProvider } from "./context/TournamentsContext";
import { MatchesProvider } from "./context/MatchesContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CourtsProvider>
          <TournamentsProvider>
            <MatchesProvider>
              <App />
            </MatchesProvider>
          </TournamentsProvider>
        </CourtsProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);