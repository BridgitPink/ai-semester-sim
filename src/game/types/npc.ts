export type NpcMood = "focused" | "tired" | "social" | "stressed";

export interface NpcTraits {
  ambition: number;
  sociability: number;
  discipline: number;
  resilience: number;
}

export interface NpcProfile {
  id: string;
  name: string;
  x: number;
  y: number;
  mood: NpcMood;
  traits: NpcTraits;
}