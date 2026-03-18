import { useEffect } from "react";
import { useGameStore } from "../../store/useGameStore";
import { MenuOverlay } from "./MenuOverlay";
import { InteractionModal } from "./InteractionModal";
import { LessonModal } from "./LessonModal";
import { isTypingInEditableElement } from "../../game/systems/uiInputCapture";

/**
 * HUD Component - Manages overlay modals and keyboard input
 * 
 * Renders:
 * - Menu overlay (M/Tab key)
 * - Interaction modals (contextual panels)
 * - Lesson modal (lesson content display)
 */
export function Hud() {
  const { toggleMenu, openInventoryPanel, closePanel, activePanel, menuOpen } = useGameStore();

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // If the user is typing in an editable element, do not trigger gameplay/UI hotkeys.
      if (isTypingInEditableElement(e.target)) {
        return;
      }

      // Toggle menu with M or Tab
      if (e.key === "m" || e.key === "M" || e.key === "Tab") {
        e.preventDefault();
        toggleMenu();
        return;
      }

      // Toggle inventory with I
      if (e.key === "i" || e.key === "I") {
        e.preventDefault();

        if (menuOpen) {
          toggleMenu();
        }

        if (activePanel === "inventory") {
          closePanel();
        } else {
          openInventoryPanel();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activePanel, closePanel, menuOpen, openInventoryPanel, toggleMenu]);

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