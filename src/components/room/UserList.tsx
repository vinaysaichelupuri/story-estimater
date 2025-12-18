import { motion } from "framer-motion";
import { Check, CheckCircle, Clock } from "lucide-react";
import { useRoom } from "../../contexts/RoomContext";
import { AdminBadge } from "../common/AdminBadge";

export const UserList = () => {
  const { users, currentUser, room } = useRoom();

  if (!room) return null;

  return (
    <div className="glass-card p-6">
      <h2 className="text-xl font-semibold mb-4 text-white/90">
        Team Members ({users.length})
      </h2>

      <div className="space-y-3">
        {users.map((user) => {
          const isCurrentUser = user.userId === currentUser?.userId;

          return (
            <motion.div
              key={user.userId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                isCurrentUser
                  ? "bg-primary-500/20 border-2 border-primary-500/50"
                  : "bg-white/5 border border-white/10"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    isCurrentUser
                      ? "bg-gradient-to-br from-primary-500 to-accent-500 text-white"
                      : "bg-white/10 text-white/70"
                  }`}
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white">
                      {user.name}
                      {isCurrentUser && (
                        <span className="text-primary-400 ml-1">(You)</span>
                      )}
                    </span>
                    {user.isAdmin && <AdminBadge />}
                  </div>

                  {/* Vote status */}
                  {room.isRevealed && user.hasVoted ? (
                    <div className="flex items-center gap-1 text-sm text-green-400 mt-1">
                      <CheckCircle className="w-4 h-4" />
                      <span>
                        Voted: <span className="font-bold">{user.vote}</span>
                      </span>
                    </div>
                  ) : user.hasVoted ? (
                    <div className="flex items-center gap-1 text-sm text-green-400 mt-1">
                      <Check className="w-4 h-4" />
                      <span>Voted</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-sm text-white/50 mt-1">
                      <Clock className="w-4 h-4" />
                      <span>Waiting...</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Vote indicator */}
              {!room.isRevealed && user.hasVoted && (
                <div className="w-12 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg">
                  <span className="text-white text-2xl">🃏</span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Voting progress */}
      <div className="mt-4 pt-4 border-t border-white/10">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-white/70">Voting Progress</span>
          <span className="text-white font-medium">
            {users.filter((u) => u.hasVoted).length} / {users.length}
          </span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{
              width: `${
                (users.filter((u) => u.hasVoted).length / users.length) * 100
              }%`,
            }}
            className="bg-gradient-to-r from-primary-500 to-accent-500 h-2 rounded-full"
          />
        </div>
      </div>
    </div>
  );
};
