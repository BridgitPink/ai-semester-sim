import { useGameStore } from "../../store/useGameStore";

/**
 * Sleep Confirmation Panel - Displays sleep confirmation window content
 * Only renders when sleep confirmation is active
 * Modal structure (backdrop, container) is provided by InteractionModal
 */
export function ObjectPanel() {
  const {
    sleepConfirmationOpen,
    stats,
    cancelSleepConfirmation,
    confirmSleep,
  } = useGameStore();

  // Only render if sleep confirmation is open
  if (!sleepConfirmationOpen) return null;

  const energyRecovery = 60; // Partial recovery: +60 energy

  const handleConfirmSleep = () => {
    confirmSleep(energyRecovery);
  };

  return (
    <>
      <div className="modal-header">
        <h1>Rest</h1>
        <p>Get some sleep</p>
      </div>

      <div className="modal-body">
        <p style={{ marginBottom: "16px" }}>
          You head to bed to get some rest. Tomorrow is a new day.
        </p>
        
        <div className="sleep-info">
          <div className="sleep-stat">
            <span className="label">Current Energy:</span>
            <span className="value">{stats.energy}</span>
          </div>
          <div className="sleep-stat">
            <span className="label">After Sleep:</span>
            <span className="value recovery">+{energyRecovery}</span>
          </div>
        </div>

        <p style={{ fontSize: "13px", color: "var(--color-text-secondary)", marginTop: "16px" }}>
          Sleeping will advance to the next day and reset your daily activities.
        </p>
      </div>

      <div className="modal-footer">
        <button 
          className="btn btn-secondary" 
          onClick={cancelSleepConfirmation}
        >
          Cancel
        </button>
        <button 
          className="btn" 
          onClick={handleConfirmSleep}
        >
          Sleep
        </button>
      </div>
    </>
  );
}
