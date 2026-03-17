import { useEffect } from "react";
import { useGameStore } from "../../store/useGameStore";
import { MenuOverlay } from "./MenuOverlay";
import { InteractionModal } from "./InteractionModal";
import { LessonModal } from "./LessonModal";

/**
 * HUD Component - Manages overlay modals and keyboard input
 * 
 * Renders:
 * - Menu overlay (M/Tab key)
 * - Interaction modals (contextual panels)
 * - Lesson modal (lesson content display)
 */
export function Hud() {
  const { toggleMenu } = useGameStore();

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle menu with M or Tab
      if (e.key === "m" || e.key === "M" || e.key === "Tab") {
        e.preventDefault();
        toggleMenu();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleMenu]);

  return (
    <>
      {/* Menu Overlay */}
      <MenuOverlay />

      {/* Interaction Modal */}
      <InteractionModal />

      {/* Lesson Modal */}
      <LessonModal />
    </>
  );
}