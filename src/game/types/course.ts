/**
 * Course and lesson types aligned to CONTENT_MODEL
 *
 * NOTE: The lesson UI is data-driven. React components should not hardcode
 * lesson text; they render `summary` + `contentBlocks`.
 */

export type CourseId =
  | "ai-foundations"
  | "data-prompting-basics"
  | "systems-thinking-ai";

export type LessonInteractionType = "read" | "interactive" | "reflection";

export type LessonContentBlockType = "text" | "video" | "example" | "tip";

import type {
  ProjectCapabilityKey,
  ProjectProgressCategoryKey,
} from "./player";

export interface TextBlock {
  type: "text";
  text: string;
}

export interface VideoBlock {
  type: "video";
  url?: string;
  title?: string;
}

export interface ExampleBlock {
  type: "example";
  title?: string;
  text: string;
}

export interface TipBlock {
  type: "tip";
  text: string;
}

export type LessonContentBlock = TextBlock | VideoBlock | ExampleBlock | TipBlock;

import type { Assessment } from "./assessment";
import type { StudyExtension } from "./study";

/**
 * A single lesson within a course.
 * Each lesson teaches one concept and contributes to course progress.
 */
export interface Lesson {
  id: string;
  title: string;
  courseId: CourseId;
  week: number; // 1..8
  concept: string;
  summary: string; // 1 paragraph
  contentBlocks: LessonContentBlock[];
  /** Official assessment run at the end of a classroom lesson (graded). */
  gradedAssessment?: Assessment;
  /** Optional study-mode recap/extra content and practice assessment. */
  studyExtension?: StudyExtension;
  interactionType: LessonInteractionType; // for future expansion
  completionReward: {
    knowledge: number;
    confidence: number;
    focus?: number;
  };
  projectImpact?: {
    progressDelta?: Partial<Record<ProjectProgressCategoryKey, number>>;
    capabilityUnlocks?: ProjectCapabilityKey[];
  };
  workbenchHooks?: {
    projectCategory?: ProjectProgressCategoryKey;
    progressMultiplier?: number;
    unlockWorkbench?: boolean;
  };
  unlocks?: string[]; // IDs of features or lessons unlocked after completion
}

/**
 * A course within a semester (e.g., "AI Foundations")
 * Contains a week-by-week lesson plan for the semester.
 */
export interface Course {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
  milestoneReward: {
    projectFeatures: string[]; // feature IDs unlocked upon course completion
    progressDelta?: Partial<Record<ProjectProgressCategoryKey, number>>;
    capabilityUnlocks?: ProjectCapabilityKey[];
  };
}

/**
 * Tracks a player's progress through a single course.
 */
export interface CourseCompletion {
  courseId: string;
  lessonsCompleted: string[]; // lesson IDs
  isCompleted: boolean;
  milestoneUnlocked: boolean; // becomes true when all lessons done
  progressPercent: number; // 0-100
}
