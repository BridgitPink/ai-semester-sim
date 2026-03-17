import { useGameStore } from "../../store/useGameStore";

interface InteractionPanelProps {
  npcName: string;
}

export function InteractionPanel({ npcName }: InteractionPanelProps) {
  const { closePanel, npcRelationships, updateNpcRelationship } = useGameStore();

  const relationshipPoints = npcRelationships[npcName] || 0;

  const handleChat = () => {
    // Stub: In future, this would trigger dialogue or learning interactions
    updateNpcRelationship(npcName, 5); // Small relationship boost for interaction
    closePanel();
  };

  return (
    <>
      <div className="modal-header">
        <h1>{npcName}</h1>
        <p>You're talking to someone</p>
      </div>

      <div className="modal-body">
        <div className="npc-interaction">
          <div className="npc-relationship">
            <p style={{ marginBottom: "8px" }}>
              <strong>Relationship:</strong> {relationshipPoints} points
            </p>
            <div className="relationship-bar">
              <div
                className="relationship-fill"
                style={{
                  width: `${Math.min(100, (relationshipPoints / 100) * 100)}%`,
                }}
              />
            </div>
          </div>

          <div style={{ marginTop: "20px", marginBottom: "16px" }}>
            <p style={{ color: "var(--color-text-secondary)" }}>
              This person seems interested in talking with you. You could chat and learn
              more about them, or ask for their perspective on your studies.
            </p>
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
