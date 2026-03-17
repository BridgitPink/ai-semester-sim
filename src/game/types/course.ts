/**
 * Course and lesson types aligned to CONTENT_MODEL
 */

/**
 * A single lesson within a course.
 * Each lesson teaches one concept and contributes to course progress.
 */
export interface Lesson {
  id: string;
  title: string;
  concept: string;
  interactionType: "read" | "interactive" | "reflection"; // for future expansion
  shortPrompt: string; // 5-10 sentences of lesson content
  completionReward: {
    knowledge: number;
    confidence: number;
    focus?: number;
  };
  unlocks?: string[]; // IDs of features or lessons unlocked after completion
}

/**
 * A course within a semester (e.g., "AI Foundations")
 * Contains 3 lessons for MVP.
 */
export interface Course {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
  milestoneReward: {
    projectFeatures: string[]; // feature IDs unlocked upon course completion
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
