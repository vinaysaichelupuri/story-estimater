import { useEffect, useRef } from "react";

// Declare Vanta types for TypeScript
declare global {
  interface Window {
    VANTA: {
      NET: (options: {
        el: HTMLElement;
        mouseControls?: boolean;
        touchControls?: boolean;
        gyroControls?: boolean;
        minHeight?: number;
        minWidth?: number;
        scale?: number;
        scaleMobile?: number;
        color?: number;
        backgroundColor?: number;
        points?: number;
        maxDistance?: number;
        spacing?: number;
      }) => {
        destroy: () => void;
      };
    };
    THREE: any;
  }
}

export const VantaNetBackground = () => {
  const vantaRef = useRef<HTMLDivElement>(null);
  const vantaEffect = useRef<{ destroy: () => void } | null>(null);

  useEffect(() => {
    // Load scripts dynamically
    const loadScripts = async () => {
      if (!vantaEffect.current && vantaRef.current) {
        try {
          // Load Three.js if not already loaded
          if (!window.THREE) {
            await new Promise((resolve, reject) => {
              const script = document.createElement("script");
              script.src =
                "https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js";
              script.onload = resolve;
              script.onerror = reject;
              document.head.appendChild(script);
            });
          }

          // Load Vanta NET if not already loaded
          if (!window.VANTA) {
            await new Promise((resolve, reject) => {
              const script = document.createElement("script");
              script.src =
                "https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.net.min.js";
              script.onload = resolve;
              script.onerror = reject;
              document.head.appendChild(script);
            });
          }

          // Initialize Vanta NET effect
          vantaEffect.current = window.VANTA.NET({
            el: vantaRef.current,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.0,
            minWidth: 200.0,
            scale: 1.0,
            scaleMobile: 1.0,
            color: 0x3b82f6, // Blue NET lines and dots
            backgroundColor: 0x000000, // Absolute black background
            points: 10.0,
            maxDistance: 25.0,
            spacing: 18.0,
          });
        } catch (error) {
          console.error("Error loading Vanta:", error);
        }
      }
    };

    loadScripts();

    // Cleanup function
    return () => {
      if (vantaEffect.current) {
        vantaEffect.current.destroy();
        vantaEffect.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={vantaRef}
      className="fixed inset-0 w-full h-full -z-10"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
      }}
    />
  );
};
