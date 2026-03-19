import type { AssistantProjectPhase } from "./player";

export interface AssistantProjectPhaseDefinition {
  id: AssistantProjectPhase;
  label: string;
  helperLabel: string;
  milestoneDescription: string;
  recommendedNextStep: string;
  completionOverallProgress?: number;
}

export interface AssistantProjectDefinition {
  id: string;
  title: string;
  shortDescription: string;
  domainFocus: string;
  outputType: string;
  learningGoals: string[];
  phases: AssistantProjectPhaseDefinition[];
  finalDeliverableDescription: string;
  lessonPhaseGuidance: Partial<Record<AssistantProjectPhase, string>>;
}
