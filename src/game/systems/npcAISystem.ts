/**
 * NPC AI System
 * Manages NPC mood updates, routine behavior, and relationship tracking
 */

import type { NpcProfile, NpcMood } from "../types/npc";

/**
 * Get a simple mood-based line for an NPC (used for quick feedback)
 * TODO: Expand with richer context from AI system
 */
export function getNpcLine(npc: NpcProfile): string {
  switch (npc.mood) {
    case "focused":
      return `${npc.name} is locked in and thinking about project work.`;
    case "tired":
      return `${npc.name} looks exhausted and needs a break.`;
    case "social":
      return `${npc.name} seems ready to talk and share ideas.`;
    case "stressed":
      return `${npc.name} looks overwhelmed by deadlines.`;
    default:
      return `${npc.name} is hanging around campus.`;
  }
}

/**
 * Update an NPC's mood based on game context
 * TODO: Implement mood rules based on time of day, player interactions, semester stress
 * Mood affects NPC dialogue and player relationship changes
 */
export function updateNpcMood(_npcId: string, _context: { week?: number; playerAction?: string }): NpcMood {
  const moods: NpcMood[] = ["focused", "tired", "social", "stressed"];
  const seed = `${_npcId}:${_context.week ?? 0}:${_context.playerAction ?? "idle"}`;
  const hash = seed.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return moods[hash % moods.length];
}

/**
 * Get an NPC's location and routine for current week
 * TODO: Return routine data (where NPC is, what time, what they're doing)
 */
export function getNpcRoutine(
  _npcId: string
): { locationId: string; activity: string; description: string } {
  const isLibraryRotation = _npcId.charCodeAt(0) % 2 === 0;

  return {
    locationId: isLibraryRotation ? "library" : "classroom",
    activity: isLibraryRotation ? "researching" : "studying",
    description: isLibraryRotation ? "Digging through reference materials" : "Working on assignments",
  };
}

/**
 * Handle player interaction with an NPC
 * TODO: Generate context-aware dialogue based on:
 * - NPC mood and traits
 * - Current course/lesson topic
 * - Relationship level
 * - Player stats (energy, stress, etc)
 */
export function interactWithNpc(_npcId: string): { dialogue: string; relationshipDelta: number } {
  return {
    dialogue: `Hey! How's your semester going? I was just thinking about ${_npcId.replace(/-/g, " ")}.`,
    relationshipDelta: 5, // positive interaction
  };
}

/**
 * Decrease all NPC relationships slightly over time (week progression)
 * Players must maintain relationships through interaction
 * TODO: Implement relationship decay based on personality traits
 */
export function updateNpcRelationshipsOverWeek() {
  // TODO: Apply decay formula
  // High-sociability NPCs = slower decay
  // Low-sociability NPCs = faster decay
  // Player can combat decay through interaction
}

/**
 * Get AI-driven dialogue for an NPC based on context
 * TODO: Could eventually call LLM for dynamic dialogue, or use data-driven lookup
 */
export function generateNpcDialogue(_npcId: string, _topic?: string): string {
  if (_topic) {
    return `${_npcId.replace(/-/g, " ")} is focused on ${_topic} this semester.`;
  }

  return `${_npcId.replace(/-/g, " ")} is focused on studies this semester.`;
}