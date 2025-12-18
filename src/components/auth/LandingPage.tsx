import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Plus, LogIn, Sparkles } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useRoom } from "../../contexts/RoomContext";
import { Toast, ToastType } from "../common/Toast";

export const LandingPage = () => {
  const { signInAnonymously } = useAuth();
  const { createRoom, joinRoom } = useRoom();

  // Pre-fill display name from localStorage if available
  const savedName = localStorage.getItem("displayName") || "";
  const [displayName, setDisplayName] = useState(savedName);
  const [roomCode, setRoomCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);

  // Check URL for room code parameter
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const roomParam = urlParams.get("room");
    if (roomParam) {
      setRoomCode(roomParam.toUpperCase());
      // Clear the URL parameter after reading it
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  const handleCreateRoom = async () => {
    if (!displayName.trim()) {
      setToast({ message: "Please enter your name", type: "error" });
      return;
    }

    setLoading(true);
    try {
      await signInAnonymously(displayName);
      // Wait for auth to fully propagate (fixes first-click issue)
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await createRoom("fibonacci");
      setToast({ message: "Room created successfully!", type: "success" });
    } catch (error) {
      console.error("Create room error:", error);
      setToast({
        message: "Failed to create room. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = async () => {
    if (!displayName.trim()) {
      setToast({ message: "Please enter your name", type: "error" });
      return;
    }

    if (!roomCode.trim()) {
      setToast({ message: "Please enter a room code", type: "error" });
      return;
    }

    setLoading(true);
    try {
      // Sign in first
      await signInAnonymously(displayName);
      // Wait for auth to complete (fixes double-click issue)
      await new Promise((resolve) => setTimeout(resolve, 800));
      // Then join room
      await joinRoom(roomCode.toUpperCase());
      setToast({ message: "Joined room successfully!", type: "success" });
    } catch (error) {
      console.error("Join room error:", error);
      setToast({
        message: "Failed to join room. Check the code and try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Hero Section */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.6 }}
            className="inline-flex items-center justify-center w-28 h-28 mb-4 bg-white rounded-full shadow-xl shadow-primary-500/50"
          >
            <img
              src="/logo.png"
              alt="Planning Poker Logo"
              className="w-25 h-25 object-contain"
            />
          </motion.div>
          <h1 className="text-5xl font-bold mb-3 text-gradient">
            Planning Poker
          </h1>
          <p className="text-lg text-white/70">
            Estimate user stories with your team in real-time
          </p>
        </div>

        {/* Main Card */}
        <div className="glass-card p-8 space-y-6">
          {/* Name Input */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-white/90 mb-2"
            >
              Your Name
            </label>
            <input
              id="name"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Enter your name"
              className="input-field"
              disabled={loading}
              autoFocus={roomCode.length > 0}
            />
          </div>

          {/* Show create room button only if NOT joining from link */}
          {!roomCode && (
            <>
              {/* Create Room Button */}
              <button
                onClick={handleCreateRoom}
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Create New Room
              </button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white/10 backdrop-blur-sm text-white/70 rounded-full">
                    or
                  </span>
                </div>
              </div>
            </>
          )}

          {/* Show room info if joining from link */}
          {roomCode && (
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <p className="text-blue-300 text-sm text-center">
                🔗 Joining room:{" "}
                <span className="font-bold text-lg text-white">{roomCode}</span>
              </p>
            </div>
          )}

          {/* Room Code Input - only show if no room code from URL */}
          {!roomCode && (
            <div>
              <label
                htmlFor="roomCode"
                className="block text-sm font-medium text-white/90 mb-2"
              >
                Room Code
              </label>
              <input
                id="roomCode"
                type="text"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                placeholder="Enter 6-digit code"
                maxLength={6}
                className="input-field"
                disabled={loading}
              />
            </div>
          )}

          <button
            onClick={handleJoinRoom}
            disabled={loading}
            className="btn-secondary w-full flex items-center justify-center gap-2"
          >
            <LogIn className="w-5 h-5" />
            Join Existing Room
          </button>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-center space-y-3"
        >
          <div className="flex items-center justify-center gap-2 text-white/50 text-sm">
            <Users className="w-4 h-4" />
            <span>Collaborate with your agile team</span>
          </div>

          {/* Developer Credit */}
          <div className="text-white/70 text-sm">
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
        </motion.div>
      </motion.div>
    </div>
  );
};
