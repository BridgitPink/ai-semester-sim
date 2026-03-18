/**
 * Game bootstrap - single entry point for initializing game state and data
 * Called once when App.tsx mounts
 */

import { useGameStore } from "../store/useGameStore";
import { mvpProgram } from "./data/semester";
import { npcProfiles } from "./data/npcs";
import { startGameAutosave } from "../persistence/autosave";
import { loadGameFromServer, resetGameOnServer } from "../persistence/persistenceService";
import { applyGameSavePayload } from "../persistence/storeSaveAdapter";

const BOOTSTRAP_GUARD_KEY = "__aiSemesterSim_bootstrapped";
const INTRO_SEEN_STORAGE_KEY = "aiSemesterSim:introSeen";

/**
 * Initialize the game with MVP program data
 * - Load semester into Zustand store
 * - Initialize course completion tracking
 * - Set starting player position
 * - Prepare NPCs and locations
 */
export async function initializeGame() {
  // React dev StrictMode can mount/unmount/mount and run effects twice.
  // Guard bootstrap so initialization is deterministic per page load.
  const globalAny = globalThis as unknown as Record<string, unknown>;
  if (globalAny[BOOTSTRAP_GUARD_KEY]) {
    return;
  }
  globalAny[BOOTSTRAP_GUARD_KEY] = true;

  // Load first semester from MVP program
  const semester = mvpProgram.semesters[0];
  
  if (!semester) {
    console.error("No semester found in MVP program");
    return;
  }

  initializeRuntimeState(semester);

  const savedPayload = await loadGameFromServer();
  const loadedFromSave = savedPayload ? applyGameSavePayload(savedPayload) : false;

  if (!loadedFromSave) {
    showIntroPanelIfNeeded();
  }

  startGameAutosave();
  
  console.log(`✓ Game initialized for semester: ${semester.title}`);
  console.log(`✓ Courses loaded: ${semester.courses.map((c) => c.title).join(", ")}`);
  console.log(`✓ NPCs spawned: ${npcProfiles.map((n) => n.name).join(", ")}`);
}

/**
 * Reset the game to initial state (for restart or new game)
 */
export async function resetGame() {
  const resetResult = await resetGameOnServer();

  const semester = mvpProgram.semesters[0];
  if (!semester) return;
  
  initializeRuntimeState(semester);
  showIntroPanelIfNeeded(true);

  if (!resetResult && import.meta.env.DEV) {
    console.warn("[persistence] Backend reset failed; runtime was reset locally.");
  }

  useGameStore.setState({ menuOpen: false, activePanel: "none" });
}

function initializeRuntimeState(semester: (typeof mvpProgram.semesters)[number]) {
  const store = useGameStore.getState();

  // Initialize semester in store (sets up course completions, week/day, etc)
  store.initializeSemester(semester);

  // Initialize NPC relationships (neutral start = 50)
  npcProfiles.forEach((npc) => {
    store.updateNpcRelationship(npc.id, 0); // Set to base 50
  });

  // Set starting location (Dorm) only. Do not open a legacy location modal on boot.
  store.setLocation("dorm");
}

function showIntroPanelIfNeeded(force = false) {
  const store = useGameStore.getState();

  // Show a simple intro/tutorial panel exactly once per browser (not room-specific).
  try {
    if (force || !localStorage.getItem(INTRO_SEEN_STORAGE_KEY)) {
      localStorage.setItem(INTRO_SEEN_STORAGE_KEY, "1");
      store.openIntroPanel();
    }
  } catch {
    // If storage is unavailable, still show the intro to avoid a blank first-time experience.
    store.openIntroPanel();
  }
}
