import { motion } from "framer-motion";
import { VoteValue } from "../../types";

interface PokerCardProps {
  value: VoteValue;
  selected?: boolean;
  revealed?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  flipped?: boolean;
}

export const PokerCard: React.FC<PokerCardProps> = ({
  value,
  selected = false,
  revealed = false,
  disabled = false,
  onClick,
  flipped = false,
}) => {
  return (
    <motion.div
      whileHover={!disabled ? { scale: 1.05, y: -5 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      className={`relative cursor-pointer ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
      onClick={!disabled ? onClick : undefined}
    >
      <div className={`card-flip ${flipped ? "flipped" : ""}`}>
        <div className="card-flip-inner w-16 h-20 sm:w-18 sm:h-24">
          {/* Front of card */}
          <div
            className={`card-front flex items-center justify-center text-xl font-bold transition-all duration-200 ${
              selected
                ? "bg-gradient-to-br from-primary-500 to-accent-500 text-white shadow-2xl ring-4 ring-primary-400/50"
                : "bg-white/10 backdrop-blur-sm border-2 border-white/20 text-white hover:bg-white/20"
            }`}
          >
            {value}
          </div>

          {/* Back of card (for reveal animation) */}
          {revealed && (
            <div className="card-back flex items-center justify-center text-xl font-bold bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-2xl">
              {value}
            </div>
          )}
        </div>
      </div>

      {/* Selected indicator */}
      {selected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
        >
          <svg
            className="w-4 h-4 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </motion.div>
      )}
    </motion.div>
  );
};
