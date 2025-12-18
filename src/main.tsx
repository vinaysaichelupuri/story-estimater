import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import { RoomProvider } from "./contexts/RoomContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <RoomProvider>
        <App />
      </RoomProvider>
    </AuthProvider>
  </StrictMode>
);
