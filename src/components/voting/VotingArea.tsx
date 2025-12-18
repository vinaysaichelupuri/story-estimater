import { motion } from "framer-motion";
import { useRoom } from "../../contexts/RoomContext";
import { PokerCard } from "./PokerCard";
import { VoteValue } from "../../types";

export const VotingArea = () => {
  const { room, currentUser, submitVote } = useRoom();

  if (!room) return null;

  const handleVote = async (value: VoteValue) => {
    if (room.isRevealed) return;
    try {
      await submitVote(value);
    } catch (error) {
      console.error("Failed to submit vote:", error);
    }
  };

  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-4"
      >
        <h2 className="text-xl font-semibold mb-4 text-white/90">
          {room.isRevealed ? "Votes Revealed" : "Select Your Estimate"}
        </h2>

        <div className="flex flex-wrap gap-4 justify-center">
          {room.activeSeries.map((value) => (
            <PokerCard
              key={String(value)}
              value={value}
              selected={currentUser?.vote === value}
              disabled={room.isRevealed}
              onClick={() => handleVote(value)}
            />
          ))}
        </div>

        {/* Current vote indicator */}
        {currentUser?.hasVoted && !room.isRevealed && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6 text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-lg">
              <svg
                className="w-5 h-5 text-green-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-green-400 font-medium">
                You voted: <span className="font-bold">{currentUser.vote}</span>
              </span>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
