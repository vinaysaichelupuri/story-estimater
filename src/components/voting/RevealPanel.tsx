import { motion } from "framer-motion";
import { TrendingUp, Target, Award } from "lucide-react";
import { useRoom } from "../../contexts/RoomContext";

export const RevealPanel = () => {
  const { room, users, getStatistics } = useRoom();

  if (!room?.isRevealed) return null;

  const stats = getStatistics();
  if (!stats) return null;

  const { average, median, mode, votes, outliers } = stats;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      <div className="glass-card p-4">
        <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
          <Award className="w-6 h-6 text-yellow-400" />
          Results
        </h2>

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          {average !== null && (
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-2 border border-white/10">
              <div className="flex items-center gap-1 mb-1">
                <TrendingUp className="w-4 h-4 text-blue-400" />
                <span className="text-xs text-white/70">Average</span>
              </div>
              <p className="text-xl font-bold text-white">
                {average.toFixed(1)}
              </p>
            </div>
          )}

          {median !== null && (
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-2 border border-white/10">
              <div className="flex items-center gap-1 mb-1">
                <Target className="w-4 h-4 text-green-400" />
                <span className="text-xs text-white/70">Median</span>
              </div>
              <p className="text-xl font-bold text-white">{median}</p>
            </div>
          )}

          {mode !== null && (
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-2 border border-white/10">
              <div className="flex items-center gap-1 mb-1">
                <Award className="w-4 h-4 text-purple-400" />
                <span className="text-xs text-white/70">Most Common</span>
              </div>
              <p className="text-xl font-bold text-white">{mode}</p>
            </div>
          )}
        </div>

        {/* Individual Votes */}
        <div className="mb-4">
          <h3 className="text-sm font-semibold mb-2 text-white/90">
            Individual Votes
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {votes.map((vote) => {
              const isOutlier = outliers.includes(vote.userId);

              return (
                <motion.div
                  key={vote.userId}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`p-2 rounded-lg border-2 ${
                    isOutlier
                      ? "bg-orange-500/10 border-orange-500/50"
                      : "bg-white/5 border-white/10"
                  }`}
                >
                  <p className="text-xs text-white/70 mb-0.5 truncate">
                    {vote.name}
                  </p>
                  <p className="text-xl font-bold text-white">{vote.vote}</p>
                  {isOutlier && (
                    <p className="text-xs text-orange-400 mt-0.5">Outlier</p>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Consensus indicator */}
        {votes.length > 0 && (
          <div className="mt-3">
            {votes.every((v) => v.vote === votes[0].vote) ? (
              <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-3 text-center">
                <p className="text-green-400 font-semibold text-sm">
                  🎉 Perfect Consensus! Everyone voted {votes[0].vote}
                </p>
              </div>
            ) : (
              <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-3 text-center">
                <p className="text-blue-400 font-medium text-sm">
                  Discussion recommended - votes vary from{" "}
                  {Math.min(
                    ...votes
                      .map((v) => (typeof v.vote === "number" ? v.vote : 0))
                      .filter((v) => v > 0)
                  )}{" "}
                  to{" "}
                  {Math.max(
                    ...votes.map((v) =>
                      typeof v.vote === "number" ? v.vote : 0
                    )
                  )}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};
