import { useContext } from "react";
import { TournamentsContext } from "./TournamentsContext";

export const useTournaments = () => useContext(TournamentsContext);