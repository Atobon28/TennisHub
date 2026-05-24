import { useContext } from "react";
import { CoachesContext } from "./CoachesContext";

export const useCoaches = () => useContext(CoachesContext);