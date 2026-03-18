/**
 * Player and project-related types
 */

export interface PlayerKnowledge {
  aiFoundations: number;
  dataPrompting: number;
  appliedAIBuilding: number;
}

export interface PlayerStats {
  energy: number;
  stress: number;
  focus: number;
  confidence: number;
  charisma: number;
  curiosity: number;
  discipline: number;
}

export interface PlayerProfile {
  knowledge: PlayerKnowledge;
  stats: PlayerStats;
}

export interface PlayerKnowledgeDelta {
  aiFoundations?: number;
  dataPrompting?: number;
  appliedAIBuilding?: number;
}

export interface PlayerStatDelta {
  energy?: number;
  stress?: number;
  focus?: number;
  confidence?: number;
  charisma?: number;
  curiosity?: number;
  discipline?: number;
}

export interface Player {
  id: string;
  name: string;
  profile: PlayerProfile;
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
