import { useContext } from "react";
import { PlayersContext } from "./PlayersContext";

export const usePlayers = () => useContext(PlayersContext);