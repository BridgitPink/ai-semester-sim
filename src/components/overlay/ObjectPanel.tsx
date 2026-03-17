import { useGameStore } from "../../store/useGameStore";

export function ObjectPanel() {
  const { closePanel, interactedObject } = useGameStore();

  if (!interactedObject) {
    return null;
  }

  // Determine which type of content to show
  const isComingSoon =
    interactedObject.interactionType !== "start-lesson" &&
    interactedObject.interactionType !== "leave-classroom";

  return (
    <>
      <div className="modal-header">
        <h1>{interactedObject.label}</h1>
        {isComingSoon && <p>Coming Soon</p>}
      </div>

      <div className="modal-body">
        {isComingSoon ? (
          <p style={{ color: "var(--color-text-secondary)" }}>
            This feature is being developed. Check back soon!
          </p>
        ) : (
          <p>
            {interactedObject.metadata?.description ||
              "Interact with this object."}
          </p>
        )}
      </div>

      <div className="modal-footer">
        <button className="btn btn-secondary" onClick={closePanel}>
          Close
        </button>
      </div>
    </>
  );
}
