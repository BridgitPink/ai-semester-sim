import { useGameStore } from "../../store/useGameStore";
import { canSleepNow, getCurrentDayType } from "../../game/systems/timeSystem";
import { getActionEffects } from "../../game/systems/freeActionSystem";

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
    skipMandatoryActivityForToday,
    freeActionsRemaining,
    objectModal,
    clearObjectModal,
    useFreeAction,
    labActivityStatus,
    completeLabActivityForToday,
  } = useGameStore();

  const energyRecovery = 60; // Partial recovery: +60 energy
  const dayType = getCurrentDayType();
  const sleepAllowed = canSleepNow();

  const handleConfirmSleep = () => confirmSleep(energyRecovery);

  // Priority: sleep confirmation uses legacy state field.
  if (sleepConfirmationOpen) {
    const sleepBlockReason =
      dayType === "off"
        ? "You're not tired yet. Do at least one free action first."
        : "Finish today's required academic activity, or choose to skip it.";

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

          {!sleepAllowed && (
            <p style={{ marginBottom: "16px", color: "var(--color-text-secondary)" }}>
              {sleepBlockReason}
            </p>
          )}
          
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
          {!sleepAllowed && dayType !== "off" && (
            <button
              className="btn btn-secondary"
              onClick={skipMandatoryActivityForToday}
            >
              Skip Required Activity
            </button>
          )}
          <button 
            className="btn" 
            onClick={handleConfirmSleep}
            disabled={!sleepAllowed}
          >
            Sleep
          </button>
        </div>
      </>
    );
  }

  // Generic object modal context (placeholder/info/extra credit/lab)
  if (!objectModal) return null;

  const title = objectModal.title ?? objectModal.object.label ?? objectModal.object.name;
  const subtitle =
    objectModal.subtitle ??
    (objectModal.variant === "extra-credit"
      ? "Optional work"
      : objectModal.variant === "lab"
        ? "Hands-on learning"
        : "Coming soon");

  const descriptionFromData = objectModal.object.metadata?.description;
  const body =
    objectModal.body ??
    descriptionFromData ??
    `Interacting with ${objectModal.object.name}.`;

  const canSpendFreeAction = freeActionsRemaining > 0;
  const close = () => clearObjectModal();

  const shouldOfferStudyFreeAction =
    objectModal.interactionType === "study" ||
    objectModal.interactionType === "practice-exercise";

  const handleDoStudy = () => {
    useFreeAction("study", getActionEffects("study"));
    close();
  };

  const handleDoExtraCredit = () => {
    useFreeAction("study", getActionEffects("study"));
    close();
  };

  const handleCompleteLab = () => {
    completeLabActivityForToday();
    close();
  };

  return (
    <>
      <div className="modal-header">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>

      <div className="modal-body">
        <p style={{ marginBottom: "16px" }}>{body}</p>

        {objectModal.variant === "lab" && (
          <p style={{ fontSize: "13px", color: "var(--color-text-secondary)" }}>
            Status: {labActivityStatus === "complete" ? "✓ Complete" : "Not Started"}
          </p>
        )}

        {objectModal.variant === "extra-credit" && (
          <p style={{ fontSize: "13px", color: "var(--color-text-secondary)" }}>
            Extra credit uses a free action and gives a small knowledge boost.
          </p>
        )}

        {shouldOfferStudyFreeAction && (
          <p style={{ fontSize: "13px", color: "var(--color-text-secondary)" }}>
            Free actions remaining today: {freeActionsRemaining}/3
          </p>
        )}
      </div>

      <div className="modal-footer">
        {objectModal.variant === "lab" && labActivityStatus !== "complete" && (
          <button className="btn" onClick={handleCompleteLab}>
            Complete Lab
          </button>
        )}

        {objectModal.variant === "extra-credit" && (
          <button
            className="btn"
            onClick={handleDoExtraCredit}
            disabled={!canSpendFreeAction}
          >
            Do Extra Credit (Use 1 Free Action)
          </button>
        )}

        {objectModal.variant !== "extra-credit" && shouldOfferStudyFreeAction && (
          <button
            className="btn"
            onClick={handleDoStudy}
            disabled={!canSpendFreeAction}
          >
            Study (Use 1 Free Action)
          </button>
        )}

        <button className="btn btn-secondary" onClick={close}>
          Done
        </button>
      </div>
    </>
  );
}
