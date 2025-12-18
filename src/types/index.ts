import { Timestamp } from "firebase/firestore";

// Estimation Series Types
export type SeriesType =
  | "fibonacci"
  | "modified-fibonacci"
  | "tshirt"
  | "powers-of-2"
  | "custom";
export type VoteValue = string | number;

// Predefined Series
export interface PredefinedSeries {
  type: SeriesType;
  name: string;
  values: VoteValue[];
}

// Room Types
export interface Room {
  roomId: string;
  createdBy: string;
  activeSeries: VoteValue[];
  seriesType: SeriesType;
  isRevealed: boolean;
  createdAt: Timestamp;
}

// User in Room
export interface RoomUser {
  userId: string;
  name: string;
  vote: VoteValue | null;
  hasVoted: boolean;
  isAdmin: boolean;
}

// Vote Statistics
export interface VoteStatistics {
  average: number | null;
  median: VoteValue | null;
  mode: VoteValue | null;
  votes: Array<{ userId: string; name: string; vote: VoteValue }>;
  outliers: string[]; // userIds of outliers
}

// Auth Context Types
export interface AuthContextType {
  user: { uid: string; displayName: string } | null;
  loading: boolean;
  signInAnonymously: (displayName: string) => Promise<void>;
  signOut: () => Promise<void>;
}

// Room Context Types
export interface RoomContextType {
  room: Room | null;
  users: RoomUser[];
  currentUser: RoomUser | null;
  loading: boolean;
  error: string | null;
  createRoom: (seriesType: SeriesType) => Promise<string>;
  joinRoom: (roomCode: string) => Promise<void>;
  leaveRoom: () => void;
  submitVote: (vote: VoteValue) => Promise<void>;
  revealVotes: () => Promise<void>;
  resetVotes: () => Promise<void>;
  updateSeries: (series: VoteValue[], seriesType: SeriesType) => Promise<void>;
  getStatistics: () => VoteStatistics | null;
}

// Firebase Document Types
export interface RoomDocument {
  createdBy: string;
  activeSeries: VoteValue[];
  seriesType: SeriesType;
  isRevealed: boolean;
  createdAt: Timestamp;
}

export interface RoomUserDocument {
  name: string;
  vote: VoteValue | null;
  hasVoted: boolean;
  isAdmin: boolean;
}
