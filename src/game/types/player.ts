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

export type ProjectProgressCategoryKey =
  | "prompting"
  | "retrieval"
  | "knowledgeBase"
  | "evaluation"
  | "interface";

export type ProjectCapabilityKey =
  | "hasPromptTemplates"
  | "hasKnowledgeSource"
  | "hasRetrievalLayer"
  | "hasEmbeddings"
  | "hasVectorDb"
  | "hasDocumentUpload"
  | "hasDashboard"
  | "hasEvaluationMetrics";

export interface ProjectProgressState {
  overall: number;
  prompting: number;
  retrieval: number;
  knowledgeBase: number;
  evaluation: number;
  interface: number;
}

export interface ProjectCapabilitiesState {
  hasPromptTemplates: boolean;
  hasKnowledgeSource: boolean;
  hasRetrievalLayer: boolean;
  hasEmbeddings: boolean;
  hasVectorDb: boolean;
  hasDocumentUpload: boolean;
  hasDashboard: boolean;
  hasEvaluationMetrics: boolean;
}

export interface ProjectMilestoneState {
  id: string;
  name: string;
  description: string;
  requiredOverallProgress?: number;
  requiredCapabilities?: ProjectCapabilityKey[];
  isCompleted: boolean;
}

/**
 * Tracks which features/sections of the final project are unlocked.
 * Features unlock as courses are completed.
 */
export interface ProjectState {
  id: string;
  name: string;
  description: string;
  progress: ProjectProgressState;
  capabilities: ProjectCapabilitiesState;
  milestones: ProjectMilestoneState[];

  unlockedFeatures: string[]; // feature IDs from FinalProjectTemplate.featurePool
  selectedTitle?: string;
  selectedProblemStatement?: string;
  selectedFeatures: string[];
}
