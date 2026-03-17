/**
 * Game bootstrap - single entry point for initializing game state and data
 * Called once when App.tsx mounts
 */

import { useGameStore } from "../store/useGameStore";
import { mvpProgram } from "./data/semester";
import { npcProfiles } from "./data/npcs";

/**
 * Initialize the game with MVP program data
 * - Load semester into Zustand store
 * - Initialize course completion tracking
 * - Set starting player position
 * - Prepare NPCs and locations
 */
export function initializeGame() {
  const store = useGameStore.getState();
  
  // Load first semester from MVP program
  const semester = mvpProgram.semesters[0];
  
  if (!semester) {
    console.error("No semester found in MVP program");
    return;
  }
  
  // Initialize semester in store (sets up course completions, week/day, etc)
  store.initializeSemester(semester);
  
  // Initialize NPC relationships (neutral start = 50)
  npcProfiles.forEach((npc) => {
    store.updateNpcRelationship(npc.id, 0); // Set to base 50
  });
  
  // Set starting location (Dorm) and panel state
  store.setLocation("dorm");
  store.openLocationPanel("dorm");
  
  console.log(`✓ Game initialized for semester: ${semester.title}`);
  console.log(`✓ Courses loaded: ${semester.courses.map((c) => c.title).join(", ")}`);
  console.log(`✓ NPCs spawned: ${npcProfiles.map((n) => n.name).join(", ")}`);
}

/**
 * Reset the game to initial state (for restart or new game)
 */
export function resetGame() {
  const store = useGameStore.getState();
  
  const semester = mvpProgram.semesters[0];
  if (!semester) return;
  
  store.initializeSemester(semester);
  npcProfiles.forEach((npc) => {
    store.updateNpcRelationship(npc.id, 0);
  });
  
  store.setLocation("dorm");
  store.openLocationPanel("dorm");
}
