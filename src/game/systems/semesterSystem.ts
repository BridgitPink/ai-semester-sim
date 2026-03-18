/**
 * Semester progression system
 * Manages week advancement, course completion checks, semester end conditions
 */

import { useGameStore } from "../../store/useGameStore";
import {
  applyCourseProjectProgress,
  unlockProjectFeatureForCourse,
} from "./projectSystem";

/**
 * Initialize the current semester and set up initial game state
 * Called once at game start from bootstrap.ts
 * The real initialization happens in store.initializeSemester()
 */
export function initializeSemester() {
  // Initialization is handled by store.initializeSemester() called from bootstrap.ts
  // This function left as hook point for future semester-specific setup
  console.log("Semester system initialized");
}

/**
 * Advance the game by one week
 * Triggers any week-specific logic (NPC routines, stat decay, etc)
 */
export function advanceWeek() {
  const state = useGameStore.getState();
  state.advanceWeek();
  
  // TODO: Handle week-specific logic:
  // - NPC mood/routine updates
  // - Stat decay (energy, stress, etc)
  // - Week-based events or random encounters
}

/**
 * Check if semester is complete (all courses done or week 8+ reached)
 * Returns true if semester should end
 */
export function checkSemesterEnd(): boolean {
  const state = useGameStore.getState();
  const { week, courseCompletions } = state;
  
  const allCoursesComplete = courseCompletions.every((c) => c.isCompleted);
  const maxWeekReached = week > 8; // MVP: 8 weeks total
  
  return allCoursesComplete || maxWeekReached;
}

/**
 * Get the current progress toward semester completion (0-100)
 * Weights: 50% week progress + 50% course completion
 */
export function getSemesterProgress(): number {
  const state = useGameStore.getState();
  const { courseCompletions, week, currentSemester } = state;
  
  if (!currentSemester) return 0;
  
  const weekProgress = (Math.min(week, 8) / 8) * 50; // weeks are 50% of progress
  const completedCourseCount = courseCompletions.filter((c) => c.isCompleted).length;
  const courseProgress = (completedCourseCount / courseCompletions.length) * 50; // courses are 50%
  
  return Math.round(weekProgress + courseProgress);
}

/**
 * Find the course that contains a given lesson
 * Returns the course object or null if not found
 */
export function findCourseForLesson(lessonId: string) {
  const state = useGameStore.getState();
  const { currentSemester } = state;
  
  if (!currentSemester) return null;
  
  for (const course of currentSemester.courses) {
    if (course.lessons.some((lesson) => lesson.id === lessonId)) {
      return course;
    }
  }
  
  return null;
}

/**
 * Handle course completion
 * - Marks courseCompletion.milestoneUnlocked = true
 * - Unlocks project features tied to this course's milestone
 * - Triggers any course-specific celebration/feedback
 */
export function onCourseCompleted(courseId: string) {
  const state = useGameStore.getState();
  const { courseCompletions } = state;
  
  // Find the course completion
  const courseCompletion = courseCompletions.find((c) => c.courseId === courseId);
  if (!courseCompletion || courseCompletion.milestoneUnlocked) {
    return; // Already handled or not found
  }
  
  // Unlock project features tied to this course
  unlockProjectFeatureForCourse(courseId);
  applyCourseProjectProgress(courseId);
  
  // Mark milestone as unlocked in store
  state.markCourseMilestoneUnlocked(courseId);
  state.recomputeProjectState();
  
  console.log(`✓ Course completed: ${courseId}`);
  console.log(`✓ Project features unlocked for this milestone`);
}
