import { useAuth } from "./contexts/AuthContext";
import { useRoom } from "./contexts/RoomContext";
import { LandingPage } from "./components/auth/LandingPage";
import { RoomDashboard } from "./components/room/RoomDashboard";
import { LoadingSpinner } from "./components/common/LoadingSpinner";

function App() {
  const { user, loading: authLoading } = useAuth();
  const { room, loading: roomLoading } = useRoom();

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    );
  }

  // Not authenticated - show landing page
  if (!user) {
    return <LandingPage />;
  }

  // Authenticated but no room - show landing page
  if (!room) {
    return <LandingPage />;
  }

  // In a room - show dashboard
  return <RoomDashboard />;
}

export default App;
