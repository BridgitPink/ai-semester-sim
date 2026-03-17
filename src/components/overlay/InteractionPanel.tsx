import { useGameStore } from "../../store/useGameStore";
import { getNpcInteractionView, performNpcInteraction } from "../../game/systems/npcSystem";

interface InteractionPanelProps {
  npcId: string;
}

export function InteractionPanel({ npcId }: InteractionPanelProps) {
  const { closePanel, npcRelationshipState } = useGameStore();

  const relationship = npcRelationshipState[npcId] ?? { affinity: 50, familiarity: 0 };
  const view = getNpcInteractionView(npcId);

  const handleChat = () => {
    performNpcInteraction(npcId);
    closePanel();
  };

  return (
    <>
      <div className="modal-header">
        <h1>{view?.name ?? npcId}</h1>
        <p>{view?.subtitle ?? "You're talking to someone"}</p>
      </div>

      <div className="modal-body">
        <div className="npc-interaction">
          <div className="npc-relationship">
            <p style={{ marginBottom: "8px" }}>
              <strong>Relationship:</strong> {relationship.affinity} affinity
            </p>
            <div className="relationship-bar">
              <div
                className="relationship-fill"
                style={{
                  width: `${Math.min(100, relationship.affinity)}%`,
                }}
              />
            </div>
            <p style={{ marginTop: "8px", color: "var(--color-text-secondary)", fontSize: "13px" }}>
              Familiarity: {relationship.familiarity}
            </p>
          </div>

          <div style={{ marginTop: "20px", marginBottom: "16px" }}>
            {view?.lines?.length ? (
              <div style={{ color: "var(--color-text-secondary)" }}>
                {view.lines.map((line) => (
                  <p key={line} style={{ marginBottom: "8px" }}>
                    {line}
                  </p>
                ))}
              </div>
            ) : (
              <p style={{ color: "var(--color-text-secondary)" }}>
                They seem interested in talking with you.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="modal-footer">
        <button className="btn" onClick={handleChat}>
          Chat
        </button>
        <button className="btn btn-secondary" onClick={closePanel}>
          Leave
        </button>
      </div>
    </>
  );
}
