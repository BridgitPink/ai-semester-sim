import { useEffect, useRef, useState } from "react";
import Phaser from "phaser";
import { Hud } from "./components/overlay/Hud";
import { Sidebar } from "./components/Sidebar";
import { GameScene } from "./game/phaser/GameScene";
import { ClassroomScene } from "./game/phaser/ClassroomScene";
import { LibraryScene } from "./game/phaser/LibraryScene";
import { DormScene } from "./game/phaser/DormScene";
import { initializeGame } from "./game/bootstrap";

/**
 * Main application component - mounts Phaser game with sidebar layout
 * Initializes game state on component mount
 * 
 * Layout:
 * - Left sidebar (300px fixed, persistent UI with tabs)
 * - Right game area (fullscreen Phaser canvas)
 * - Menu overlay accessible via M or Tab key
 * - Interaction modals for locations/NPCs (centered over full viewport)
 */
export default function App() {
  const gameRef = useRef<Phaser.Game | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerSize, setContainerSize] = useState({ width: 960, height: 540 });

  // Calculate responsive game size (right column only)
  useEffect(() => {
    const updateContainerSize = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      // Game area width and full height
      const width = Math.floor(rect.width);
      const height = Math.floor(rect.height);

      setContainerSize({ width, height });

      // Resize Phaser game if it exists
      if (gameRef.current) {
        gameRef.current.scale.resize(width, height);
      }
    };

    // Initial size calculation
    const observer = new ResizeObserver(updateContainerSize);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    // Initial call
    updateContainerSize();

    // Handle window resize as fallback
    window.addEventListener("resize", updateContainerSize);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateContainerSize);
    };
  }, []);

  // Initialize Phaser game
  useEffect(() => {
    if (!containerRef.current || gameRef.current) return;

    // Initialize game state and data
    initializeGame();

    // Create Phaser game instance with responsive scale
    gameRef.current = new Phaser.Game({
      type: Phaser.AUTO,
      width: containerSize.width,
      height: containerSize.height,
      parent: containerRef.current,
      backgroundColor: "#1e1e2e",
      physics: {
        default: "arcade",
        arcade: {
          debug: false,
        },
      },
      input: {
        keyboard: true,
      },
      scene: [GameScene, ClassroomScene, LibraryScene, DormScene],
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
    });

    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, [containerSize]);

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="game-area" ref={containerRef} />
      <Hud />
    </div>
  );
}
