import { useEffect, useRef } from "react";
import Phaser from "phaser";
import { Hud } from "../components/overlay/Hud";
import { GameScene } from "../game/phaser/GameScene";
import { InteriorScene } from "../game/phaser/InteriorScene";

export default function App() {
  const gameRef = useRef<Phaser.Game | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current || gameRef.current) return;

    gameRef.current = new Phaser.Game({
      type: Phaser.AUTO,
      width: 960,
      height: 540,
      parent: containerRef.current,
      backgroundColor: "#1e1e2e",
      physics: {
        default: "arcade",
        arcade: {
          debug: false,
        },
      },
      scene: [GameScene, InteriorScene],
    });

    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, []);

  return (
    <div className="app-shell">
      <div className="game-container" ref={containerRef} />
      <Hud />
    </div>
  );
}