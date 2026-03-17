import { create } from "zustand";

type LocationId = "dorm" | "classroom" | "lab" | null;

interface PlayerStats {
  energy: number;
  focus: number;
  stress: number;
  confidence: number;
  knowledge: number;
  projectProgress: number;
}

interface GameStore {
  day: number;
  week: number;
  currentLocation: LocationId;
  activePanel: "none" | "location" | "npc";
  selectedNpcName: string | null;
  stats: PlayerStats;
  setLocation: (location: LocationId) => void;
  openLocationPanel: (location: LocationId) => void;
  openNpcPanel: (npcName: string) => void;
  closePanel: () => void;
}

export const useGameStore = create<GameStore>((set) => ({
  day: 1,
  week: 1,
  currentLocation: null,
  activePanel: "none",
  selectedNpcName: null,
  stats: {
    energy: 100,
    focus: 80,
    stress: 15,
    confidence: 50,
    knowledge: 0,
    projectProgress: 0,
  },
  setLocation: (location) => set({ currentLocation: location }),
  openLocationPanel: (location) =>
    set({
      currentLocation: location,
      activePanel: "location",
      selectedNpcName: null,
    }),
  openNpcPanel: (npcName) =>
    set({
      activePanel: "npc",
      selectedNpcName: npcName,
    }),
  closePanel: () =>
    set({
      activePanel: "none",
      selectedNpcName: null,
    }),
}));