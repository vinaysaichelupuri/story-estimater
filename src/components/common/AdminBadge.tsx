import { Crown } from "lucide-react";

export const AdminBadge = () => {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold bg-gradient-to-r from-yellow-500 to-amber-500 text-white rounded-full shadow-lg">
      <Crown className="w-3 h-3" />
      Admin
    </span>
  );
};
