// Legacy compatibility surface for older imports.
// Phase 5 canonical NPC data lives in `npcProfiles.ts` (unified schema).

import type { NpcDefinition } from "../types/npc";
import { npcDefinitions } from "./npcProfiles";

export const npcProfiles: NpcDefinition[] = npcDefinitions;

// Retained as a legacy export; Phase 5 overworld placement uses anchors in `npcSystem.ts`.
export const relativeNpcLayout: Record<string, { x: number; y: number }> = {};