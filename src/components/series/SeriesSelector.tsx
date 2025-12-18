import { useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useRoom } from "../../contexts/RoomContext";
import { PREDEFINED_SERIES } from "../../services/seriesService";
import { SeriesType } from "../../types";
import { CustomSeriesEditor } from "./CustomSeriesEditor";

interface SeriesSelectorProps {
  onClose: () => void;
}

export const SeriesSelector: React.FC<SeriesSelectorProps> = ({ onClose }) => {
  const { room, updateSeries } = useRoom();
  const [selectedType, setSelectedType] = useState<SeriesType | "custom">(
    room?.seriesType || "fibonacci"
  );
  const [showCustomEditor, setShowCustomEditor] = useState(false);

  const handleSelectPredefined = async (type: SeriesType) => {
    const series = PREDEFINED_SERIES.find((s) => s.type === type);
    if (!series) return;

    try {
      await updateSeries(series.values, type);
      onClose();
    } catch (error) {
      console.error("Failed to update series:", error);
    }
  };

  if (showCustomEditor) {
    return (
      <CustomSeriesEditor
        onClose={onClose}
        onBack={() => setShowCustomEditor(false)}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white">
          Select Estimation Series
        </h3>
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-white/70" />
        </button>
      </div>

      <div className="space-y-3">
        {PREDEFINED_SERIES.map((series) => (
          <button
            key={series.type}
            onClick={() => handleSelectPredefined(series.type)}
            className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
              room?.seriesType === series.type
                ? "bg-primary-500/20 border-primary-500"
                : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-white">{series.name}</span>
              {room?.seriesType === series.type && (
                <span className="text-xs px-2 py-1 bg-primary-500 text-white rounded-full">
                  Active
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {series.values.map((value) => (
                <span
                  key={String(value)}
                  className="px-3 py-1 bg-white/10 rounded text-sm text-white/90"
                >
                  {value}
                </span>
              ))}
            </div>
          </button>
        ))}

        {/* Custom Series Option */}
        <button
          onClick={() => setShowCustomEditor(true)}
          className="w-full text-left p-4 rounded-lg border-2 border-dashed border-white/20 hover:bg-white/5 hover:border-white/30 transition-all"
        >
          <span className="font-semibold text-white">
            ➕ Create Custom Series
          </span>
          <p className="text-sm text-white/70 mt-1">
            Define your own estimation values
          </p>
        </button>
      </div>

      <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
        <p className="text-sm text-yellow-400">
          ⚠️ Changing the series will reset all current votes
        </p>
      </div>
    </motion.div>
  );
};
