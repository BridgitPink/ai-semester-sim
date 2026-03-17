import type { NpcProfile } from "../types/npc";

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
];