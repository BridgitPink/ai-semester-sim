import type { NpcProfile } from "../types/npc";

/**
 * MVP NPC roster - 5 NPCs distributed across campus locations.
 * Each has a personality profile that influences their mood and behavior.
 */
export const npcProfiles: NpcProfile[] = [
  {
    id: "ava",
    name: "Ava",
    x: 260,
    y: 300,
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
    x: 700,
    y: 220,
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
    x: 430,
    y: 200,
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
    x: 770,
    y: 350,
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
    x: 620,
    y: 400,
    mood: "social",
    traits: {
      ambition: 65,
      sociability: 85,
      discipline: 60,
      resilience: 70,
    },
  },
];