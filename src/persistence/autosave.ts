import { useGameStore } from "../store/useGameStore";
import { saveGameToServer } from "./persistenceService";
import { createAutosaveSignature, createGameSavePayload } from "./storeSaveAdapter";

const AUTOSAVE_DEBOUNCE_MS = 1500;

let autosaveUnsubscribe: (() => void) | null = null;

export function startGameAutosave() {
  if (autosaveUnsubscribe) {
    return autosaveUnsubscribe;
  }

  let previousSignature = createAutosaveSignature();
  let timer: ReturnType<typeof setTimeout> | null = null;
  let saveInFlight = false;
  let queuedAfterFlight = false;

  const flushSave = async () => {
    if (saveInFlight) {
      queuedAfterFlight = true;
      return;
    }

    const payload = createGameSavePayload();
    if (!payload) {
      return;
    }

    saveInFlight = true;
    try {
      await saveGameToServer(payload);
    } finally {
      saveInFlight = false;
      if (queuedAfterFlight) {
        queuedAfterFlight = false;
        timer = setTimeout(() => {
          void flushSave();
        }, AUTOSAVE_DEBOUNCE_MS);
      }
    }
  };

  autosaveUnsubscribe = useGameStore.subscribe((state) => {
    if (!state.currentSemester) {
      return;
    }

    const nextSignature = createAutosaveSignature();
    if (nextSignature === previousSignature) {
      return;
    }

    previousSignature = nextSignature;
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      void flushSave();
    }, AUTOSAVE_DEBOUNCE_MS);
  });

  return () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }

    autosaveUnsubscribe?.();
    autosaveUnsubscribe = null;
  };
}
