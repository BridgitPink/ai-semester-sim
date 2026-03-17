/**
 * Semester progression system
 * Manages week advancement, course completion checks, semester end conditions
 */

import { useGameStore } from "../../store/useGameStore";

/**
 * Initialize the current semester and set up initial game state
 * Called once at game start
 */
export function initializeSemester() {
  // TODO: Load semester from data, set store state
  // TODO: Initialize NPC relationships
  // TODO: Set starting location (dorm or first class)
}

/**
 * Advance the game by one week
 * TODO: Trigger week-based events
 * TODO: Update NPC moods/routines
 * TODO: Check for course milestones
 */
export function advanceWeek() {
  const { advanceWeek: storeAdvance } = useGameStore.getState();
  storeAdvance();
  // TODO: Handle week-specific logic (NPC events, stat changes)
}

/**
 * Check if semester is complete (all courses done or week 6 reached)
 * Returns true if semester should end
 */
export function checkSemesterEnd(): boolean {
  const { week, courseCompletions } = useGameStore.getState();
  
  const allCoursesComplete = courseCompletions.every((c: any) => c.isCompleted);
  const weekSixReached = week >= 6;
  
  return allCoursesComplete || weekSixReached;
  // TODO: Trigger end-of-semester flow (final project export, credits roll, etc)
}

/**
 * Get the current progress toward semester completion (0-100)
 */
export function getSemesterProgress(): number {
  const { courseCompletions, week } = useGameStore.getState();
  const weekProgress = (week / 6) * 50; // weeks are 50% of progress
  const courseProgress =
    (courseCompletions.filter((c: any) => c.isCompleted).length /
      courseCompletions.length) *
    50; // courses are 50%
  return Math.round(weekProgress + courseProgress);
}
