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

import type { PlayerDeltaPayload } from "./playerStatSystem";

export type FreeActionType = "rest" | "social" | "project" | "study" | "skip";

/**
 * Define effects for each free action type
 * Returns structured player deltas to apply
 */
export const FREE_ACTION_EFFECTS: Record<FreeActionType, () => PlayerDeltaPayload> = {
  rest: () => ({
    stats: {
      energy: 16, // Recover some energy
      stress: -10, // Reduce stress
    },
  }),
  
  social: () => ({
    stats: {
      stress: -6, // Quick stress relief
      confidence: 7, // Boost confidence through social interaction
      charisma: 6,
    },
  }),
  
  project: () => ({
    knowledge: {
      appliedAIBuilding: 7,
    },
    stats: {
      confidence: 4,
      energy: -8,
      focus: 2,
      discipline: 1,
    },
    projectProgress: 10, // Advance final project
  }),
  
  study: () => ({
    knowledge: {
      aiFoundations: 3,
      dataPrompting: 3,
      appliedAIBuilding: 2,
    },
    stats: {
      focus: 4,
      energy: -10,
      stress: 4,
      discipline: 2,
    },
  }),
  
  skip: () => ({
    stats: {
      confidence: -5,
      stress: 6,
      discipline: -2,
    },
  }),
};

/**
 * Get effects for a specific action type
 * @param actionType - Type of free action
 * @returns Structured player delta payload
 */
export function getActionEffects(actionType: FreeActionType): PlayerDeltaPayload {
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
