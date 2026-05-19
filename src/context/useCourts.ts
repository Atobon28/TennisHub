import { useContext } from "react";
import { CourtsContext } from "./CourtsContext";

export const useCourts = () => useContext(CourtsContext);