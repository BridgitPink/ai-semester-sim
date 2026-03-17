import type { NpcProfile } from "../types/npc";

/**
 * MVP NPC roster - 5 NPCs distributed across campus.
 * Each has a personality profile that influences their mood and behavior.
 * 
 * Positions are defined in `relativeNpcLayout` constant below as normalized coordinates (0.0-1.0).
 * Actual pixel positions computed at runtime based on canvas dimensions.
 */
export const npcProfiles: NpcProfile[] = [
  {
    id: "ava",
    name: "Ava",
    mood: "focused",
    traits: {
      ambition: 90,
      sociability: 45,
      discipline: 85,
      resilience: 70,
    },
  },
  {
    id: "miles",
    name: "Miles",
    mood: "social",
    traits: {
      ambition: 60,
      sociability: 90,
      discipline: 55,
      resilience: 65,
    },
  },
  {
    id: "alex",
    name: "Alex",
    mood: "stressed",
    traits: {
      ambition: 75,
      sociability: 60,
      discipline: 65,
      resilience: 50,
    },
  },
  {
    id: "jordan",
    name: "Jordan",
    mood: "focused",
    traits: {
      ambition: 70,
      sociability: 55,
      discipline: 80,
      resilience: 75,
    },
  },
  {
    id: "casey",
    name: "Casey",
    mood: "social",
    traits: {
      ambition: 65,
      sociability: 85,
      discipline: 60,
      resilience: 70,
    },
  },
];

/**
 * Relative NPC layout - defines normalized position (0.0-1.0) for each NPC
 * Actual pixel positions computed at runtime: x = width * relativeNpcLayout[id].x
 */
export const relativeNpcLayout: Record<string, { x: number; y: number }> = {
  ava: { x: 0.33, y: 0.52 },
  miles: { x: 0.73, y: 0.37 },
  alex: { x: 0.50, y: 0.74 },
  jordan: { x: 0.75, y: 0.70 },
  casey: { x: 0.42, y: 0.70 },
};