import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, Share2 } from "lucide-react";

interface ShareRoomButtonProps {
  roomCode: string;
}

export const ShareRoomButton: React.FC<ShareRoomButtonProps> = ({
  roomCode,
}) => {
  const [copied, setCopied] = useState(false);

  const roomUrl = `${window.location.origin}?room=${roomCode}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(roomUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
        <span className="text-sm text-white/70">Room Code:</span>
        <span className="text-lg font-bold text-white tracking-wider">
          {roomCode}
        </span>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleCopy}
        className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg shadow-lg transition-colors"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4" />
            <span className="text-sm font-medium">Copied!</span>
          </>
        ) : (
          <>
            <Share2 className="w-4 h-4" />
            <span className="text-sm font-medium">Share Link</span>
          </>
        )}
      </motion.button>
    </div>
  );
};
