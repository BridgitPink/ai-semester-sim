import { useGameStore } from "../../store/useGameStore";

export function InteractionModal() {
  const { activePanel, currentLocation, selectedNpcName, closePanel } =
    useGameStore();

  if (activePanel === "none") return null;

  return (
    <>
      <div className="overlay-backdrop" onClick={closePanel} />
      <div className="modal">
        <div className="modal-content">
          {activePanel === "location" && (
            <>
              <div className="modal-header">
                <h1>{currentLocation || "Location"}</h1>
                <p>You have entered a new area</p>
              </div>

              <div className="modal-body">
                <p style={{ color: "var(--color-text-secondary)" }}>
                  Explore this location to find NPCs and opportunities.
                </p>
                <p style={{ color: "var(--color-text-secondary)", fontSize: "13px" }}>
                  Press E to interact with nearby objects or NPCs.
                </p>
              </div>

              <div className="modal-footer">
                <button className="btn" onClick={closePanel}>
                  Got it
                </button>
              </div>
            </>
          )}

          {activePanel === "npc" && (
            <>
              <div className="modal-header">
                <h1>{selectedNpcName || "NPC"}</h1>
                <p>You're talking to someone</p>
              </div>

              <div className="modal-body">
                <p style={{ color: "var(--color-text-secondary)" }}>
                  This NPC might have something interesting to say or teach you.
                </p>
                <p style={{ color: "var(--color-text-secondary)", fontSize: "13px" }}>
                  Continue exploring to build relationships and unlock opportunities.
                </p>
              </div>

              <div className="modal-footer">
                <button className="btn" onClick={closePanel}>
                  Close
                </button>
              </div>
            </>
          )}

          {activePanel === "course" && (
            <>
              <div className="modal-header">
                <h1>Course</h1>
                <p>Start learning today</p>
              </div>

              <div className="modal-body">
                <p style={{ color: "var(--color-text-secondary)" }}>
                  Complete lessons to progress through the course and earn new skills.
                </p>
              </div>

              <div className="modal-footer">
                <button className="btn" onClick={closePanel}>
                  Close
                </button>
              </div>
            </>
          )}

          {activePanel === "project" && (
            <>
              <div className="modal-header">
                <h1>Project</h1>
                <p>Build something great</p>
              </div>

              <div className="modal-body">
                <p style={{ color: "var(--color-text-secondary)" }}>
                  Work on your project to apply what you've learned and unlock new features.
                </p>
              </div>

              <div className="modal-footer">
                <button className="btn" onClick={closePanel}>
                  Close
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
