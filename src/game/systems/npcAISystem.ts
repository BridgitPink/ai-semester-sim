/**
 * NPC AI System
 * Manages NPC mood updates, routine behavior, and relationship tracking.
 *
 * These functions serve as the integration layer between game systems and
 * the real deterministic NPC logic in npcSystem.ts. They are future-ready
 * hook points for AI-driven upgrades without changing call sites.
 */

import type { NpcDefinition, NpcMood } from "../types/npc";
import {
  getNpcInteractionView,
  performNpcInteraction,
  decideNpcNow,
} from "./npcSystem";
import { useGameStore } from "../../store/useGameStore";

/**
 * Get a context-aware line for an NPC via the real dialogue pipeline.
 * Falls back to a mood description if no dialogue is available yet.
 */
export function getNpcLine(npc: NpcDefinition): string {
  // Delegate to the real interaction view for context-aware dialogue.
  const view = getNpcInteractionView(npc.id);
  if (view?.lines?.[0]) return view.lines[0];

  // Fallback: simple mood description.
  const moodLine: Record<NpcMood, string> = {
    focused: `${npc.name} is locked in and thinking.`,
    tired: `${npc.name} looks exhausted and needs a break.`,
    social: `${npc.name} seems ready to talk and share ideas.`,
    stressed: `${npc.name} looks overwhelmed by deadlines.`,
    relaxed: `${npc.name} is calm and taking things one step at a time.`,
  };
  return moodLine[npc.defaultMood] ?? `${npc.name} is hanging around campus.`;
}

/**
 * Return the NPC's current mood from the deterministic decision pipeline.
 */
export function updateNpcMood(npcId: string, _context: { week?: number; playerAction?: string }): NpcMood {
  return decideNpcNow(npcId)?.mood ?? "focused";
}

/**
 * Get an NPC's current location and activity from the AI decision pipeline.
 */
export function getNpcRoutine(
  npcId: string
): { locationId: string; activity: string; description: string } {
  const decision = decideNpcNow(npcId);
  if (!decision) return { locationId: "dorm", activity: "relaxing", description: "Taking it easy for now." };
  return {
    locationId: decision.locationId,
    activity: decision.activity,
    description: `${decision.name} is ${decision.activity} at the ${decision.locationId.replace(/-/g, " ")}.`,
  };
}

/**
 * Handle player interaction with an NPC via the real interaction pipeline.
 * Applies relationship and stat effects to the store.
 */
export function interactWithNpc(npcId: string): { dialogue: string; relationshipDelta: number } {
  const outcome = performNpcInteraction(npcId);
  const view = getNpcInteractionView(npcId);
  return {
    dialogue: view?.lines?.[0] ?? `Good to connect with you.`,
    relationshipDelta: outcome.relationshipDelta,
  };
}

/**
 * Apply small passive affinity decay to encourage players to maintain relationships.
 * Call once per week advancement.
 */
export function updateNpcRelationshipsOverWeek(): void {
  const store = useGameStore.getState();
  const DECAY = 1;
  Object.keys(store.npcRelationshipState).forEach((npcId) => {
    const rel = store.npcRelationshipState[npcId];
    // Only decay NPCs the player has interacted with (familiarity > 0).
    if (rel.familiarity > 0 || rel.affinity > 50) {
      store.updateNpcRelationship(npcId, -DECAY);
    }
  });
}

/**
 * Get dialogue for an NPC. Future hook point for LLM or structured dialogue.
 */
export function generateNpcDialogue(npcId: string, _topic?: string): string {
  const view = getNpcInteractionView(npcId);
  return view?.lines?.join(" ") ?? `${npcId.replace(/-/g, " ")} is focused on their studies this semester.`;
}