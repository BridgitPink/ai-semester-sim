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
  // TODO: Logic to determine mood based on:
  // - NPC personality traits
  // - Current week/semester stress level
  // - Player interaction history via relationships
  
  // Stub: return random mood for now
  const moods: NpcMood[] = ["focused", "tired", "social", "stressed"];
  return moods[Math.floor(Math.random() * moods.length)];
}

/**
 * Get an NPC's location and routine for current week
 * TODO: Return routine data (where NPC is, what time, what they're doing)
 */
export function getNpcRoutine(
  _npcId: string
): { locationId: string; activity: string; description: string } {
  // TODO: Return NPC schedule based on:
  // - Personality traits
  // - Current semester week
  // - Relationship with player
  
  // Stub: return default
  return {
    locationId: "classroom",
    activity: "studying",
    description: "Working on assignments",
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
  // const store = useGameStore.getState();
  // const relationship = store.npcRelationships[npcId] || 50;
  
  // TODO: Complex dialogue generation or lookup from data
  // For now, stub response
  return {
    dialogue: "Hey! How's your semester going?",
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
  // TODO: Return contextual dialogue
  // For MVP: use static dialogue from data files
  return "I'm focused on my studies this semester.";
}