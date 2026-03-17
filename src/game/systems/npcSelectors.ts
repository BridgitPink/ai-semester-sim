/**
 * NPC Selectors
 *
 * Pure read-only helpers for querying the NPC roster and their current
 * AI-decided locations. No side effects — safe to call from any context.
 *
 * These are convenience wrappers over npcSystem.decideNpcNow() and the
 * npcDefinitions roster. Use them in UI components, overlays, or debug tools
 * without coupling to scene-level state.
 */

import type { CampusLocationId, NpcDefinition, NpcTier } from "../types/npc";
import { npcDefinitions } from "../data/npcProfiles";
import { decideNpcNow } from "./npcSystem";

/** Return all NPCs matching the given tier. */
export function getNpcsByTier(tier: NpcTier): NpcDefinition[] {
  return npcDefinitions.filter((npc) => npc.tier === tier);
}

/**
 * Return all NPCs whose current AI decision routes them to `locationId`.
 * Uses the live store state (dayType, mandatoryActivityComplete, etc.) so
 * results reflect the current in-game situation.
 */
export function getNpcsByBuilding(locationId: CampusLocationId): NpcDefinition[] {
  return npcDefinitions.filter((npc) => {
    try {
      return decideNpcNow(npc.id)?.locationId === locationId;
    } catch {
      return false;
    }
  });
}

/**
 * Return the NPC IDs currently scheduled for `buildingId`.
 * Lightweight alternative to getNpcsByBuilding() when you only need IDs.
 */
export function getInteriorNpcsForBuilding(buildingId: string): string[] {
  return npcDefinitions
    .filter((npc) => {
      try {
        return decideNpcNow(npc.id)?.locationId === buildingId;
      } catch {
        return false;
      }
    })
    .map((npc) => npc.id);
}

/**
 * Return the 6 active-tier NPCs shown in the overworld.
 * Mirrors the logic in npcSystem.getVisibleOverworldNpcIds().
 */
export function getActiveNpcs(): NpcDefinition[] {
  return npcDefinitions.filter((n) => n.tier === "active").slice(0, 6);
}
