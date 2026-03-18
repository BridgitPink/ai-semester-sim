/**
 * Semester and program types aligned to CONTENT_MODEL
 */

import type { Course } from "./course";
import type {
  ProjectCapabilityKey,
  ProjectProgressCategoryKey,
} from "./player";

export interface ProjectProgressCategoryConfig {
  id: ProjectProgressCategoryKey;
  label: string;
  description: string;
  weight: number;
}

export interface ProjectCapabilityRuleConfig {
  capability: ProjectCapabilityKey;
  requiredCategoryMinimums?: Partial<Record<ProjectProgressCategoryKey, number>>;
  requiredOverallProgress?: number;
  requiredMilestoneIds?: string[];
}

export interface ProjectMilestoneConfig {
  id: string;
  name: string;
  description: string;
  requiredOverallProgress?: number;
  requiredCapabilities?: ProjectCapabilityKey[];
}

export interface CourseProjectProgressRule {
  courseId: string;
  progressDelta: Partial<Record<ProjectProgressCategoryKey, number>>;
  capabilityUnlocks?: ProjectCapabilityKey[];
}

export interface LessonProjectProgressRule {
  lessonId: string;
  progressDelta: Partial<Record<ProjectProgressCategoryKey, number>>;
  capabilityUnlocks?: ProjectCapabilityKey[];
}

export interface FreeActionProjectProgressRule {
  actionType: "project" | "study" | "rest" | "social" | "skip";
  progressDelta: Partial<Record<ProjectProgressCategoryKey, number>>;
}

export interface LabStageProjectCategoryRule {
  stageId: string;
  category: ProjectProgressCategoryKey;
}

export interface ProjectWorkbenchConfig {
  baseProgressGain: number;
  minProgressGain: number;
  maxProgressGain: number;
  lessonBoostUses: number;
  placeholderResponse: string;
  requireLabBuilding: boolean;
}

/**
 * Template for the final project deliverable.
 * Player selects from curated options to build their portfolio piece.
 */
export interface FinalProjectTemplate {
  id: string;
  name: string;
  description: string;
  titleOptions: string[]; // e.g., ["AI Study Helper", "Learning Assistant Bot"]
  problemStatementOptions: string[];
  featurePool: {
    id: string;
    name: string;
    description: string;
  }[];
  progressCategories: ProjectProgressCategoryConfig[];
  capabilities: ProjectCapabilityKey[];
  milestones: ProjectMilestoneConfig[];
  capabilityRules: ProjectCapabilityRuleConfig[];
  courseProgressRules: CourseProjectProgressRule[];
  lessonProgressRules: LessonProjectProgressRule[];
  freeActionProgressRules: FreeActionProjectProgressRule[];
  labStageCategoryRules: LabStageProjectCategoryRule[];
  workbenchConfig: ProjectWorkbenchConfig;
  techStack: string[];
  readmeSections: string[];
}

/**
 * A semester is the main progression unit in AI Semester Sim.
 * MVP has one semester with 3 courses and 6 locations.
 */
export interface Semester {
  id: string;
  title: string;
  totalWeeks: number;
  courses: Course[];
  finalProjectTemplate: FinalProjectTemplate;
}

/**
 * A program can contain multiple semesters.
 * MVP has one semester; future versions can expand.
 */
export interface Program {
  id: string;
  semesters: Semester[];
}
