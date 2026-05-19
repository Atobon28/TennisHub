import { useContext } from "react";
import { MatchesContext } from "./MatchesContext";

export const useMatches = () => useContext(MatchesContext);