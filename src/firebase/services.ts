import { db, auth } from "./firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

// ── USERS ──────────────────────────────────────────
export const getUsers = async () => {
  const snapshot = await getDocs(collection(db, "users"));
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const addUser = async (user: object) => {
  return await addDoc(collection(db, "users"), user);
};

export const updateUser = async (id: string, data: object) => {
  return await updateDoc(doc(db, "users", id), data);
};

export const deleteUser = async (id: string) => {
  return await deleteDoc(doc(db, "users", id));
};

// ── COURTS ─────────────────────────────────────────
export const getCourts = async () => {
  const snapshot = await getDocs(collection(db, "courts"));
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const getAdminCourts = async (adminId: string) => {
  const q = query(collection(db, "courts"), where("adminId", "==", adminId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const addCourt = async (adminId: string, court: object) => {
  return await addDoc(collection(db, "courts"), { adminId, ...court });
};

export const updateCourt = async (id: string, data: object) => {
  return await updateDoc(doc(db, "courts", id), data);
};

export const deleteCourt = async (id: string) => {
  return await deleteDoc(doc(db, "courts", id));
};

// ── TOURNAMENTS ────────────────────────────────────
export const getTournaments = async () => {
  const snapshot = await getDocs(collection(db, "tournaments"));
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const getAdminTournaments = async (adminId: string) => {
  const q = query(
    collection(db, "tournaments"),
    where("adminId", "==", adminId),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const addTournament = async (adminId: string, tournament: object) => {
  return await addDoc(collection(db, "tournaments"), {
    adminId,
    ...tournament,
  });
};

export const updateTournament = async (id: string, data: object) => {
  return await updateDoc(doc(db, "tournaments", id), data);
};

export const deleteTournament = async (id: string) => {
  return await deleteDoc(doc(db, "tournaments", id));
};

// ── MATCHES ────────────────────────────────────────
export const getMatches = async () => {
  const snapshot = await getDocs(collection(db, "matches"));
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const addMatch = async (match: object) => {
  return await addDoc(collection(db, "matches"), match);
};

export const updateMatch = async (id: string, data: object) => {
  return await updateDoc(doc(db, "matches", id), data);
};

export const deleteMatch = async (id: string) => {
  return await deleteDoc(doc(db, "matches", id));
};

// ── PLAYER TOURNAMENTS ─────────────────────────────
export const getPlayerTournaments = async (playerId: string) => {
  const q = query(
    collection(db, "playerTournaments"),
    where("playerId", "==", playerId),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const joinTournament = async (playerId: string, tournament: object) => {
  return await addDoc(collection(db, "playerTournaments"), {
    playerId,
    ...tournament,
  });
};

// ── AUTH ───────────────────────────────────────────
export const registerUser = async (email: string, password: string) => {
  return await createUserWithEmailAndPassword(auth, email, password);
};

export const loginUser = async (email: string, password: string) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

export const logoutUser = async () => {
  return await signOut(auth);
};

export const getUserByUid = async (uid: string) => {
  const q = query(collection(db, "users"), where("uid", "==", uid));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
};
// ── COACHES & PLAYERS ──────────────────────────────
export const getCoaches = async () => {
  const q = query(collection(db, "users"), where("role", "==", "coach"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const getPlayers = async () => {
  const q = query(collection(db, "users"), where("role", "==", "player"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
};
