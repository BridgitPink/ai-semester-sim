import { useGameStore } from "../../store/useGameStore";
import { CoursePanel } from "./CoursePanel";
import { ProjectPanel } from "./ProjectPanel";
import { InteractionPanel } from "./InteractionPanel";
import { ObjectPanel } from "./ObjectPanel";
import { InventoryPanel } from "./InventoryPanel";

export function InteractionModal() {
  const { activePanel, currentLocation, selectedNpcId, closePanel } =
    useGameStore();

  if (activePanel === "none") return null;

  return (
    <>
      <div className="overlay-backdrop" onClick={closePanel} />
      <div className="modal">
        <div className="modal-content">
          {/* Intro / Tutorial Panel */}
          {activePanel === "intro" && (
            <>
              <div className="modal-header">
                <h1>Welcome</h1>
                <p>Quick start</p>
              </div>

              <div className="modal-body">
                <p style={{ marginBottom: "16px" }}>
                  You&apos;re starting in the dorm (your home base). Head out to explore campus,
                  meet NPCs, and progress your semester.
                </p>

                <div style={{ color: "var(--color-text-secondary)", fontSize: "13px" }}>
                  <p style={{ marginBottom: "8px" }}>
                    <strong>Move:</strong> Arrow Keys / WASD
                  </p>
                  <p style={{ marginBottom: "8px" }}>
                    <strong>Interact:</strong> E
                  </p>
                  <p style={{ marginBottom: "8px" }}>
                    <strong>Menu:</strong> M or Tab
                  </p>
                  <p style={{ marginBottom: 0 }}>
                    <strong>Inventory:</strong> I
                  </p>
                </div>
              </div>

              <div className="modal-footer">
                <button className="btn" onClick={closePanel}>
                  Let&apos;s go
                </button>
              </div>
            </>
          )}

          {/* Location Panel */}
          {activePanel === "location" && (
            <>
              <div className="modal-header">
                <h1>{currentLocation ? currentLocation.toUpperCase() : "Location"}</h1>
                <p>You have arrived</p>
              </div>

              <div className="modal-body">
                <p style={{ marginBottom: "16px" }}>
                  You've entered a new area. Explore to find NPCs and opportunities for
                  growth.
                </p>
                <p style={{ fontSize: "13px", color: "var(--color-text-secondary)" }}>
                  Press E to interact with nearby objects or NPCs. Browse the environment
                  or talk to someone.
                </p>
              </div>

              <div className="modal-footer">
                <button className="btn" onClick={closePanel}>
                  Got it
                </button>
              </div>
            </>
          )}

          {/* NPC Interaction Panel */}
          {activePanel === "npc" && selectedNpcId && (
            <InteractionPanel npcId={selectedNpcId} />
          )}

          {/* Course Panel */}
          {activePanel === "course" && <CoursePanel />}

          {/* Project Panel */}
          {activePanel === "project" && <ProjectPanel />}

          {/* Object Panel (for classroom objects and placeholders) */}
          {activePanel === "object" && <ObjectPanel />}

          {/* Inventory Panel */}
          {activePanel === "inventory" && <InventoryPanel />}
        </div>
      </div>
    </>
  );
}
