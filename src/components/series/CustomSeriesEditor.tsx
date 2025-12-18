import { useState } from "react";
import { motion } from "framer-motion";
import { X, Plus, Trash2, GripVertical, ArrowLeft, Save } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useRoom } from "../../contexts/RoomContext";
import { validateCustomSeries } from "../../services/seriesService";
import { VoteValue } from "../../types";

interface SortableItemProps {
  id: string;
  value: VoteValue;
  onRemove: () => void;
  onChange: (value: string) => void;
}

const SortableItem: React.FC<SortableItemProps> = ({
  id,
  value,
  onRemove,
  onChange,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-2">
      <button
        {...attributes}
        {...listeners}
        className="p-2 hover:bg-white/10 rounded cursor-grab active:cursor-grabbing"
      >
        <GripVertical className="w-5 h-5 text-white/50" />
      </button>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
        placeholder="Enter value"
      />

      <button
        onClick={onRemove}
        className="p-2 hover:bg-red-500/20 text-red-400 rounded transition-colors"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  );
};

interface CustomSeriesEditorProps {
  onClose: () => void;
  onBack: () => void;
}

export const CustomSeriesEditor: React.FC<CustomSeriesEditorProps> = ({
  onClose,
  onBack,
}) => {
  const { updateSeries } = useRoom();
  const [values, setValues] = useState<VoteValue[]>(["1", "2", "3", "5", "8"]);
  const [error, setError] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setValues((items) => {
        const oldIndex = items.findIndex((_, i) => String(i) === active.id);
        const newIndex = items.findIndex((_, i) => String(i) === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleAdd = () => {
    setValues([...values, ""]);
    setError(null);
  };

  const handleRemove = (index: number) => {
    setValues(values.filter((_, i) => i !== index));
    setError(null);
  };

  const handleChange = (index: number, value: string) => {
    const newValues = [...values];
    newValues[index] = value;
    setValues(newValues);
    setError(null);
  };

  const handleSave = async () => {
    // Convert numeric strings to numbers
    const processedValues = values.map((v) => {
      const trimmed = String(v).trim();
      const num = Number(trimmed);
      return !isNaN(num) && trimmed !== "" ? num : trimmed;
    });

    // Validate
    const validation = validateCustomSeries(processedValues);
    if (!validation.valid) {
      setError(validation.error || "Invalid series");
      return;
    }

    try {
      await updateSeries(processedValues, "custom");
      onClose();
    } catch (err) {
      setError("Failed to save custom series");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white/70" />
          </button>
          <h3 className="text-xl font-semibold text-white">
            Create Custom Series
          </h3>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-white/70" />
        </button>
      </div>

      <div className="space-y-4 mb-6">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={values.map((_, i) => String(i))}
            strategy={verticalListSortingStrategy}
          >
            {values.map((value, index) => (
              <SortableItem
                key={index}
                id={String(index)}
                value={value}
                onRemove={() => handleRemove(index)}
                onChange={(newValue) => handleChange(index, newValue)}
              />
            ))}
          </SortableContext>
        </DndContext>

        <button
          onClick={handleAdd}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 border-2 border-dashed border-white/20 hover:border-white/30 rounded-lg transition-all text-white"
        >
          <Plus className="w-5 h-5" />
          Add Value
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      <div className="mb-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
        <p className="text-sm text-blue-400">
          💡 Tip: You can use numbers (1, 2, 3) or text (XS, S, M). Drag to
          reorder.
        </p>
      </div>

      <div className="flex gap-3">
        <button onClick={onBack} className="flex-1 btn-secondary">
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="flex-1 btn-primary flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" />
          Save Series
        </button>
      </div>
    </motion.div>
  );
};
