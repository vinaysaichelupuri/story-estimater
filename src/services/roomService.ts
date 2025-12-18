import {
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  onSnapshot,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "../config/firebase";
import {
  Room,
  RoomUser,
  RoomDocument,
  RoomUserDocument,
  SeriesType,
  VoteValue,
} from "../types";

const ROOMS_COLLECTION = "rooms";
const ROOM_USERS_COLLECTION = "roomUsers";

// Generate a random 6-character room code
export const generateRoomCode = (): string => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
};

// Create a new room
export const createRoom = async (
  userId: string,
  activeSeries: VoteValue[],
  seriesType: SeriesType
): Promise<string> => {
  const roomCode = generateRoomCode();
  const roomRef = doc(db, ROOMS_COLLECTION, roomCode);

  const roomData: RoomDocument = {
    createdBy: userId,
    activeSeries,
    seriesType,
    isRevealed: false,
    createdAt: serverTimestamp() as Timestamp,
  };

  await setDoc(roomRef, roomData);
  return roomCode;
};

// Join a room
export const joinRoom = async (
  roomId: string,
  userId: string,
  name: string,
  isAdmin: boolean
): Promise<void> => {
  const userRef = doc(db, ROOM_USERS_COLLECTION, roomId, "users", userId);

  const userData: RoomUserDocument = {
    name,
    vote: null,
    hasVoted: false,
    isAdmin,
  };

  await setDoc(userRef, userData);
};

// Check if room exists
export const roomExists = async (roomId: string): Promise<boolean> => {
  const roomRef = doc(db, ROOMS_COLLECTION, roomId);
  const roomSnap = await getDoc(roomRef);
  return roomSnap.exists();
};

// Update user's vote
export const updateVote = async (
  roomId: string,
  userId: string,
  vote: VoteValue
): Promise<void> => {
  const userRef = doc(db, ROOM_USERS_COLLECTION, roomId, "users", userId);
  await updateDoc(userRef, {
    vote,
    hasVoted: true,
  });
};

// Reveal votes
export const revealVotes = async (roomId: string): Promise<void> => {
  const roomRef = doc(db, ROOMS_COLLECTION, roomId);
  await updateDoc(roomRef, {
    isRevealed: true,
  });
};

// Reset votes
export const resetVotes = async (roomId: string): Promise<void> => {
  const roomRef = doc(db, ROOMS_COLLECTION, roomId);
  await updateDoc(roomRef, {
    isRevealed: false,
  });

  // Note: We'll reset individual user votes through the context
  // to avoid complex batch operations here
};

// Update estimation series
export const updateEstimationSeries = async (
  roomId: string,
  series: VoteValue[],
  seriesType: SeriesType
): Promise<void> => {
  const roomRef = doc(db, ROOMS_COLLECTION, roomId);
  await updateDoc(roomRef, {
    activeSeries: series,
    seriesType,
    isRevealed: false, // Reset reveal state when series changes
  });
};

// Subscribe to room updates
export const subscribeToRoom = (
  roomId: string,
  callback: (room: Room | null) => void
): (() => void) => {
  const roomRef = doc(db, ROOMS_COLLECTION, roomId);

  return onSnapshot(roomRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.data() as RoomDocument;
      callback({
        roomId,
        ...data,
      } as Room);
    } else {
      callback(null);
    }
  });
};

// Subscribe to room users
export const subscribeToRoomUsers = (
  roomId: string,
  callback: (users: RoomUser[]) => void
): (() => void) => {
  const usersRef = collection(db, ROOM_USERS_COLLECTION, roomId, "users");

  return onSnapshot(usersRef, (snapshot) => {
    const users: RoomUser[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data() as RoomUserDocument;
      users.push({
        userId: doc.id,
        ...data,
      });
    });
    callback(users);
  });
};

// Clear user vote
export const clearUserVote = async (
  roomId: string,
  userId: string
): Promise<void> => {
  const userRef = doc(db, ROOM_USERS_COLLECTION, roomId, "users", userId);
  await updateDoc(userRef, {
    vote: null,
    hasVoted: false,
  });
};
