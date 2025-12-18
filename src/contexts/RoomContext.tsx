import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import {
  Room,
  RoomUser,
  RoomContextType,
  SeriesType,
  VoteValue,
  VoteStatistics,
} from "../types";
import { useAuth } from "./AuthContext";
import {
  createRoom as createRoomService,
  joinRoom as joinRoomService,
  updateVote as updateVoteService,
  revealVotes as revealVotesService,
  resetVotes as resetVotesService,
  updateEstimationSeries,
  subscribeToRoom,
  subscribeToRoomUsers,
  clearUserVote,
  roomExists,
} from "../services/roomService";
import { getSeriesByType } from "../services/seriesService";

const RoomContext = createContext<RoomContextType | undefined>(undefined);

export const useRoom = () => {
  const context = useContext(RoomContext);
  if (!context) {
    throw new Error("useRoom must be used within RoomProvider");
  }
  return context;
};

export const RoomProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const userRef = useRef(user);
  const [room, setRoom] = useState<Room | null>(null);
  const [users, setUsers] = useState<RoomUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Keep ref in sync with user state
  useEffect(() => {
    userRef.current = user;
  }, [user]);

  const currentUser = users.find((u) => u.userId === user?.uid) || null;

  // Restore room from localStorage on mount
  useEffect(() => {
    const savedRoomId = localStorage.getItem("currentRoomId");
    if (savedRoomId && user && !room) {
      console.log("Restoring room from localStorage:", savedRoomId);
      // Set a minimal room object to trigger subscriptions
      setRoom({
        roomId: savedRoomId,
        createdBy: "",
        activeSeries: [],
        seriesType: "fibonacci",
        isRevealed: false,
        createdAt: new Date() as any,
      });
    }
  }, [user, room]);

  // Subscribe to room and users when room is set
  useEffect(() => {
    if (!room?.roomId) return;

    const unsubscribeRoom = subscribeToRoom(room.roomId, (updatedRoom) => {
      if (updatedRoom) {
        setRoom(updatedRoom);
      } else {
        setError("Room not found");
        setRoom(null);
      }
    });

    const unsubscribeUsers = subscribeToRoomUsers(
      room.roomId,
      (updatedUsers) => {
        setUsers(updatedUsers);
      }
    );

    return () => {
      unsubscribeRoom();
      unsubscribeUsers();
    };
  }, [room?.roomId]);

  const createRoom = useCallback(
    async (seriesType: SeriesType): Promise<string> => {
      let attempts = 0;
      const maxAttempts = 20; // 2 seconds max

      while (!userRef.current && attempts < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        attempts++;
      }

      const currentUser = userRef.current;
      if (!currentUser) {
        throw new Error("User not authenticated");
      }

      setLoading(true);
      setError(null);

      try {
        const series = getSeriesByType(seriesType);

        const roomCode = await createRoomService(
          currentUser.uid,
          series,
          seriesType
        );
        console.log(
          "[ROOM_CONTEXT] Step 2 SUCCESS: Room created with code:",
          roomCode
        );

        console.log("[ROOM_CONTEXT] Step 3: Joining room as admin");
        await joinRoomService(
          roomCode,
          currentUser.uid,
          currentUser.displayName,
          true
        );
        console.log("[ROOM_CONTEXT] Step 3 SUCCESS: Joined room as admin");

        console.log("[ROOM_CONTEXT] Step 4: Setting room state");
        setRoom({
          roomId: roomCode,
          createdBy: currentUser.uid,
          activeSeries: series,
          seriesType,
          isRevealed: false,
          createdAt: new Date() as any,
        });

        console.log("[ROOM_CONTEXT] Step 5: Saving to localStorage");
        localStorage.setItem("currentRoomId", roomCode);

        console.log("[ROOM_CONTEXT] ========== CREATE ROOM SUCCESS ==========");
        return roomCode;
      } catch (error) {
        console.error(
          "[ROOM_CONTEXT] ========== CREATE ROOM FAILED =========="
        );
        console.error("[ROOM_CONTEXT] Error:", error);
        setError(
          error instanceof Error ? error.message : "Failed to create room"
        );
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  const joinRoom = useCallback(
    async (roomCode: string): Promise<void> => {
      // Wait for user to be available (same fix as createRoom)
      let attempts = 0;
      const maxAttempts = 20;

      while (!userRef.current && attempts < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        attempts++;
      }

      const currentUser = userRef.current;
      if (!currentUser) {
        throw new Error("User not authenticated");
      }

      setLoading(true);
      setError(null);

      try {
        const exists = await roomExists(roomCode);
        if (!exists) {
          throw new Error("Room not found");
        }

        await joinRoomService(
          roomCode,
          currentUser.uid,
          currentUser.displayName,
          false
        );

        // Save room ID to localStorage
        localStorage.setItem("currentRoomId", roomCode);

        // Set the room (this will trigger subscriptions)
        setRoom({
          roomId: roomCode,
          createdBy: "",
          activeSeries: [],
          seriesType: "fibonacci",
          isRevealed: false,
          createdAt: new Date() as any,
        });
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to join room";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [userRef]
  );

  const leaveRoom = useCallback(() => {
    // Clear room from localStorage
    localStorage.removeItem("currentRoomId");
    setRoom(null);
    setUsers([]);
    setError(null);
  }, []);

  const submitVote = useCallback(
    async (vote: VoteValue): Promise<void> => {
      if (!room || !user) throw new Error("Not in a room");

      try {
        await updateVoteService(room.roomId, user.uid, vote);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to submit vote";
        setError(message);
        throw err;
      }
    },
    [room, user]
  );

  const revealVotes = useCallback(async (): Promise<void> => {
    if (!room || !currentUser?.isAdmin) {
      throw new Error("Only admin can reveal votes");
    }

    try {
      await revealVotesService(room.roomId);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to reveal votes";
      setError(message);
      throw err;
    }
  }, [room, currentUser]);

  const resetVotes = useCallback(async (): Promise<void> => {
    if (!room || !currentUser?.isAdmin) {
      throw new Error("Only admin can reset votes");
    }

    try {
      // Reset reveal state
      await resetVotesService(room.roomId);

      // Clear all user votes
      const clearPromises = users.map((user) =>
        clearUserVote(room.roomId, user.userId)
      );
      await Promise.all(clearPromises);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to reset votes";
      setError(message);
      throw err;
    }
  }, [room, currentUser, users]);

  const updateSeries = useCallback(
    async (series: VoteValue[], seriesType: SeriesType): Promise<void> => {
      if (!room || !currentUser?.isAdmin) {
        throw new Error("Only admin can update series");
      }

      try {
        await updateEstimationSeries(room.roomId, series, seriesType);

        // Clear all user votes when series changes
        const clearPromises = users.map((user) =>
          clearUserVote(room.roomId, user.userId)
        );
        await Promise.all(clearPromises);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to update series";
        setError(message);
        throw err;
      }
    },
    [room, currentUser, users]
  );

  const getStatistics = useCallback((): VoteStatistics | null => {
    if (!room?.isRevealed) return null;

    const votedUsers = users.filter((u) => u.hasVoted && u.vote !== null);
    if (votedUsers.length === 0) return null;

    const votes = votedUsers.map((u) => ({
      userId: u.userId,
      name: u.name,
      vote: u.vote!,
    }));

    // Calculate statistics for numeric values
    const numericVotes = votes
      .map((v) => v.vote)
      .filter((v) => typeof v === "number") as number[];

    let average: number | null = null;
    let median: VoteValue | null = null;
    let mode: VoteValue | null = null;
    let outliers: string[] = [];

    if (numericVotes.length > 0) {
      // Average
      average =
        numericVotes.reduce((sum, v) => sum + v, 0) / numericVotes.length;

      // Median
      const sorted = [...numericVotes].sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      median =
        sorted.length % 2 === 0
          ? (sorted[mid - 1] + sorted[mid]) / 2
          : sorted[mid];

      // Mode (most common value)
      const frequency: Record<number, number> = {};
      numericVotes.forEach((v) => {
        frequency[v] = (frequency[v] || 0) + 1;
      });
      const maxFreq = Math.max(...Object.values(frequency));
      const modes = Object.keys(frequency).filter(
        (k) => frequency[Number(k)] === maxFreq
      );
      mode = modes.length === 1 ? Number(modes[0]) : null;

      // Outliers (values > 2 standard deviations from mean)
      if (numericVotes.length > 2) {
        const stdDev = Math.sqrt(
          numericVotes.reduce((sum, v) => sum + Math.pow(v - average!, 2), 0) /
            numericVotes.length
        );
        outliers = votes
          .filter(
            (v) =>
              typeof v.vote === "number" &&
              Math.abs((v.vote as number) - average!) > 2 * stdDev
          )
          .map((v) => v.userId);
      }
    } else {
      // For non-numeric values, just find the mode
      const frequency: Record<string, number> = {};
      votes.forEach((v) => {
        const key = String(v.vote);
        frequency[key] = (frequency[key] || 0) + 1;
      });
      const maxFreq = Math.max(...Object.values(frequency));
      const modes = Object.keys(frequency).filter(
        (k) => frequency[k] === maxFreq
      );
      mode = modes.length === 1 ? modes[0] : null;
    }

    return {
      average,
      median,
      mode,
      votes,
      outliers,
    };
  }, [room, users]);

  const value: RoomContextType = {
    room,
    users,
    currentUser,
    loading,
    error,
    createRoom,
    joinRoom,
    leaveRoom,
    submitVote,
    revealVotes,
    resetVotes,
    updateSeries,
    getStatistics,
  };

  return <RoomContext.Provider value={value}>{children}</RoomContext.Provider>;
};
