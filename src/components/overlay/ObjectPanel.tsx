import { useEffect, useMemo, useState } from "react";
import { useGameStore } from "../../store/useGameStore";
import { canSleepNow, getCurrentDayType } from "../../game/systems/timeSystem";
import { getActionEffects } from "../../game/systems/freeActionSystem";
import { getCounterMenuItems, getStoreShelfItems } from "../../game/data/items/menus";
import { getItemDefinition } from "../../game/data/items/catalog";
import { getAssistantProjectDefinition } from "../../game/data/projects";

function formatMoney(value: number): string {
  return `$${value}`;
}

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
    currentSemester,
    completedLessons,
    objectModal,
    clearObjectModal,
    useFreeAction: spendFreeAction,
    openStudyLessonSession,
    labActivityStatus,
    completeLabActivityForToday,
    wallet,
    storeBasket,
    canAfford,
    getBasketTotal,
    addItemToBasket,
    removeItemFromBasket,
    clearBasket,
    purchaseDirectItem,
    purchaseBasket,
    workbenchSubmission,
    submitProjectWorkbenchInput,
    clearWorkbenchSubmissionFeedback,
    selectedProjectId,
    projectStatesById,
  } = useGameStore();
  const [commerceMessage, setCommerceMessage] = useState<string | null>(null);
  const [workbenchInput, setWorkbenchInput] = useState("");

  const energyRecovery = 60; // Partial recovery: +60 energy
  const dayType = getCurrentDayType();
  const sleepAllowed = canSleepNow();
  const basketTotal = getBasketTotal();
  const activeProject = selectedProjectId ? projectStatesById[selectedProjectId] ?? null : null;
  const activeProjectDefinition = activeProject ? getAssistantProjectDefinition(activeProject.id) : null;

  const canSpendFreeAction = freeActionsRemaining > 0;

  const shouldOfferStudyFreeAction =
    !!objectModal &&
    (objectModal.interactionType === "study" ||
      objectModal.interactionType === "practice-exercise");

  const completedLessonOptions = useMemo(() => {
    if (!shouldOfferStudyFreeAction) return [] as Array<{ id: string; label: string }>;
    if (!currentSemester) return [] as Array<{ id: string; label: string }>;

    const allLessons = currentSemester.courses.flatMap((course) =>
      course.lessons.map((lesson) => ({
        id: lesson.id,
        courseTitle: course.title,
        week: lesson.week,
        title: lesson.title,
      }))
    );

    return allLessons
      .filter((lesson) => completedLessons.includes(lesson.id))
      .sort((a, b) => {
        if (a.week !== b.week) return a.week - b.week;
        return a.title.localeCompare(b.title);
      })
      .map((lesson) => ({
        id: lesson.id,
        label: `Week ${lesson.week} — ${lesson.courseTitle}: ${lesson.title}`,
      }));
  }, [currentSemester, completedLessons, shouldOfferStudyFreeAction]);

  const [selectedStudyLessonId, setSelectedStudyLessonId] = useState<string>("");

  useEffect(() => {
    if (!shouldOfferStudyFreeAction) return;
    if (selectedStudyLessonId) return;
    setSelectedStudyLessonId(completedLessonOptions[0]?.id ?? "");
  }, [shouldOfferStudyFreeAction, completedLessonOptions, selectedStudyLessonId]);

  const storeBasketRows = useMemo(
    () =>
      storeBasket
        .map((entry) => {
          const item = getItemDefinition(entry.itemId);
          if (!item) return null;
          return {
            item,
            quantity: entry.quantity,
            subtotal: item.price * entry.quantity,
          };
        })
        .filter((entry) => entry !== null),
    [storeBasket]
  );

  const handleConfirmSleep = () => confirmSleep(energyRecovery);

  useEffect(() => {
    setCommerceMessage(null);
    setWorkbenchInput("");
    clearWorkbenchSubmissionFeedback();
  }, [
    objectModal?.object.id,
    objectModal?.variant,
    sleepConfirmationOpen,
    clearWorkbenchSubmissionFeedback,
  ]);

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

  const close = () => clearObjectModal();

  const handleDoStudy = () => {
    if (!canSpendFreeAction) return;
    if (!selectedStudyLessonId) return;
    spendFreeAction("study", getActionEffects("study"));
    openStudyLessonSession(selectedStudyLessonId);
  };

  const handleDoExtraCredit = () => {
    spendFreeAction("study", getActionEffects("study"));
    close();
  };

  const handleCompleteLab = () => {
    completeLabActivityForToday();
    close();
  };

  if (objectModal.variant === "direct-purchase") {
    const menuId =
      typeof objectModal.object.metadata?.menuId === "string"
        ? objectModal.object.metadata.menuId
        : "";
    const menuItems = getCounterMenuItems(menuId);

    return (
      <>
        <div className="modal-header">
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>

        <div className="modal-body">
          <p style={{ marginBottom: "16px" }}>{body}</p>
          <p style={{ marginBottom: "16px" }}>Wallet: {formatMoney(wallet)}</p>

          {menuItems.length === 0 && (
            <p style={{ color: "var(--color-text-secondary)" }}>
              No purchasable items are configured for this counter yet.
            </p>
          )}

          {menuItems.map((item) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "8px",
                marginBottom: "10px",
              }}
            >
              <div>
                <strong>{item.name}</strong>
                <div style={{ fontSize: "13px", color: "var(--color-text-secondary)" }}>
                  {item.description}
                </div>
              </div>
              <button
                className="btn"
                onClick={() => {
                  const result = purchaseDirectItem(item.id, 1);
                  setCommerceMessage(result.message);
                }}
              >
                {canAfford(item.price)
                  ? `Buy ${formatMoney(item.price)}`
                  : `Need ${formatMoney(item.price)}`}
              </button>
            </div>
          ))}

          {commerceMessage && (
            <p style={{ fontSize: "13px", color: "var(--color-text-secondary)" }}>
              {commerceMessage}
            </p>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={close}>
            Done
          </button>
        </div>
      </>
    );
  }

  if (objectModal.variant === "project-workbench") {
    return (
      <>
        <div className="modal-header">
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>

        <div className="modal-body">
          <p style={{ marginBottom: "16px" }}>{body}</p>
          <p style={{ fontSize: "13px", color: "var(--color-text-secondary)", marginBottom: "8px" }}>
            Free actions remaining: {freeActionsRemaining}/3
          </p>

          {!activeProject && (
            <p style={{ fontSize: "13px", color: "var(--color-text-secondary)", marginBottom: "8px" }}>
              No active project selected. Visit the Project Board in the lab and select AI Study Helper or AI Career Helper first.
            </p>
          )}

          {activeProject && activeProjectDefinition && (
            <p style={{ fontSize: "13px", color: "var(--color-text-secondary)", marginBottom: "8px" }}>
              Active project: {activeProjectDefinition.title} • Phase: {activeProject.phase}
            </p>
          )}

          <textarea
            value={workbenchInput}
            onChange={(event) => setWorkbenchInput(event.target.value)}
            placeholder="Enter your project work input..."
            style={{
              width: "100%",
              minHeight: "120px",
              border: "1px solid var(--color-border)",
              backgroundColor: "var(--color-surface-alt)",
              color: "var(--color-text-primary)",
              borderRadius: "6px",
              padding: "10px",
              marginBottom: "12px",
              resize: "vertical",
            }}
          />

          {workbenchSubmission.message && (
            <p style={{ fontSize: "13px", color: "var(--color-text-secondary)", marginBottom: "6px" }}>
              {workbenchSubmission.message}
            </p>
          )}

          {workbenchSubmission.responseText && (
            <p style={{ fontSize: "13px", color: "var(--color-text-secondary)" }}>
              Response: {workbenchSubmission.responseText}
            </p>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={close}>
            Cancel
          </button>
          <button
            className="btn"
            onClick={() => {
              const result = submitProjectWorkbenchInput(workbenchInput);
              if (result.success) {
                setWorkbenchInput("");
              }
            }}
          >
            Submit Work
          </button>
        </div>
      </>
    );
  }

  if (objectModal.variant === "shelf-browse") {
    const shelfId =
      typeof objectModal.object.metadata?.shelfId === "string"
        ? objectModal.object.metadata.shelfId
        : "";
    const shelfItems = getStoreShelfItems(shelfId);

    return (
      <>
        <div className="modal-header">
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>

        <div className="modal-body">
          <p style={{ marginBottom: "16px" }}>{body}</p>
          <p style={{ marginBottom: "16px" }}>Basket total: {formatMoney(basketTotal)}</p>

          {shelfItems.length === 0 && (
            <p style={{ color: "var(--color-text-secondary)" }}>
              This shelf has no configured items yet.
            </p>
          )}

          {shelfItems.map((item) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "8px",
                marginBottom: "10px",
              }}
            >
              <div>
                <strong>{item.name}</strong>
                <div style={{ fontSize: "13px", color: "var(--color-text-secondary)" }}>
                  {formatMoney(item.price)}
                </div>
              </div>
              <button
                className="btn"
                onClick={() => {
                  const result = addItemToBasket(item.id, 1);
                  setCommerceMessage(result.message);
                }}
              >
                Add to Basket
              </button>
            </div>
          ))}

          {commerceMessage && (
            <p style={{ fontSize: "13px", color: "var(--color-text-secondary)" }}>
              {commerceMessage}
            </p>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={close}>
            Done
          </button>
        </div>
      </>
    );
  }

  if (objectModal.variant === "checkout") {
    return (
      <>
        <div className="modal-header">
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>

        <div className="modal-body">
          <p style={{ marginBottom: "16px" }}>{body}</p>
          <p style={{ marginBottom: "8px" }}>Wallet: {formatMoney(wallet)}</p>
          <p style={{ marginBottom: "16px" }}>Total: {formatMoney(basketTotal)}</p>

          {storeBasketRows.length === 0 && (
            <p style={{ color: "var(--color-text-secondary)", marginBottom: "12px" }}>
              Basket is empty.
            </p>
          )}

          {storeBasketRows.map((entry) => (
            <div
              key={entry.item.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "8px",
                marginBottom: "10px",
              }}
            >
              <div>
                <strong>{entry.item.name}</strong> x{entry.quantity}
                <div style={{ fontSize: "13px", color: "var(--color-text-secondary)" }}>
                  {formatMoney(entry.subtotal)}
                </div>
              </div>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  const result = removeItemFromBasket(entry.item.id, 1);
                  setCommerceMessage(result.message);
                }}
              >
                Remove 1
              </button>
            </div>
          ))}

          {commerceMessage && (
            <p style={{ fontSize: "13px", color: "var(--color-text-secondary)" }}>
              {commerceMessage}
            </p>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={() => clearBasket()}>
            Clear Basket
          </button>
          <button
            className="btn"
            disabled={storeBasketRows.length === 0}
            onClick={() => {
              const result = purchaseBasket();
              setCommerceMessage(result.message);
            }}
          >
            Pay Now
          </button>
          <button className="btn btn-secondary" onClick={close}>
            Done
          </button>
        </div>
      </>
    );
  }

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
          <>
            <p style={{ fontSize: "13px", color: "var(--color-text-secondary)" }}>
              Free actions remaining today: {freeActionsRemaining}/3
            </p>

            <div style={{ marginTop: "10px" }}>
              <div style={{ fontSize: "13px", color: "var(--color-text-secondary)", marginBottom: "6px" }}>
                Choose a completed lesson to study:
              </div>

              {completedLessonOptions.length === 0 ? (
                <div style={{ fontSize: "13px", color: "var(--color-text-secondary)" }}>
                  No completed lessons yet. Finish a lesson first to unlock study mode.
                </div>
              ) : (
                <select
                  value={selectedStudyLessonId}
                  onChange={(event) => setSelectedStudyLessonId(event.target.value)}
                  style={{
                    width: "100%",
                    border: "1px solid var(--color-border)",
                    backgroundColor: "var(--color-surface-alt)",
                    color: "var(--color-text-primary)",
                    borderRadius: "6px",
                    padding: "8px",
                  }}
                >
                  {completedLessonOptions.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </>
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
            disabled={!canSpendFreeAction || completedLessonOptions.length === 0 || !selectedStudyLessonId}
          >
            Study Lesson (Use 1 Free Action)
          </button>
        )}

        <button className="btn btn-secondary" onClick={close}>
          Done
        </button>
      </div>
    </>
  );
}
