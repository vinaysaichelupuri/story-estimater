import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, RotateCcw, LogOut, Settings } from "lucide-react";
import { useRoom } from "../../contexts/RoomContext";
import { useAuth } from "../../contexts/AuthContext";
import { UserList } from "./UserList";
import { ShareRoomButton } from "./ShareRoomButton";
import { VotingArea } from "../voting/VotingArea";
import { RevealPanel } from "../voting/RevealPanel";
import { SeriesSelector } from "../series/SeriesSelector";
import { Toast, ToastType } from "../common/Toast";

export const RoomDashboard = () => {
  const { room, currentUser, users, revealVotes, resetVotes, leaveRoom } =
    useRoom();
  const { signOut } = useAuth();
  const [showSeriesSelector, setShowSeriesSelector] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);

  if (!room) return null;

  const handleReveal = async () => {
    try {
      await revealVotes();
      setToast({ message: "Votes revealed!", type: "success" });
    } catch (error) {
      setToast({ message: "Failed to reveal votes", type: "error" });
    }
  };

  const handleReset = async () => {
    try {
      await resetVotes();
      setToast({
        message: "Votes reset. Ready for next round!",
        type: "success",
      });
    } catch (error) {
      setToast({ message: "Failed to reset votes", type: "error" });
    }
  };

  const handleLeave = async () => {
    leaveRoom();
    await signOut();
  };

  // Show reveal button if at least one person has voted (not necessarily everyone)
  const anyVoted = users.some((u) => u.hasVoted);
  const allVoted = users.length > 0 && users.every((u) => u.hasVoted);

  return (
    <div className="min-h-screen p-3 md:p-4 pb-16">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-14 h-14 bg-white rounded-full shadow-lg shadow-primary-500/30">
                <img
                  src="/logo.png"
                  alt="Planning Poker Logo"
                  className="w-15 h-15 object-contain"
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gradient mb-1">
                  Planning Poker
                </h1>
                <p className="text-white/70">
                  Estimate with your team in real-time
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <ShareRoomButton roomCode={room.roomId} />
              <button
                onClick={handleLeave}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">Leave</span>
              </button>
            </div>
          </div>

          {/* Admin Controls */}
          {currentUser?.isAdmin && (
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setShowSeriesSelector(!showSeriesSelector)}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white rounded-lg transition-all"
              >
                <Settings className="w-4 h-4" />
                <span className="text-sm font-medium">Change Series</span>
              </button>

              {!room.isRevealed && anyVoted && (
                <motion.button
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  onClick={handleReveal}
                  className={`flex items-center gap-2 px-6 py-2 rounded-lg shadow-lg transition-all font-semibold ${
                    allVoted
                      ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                      : "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
                  }`}
                >
                  <Eye className="w-4 h-4" />
                  {allVoted
                    ? "Reveal Votes"
                    : `Reveal (${users.filter((u) => u.hasVoted).length}/${
                        users.length
                      } voted)`}
                </motion.button>
              )}

              {room.isRevealed && (
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg shadow-lg transition-all font-semibold"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset & New Round
                </button>
              )}
            </div>
          )}

          {/* Series Selector */}
          {showSeriesSelector && currentUser?.isAdmin && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4"
            >
              <SeriesSelector onClose={() => setShowSeriesSelector(false)} />
            </motion.div>
          )}
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Column - User List */}
          <div className="lg:col-span-1">
            <UserList />
          </div>

          {/* Right Column - Voting Area & Results */}
          <div className="lg:col-span-2 space-y-4">
            <VotingArea />
            <RevealPanel />
          </div>
        </div>
      </div>

      {/* Footer - Fixed at bottom */}
      <div className="fixed bottom-4 left-0 right-0 text-center z-10 pointer-events-none">
        <div className="text-white/70 text-sm pointer-events-auto">
          Designed & Developed by{" "}
          <a
            href="https://www.linkedin.com/in/vinay-sai-chelupuri-085642277/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gradient font-bold hover:opacity-80 transition-opacity cursor-pointer"
          >
            Vinay Sai Chelupuri
          </a>
        </div>
      </div>
    </div>
  );
};
