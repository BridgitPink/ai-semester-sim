/**
 * Free Action System - Handle daily free actions and their effects
 *
 * Free actions are optional activities that use up remaining action slots for the day.
 * Each action has a specific effect on player stats.
 *
 * Available actions:
 * - rest: Recover energy, reduce stress
 * - social: Build relationships, boost confidence
 * - project: Advance project progress
 * - study: Gain knowledge, use focus
 * - skip: No effect, just pass time
 */

import type { PlayerStats } from "../types/player";

export type FreeActionType = "rest" | "social" | "project" | "study" | "skip";

/**
 * Define effects for each free action type
 * Returns partial stat changes to apply
 */
export const FREE_ACTION_EFFECTS: Record<FreeActionType, () => Partial<PlayerStats>> = {
  rest: () => ({
    energy: 15, // Recover some energy
    stress: -8, // Reduce stress
    focus: 5, // Small focus boost after rest
  }),
  
  social: () => ({
    stress: -5, // Quick stress relief
    confidence: 10, // Boost confidence through social interaction
    energy: -5, // Slight energy cost from socializing
  }),
  
  project: () => ({
    projectProgress: 8, // Advance final project
    focus: -5, // Using focus reduces it slightly
    knowledge: 3, // Some incidental learning
  }),
  
  study: () => ({
    knowledge: 12, // Gain knowledge
    focus: -8, // Study uses focus
    stress: 3, // Studying can slightly increase stress
  }),
  
  skip: () => ({
    // No effect - just pass time
  }),
};

/**
 * Get effects for a specific action type
 * @param actionType - Type of free action
 * @returns Partial stat changes object
 */
export function getActionEffects(actionType: FreeActionType): Partial<PlayerStats> {
  const effectFn = FREE_ACTION_EFFECTS[actionType];
  if (!effectFn) {
    console.warn(`Unknown action type: ${actionType}`);
    return {};
  }
  
  return effectFn();
}

/**
 * Get display name for action type
 * @param actionType - Type of free action
 * @returns Human-readable action name
 */
export function getActionDisplayName(actionType: FreeActionType): string {
  const names: Record<FreeActionType, string> = {
    rest: "Rest & Relax",
    social: "Social Time",
    project: "Work on Project",
    study: "Study",
    skip: "Skip",
  };
  return names[actionType];
}

/**
 * Get description for action type
 * @param actionType - Type of free action
 * @returns Human-readable description
 */
export function getActionDescription(actionType: FreeActionType): string {
  const descriptions: Record<FreeActionType, string> = {
    rest: "Take a break and recover energy. Helps reduce stress.",
    social: "Hang out and build relationships. Boosts confidence.",
    project: "Work on your final AI Study Helper project.",
    study: "Hit the books and gain knowledge.",
    skip: "Do nothing for now.",
  };
  return descriptions[actionType];
}
