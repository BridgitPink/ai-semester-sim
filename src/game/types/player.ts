/**
 * Player and project-related types
 */

export interface PlayerStats {
  energy: number;
  focus: number;
  stress: number;
  confidence: number;
  knowledge: number;
  projectProgress: number;
}

export interface Player {
  id: string;
  name: string;
  stats: PlayerStats;
}

/**
 * Tracks which features/sections of the final project are unlocked.
 * Features unlock as courses are completed.
 */
export interface ProjectState {
  unlockedFeatures: string[]; // feature IDs from FinalProjectTemplate.featurePool
  selectedTitle?: string;
  selectedProblemStatement?: string;
  selectedFeatures: string[];
}
