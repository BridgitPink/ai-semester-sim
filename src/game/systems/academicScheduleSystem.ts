/**
 * Academic Schedule System
 *
 * Enforces a strict day-by-day academic requirement for the MVP.
 *
 * Rules (weekly):
 * - Monday: AI Foundations
 * - Tuesday: Data & Prompting Basics
 * - Wednesday: Systems Thinking for AI
 * - Thursday: Lab day (separate lab activity)
 * - Friday–Sunday: Off days
 *
 * IMPORTANT: Schedule logic lives in systems/data, never in React components.
 */

import { useGameStore } from "../../store/useGameStore";
import type { Lesson } from "../types/course";

export type AcademicRequirement =
  | {
      kind: "class";
      courseId: "ai-foundations" | "data-prompting-basics" | "systems-thinking-ai";
      requiredLesson: Lesson | null;
    }
  | {
      kind: "lab";
      labActivityId: "lab-build-study-helper";
      title: string;
      description: string;
    }
  | {
      kind: "off";
    };

export function getScheduledCourseIdForDay(dayOfWeek: number):
  | "ai-foundations"
  | "data-prompting-basics"
  | "systems-thinking-ai"
  | null {
  const normalized = ((dayOfWeek - 1) % 7) + 1;
  if (normalized === 1) return "ai-foundations";
  if (normalized === 2) return "data-prompting-basics";
  if (normalized === 3) return "systems-thinking-ai";
  return null;
}

export function getRequiredLessonForToday(): Lesson | null {
  const state = useGameStore.getState();

  if (state.dayType !== "class") return null;
  if (!state.currentSemester) return null;

  const courseId = getScheduledCourseIdForDay(state.day);
  if (!courseId) return null;

  const course = state.currentSemester.courses.find((c) => c.id === courseId);
  if (!course) return null;

  const completion = state.courseCompletions.find((cc) => cc.courseId === courseId);
  if (!completion) return null;

  const nextIncomplete = course.lessons.find(
    (lesson) => !completion.lessonsCompleted.includes(lesson.id)
  );

  return nextIncomplete ?? null;
}

export function getCurrentAcademicRequirement(): AcademicRequirement {
  const state = useGameStore.getState();

  if (state.dayType === "class") {
    const courseId = getScheduledCourseIdForDay(state.day);
    if (!courseId) return { kind: "off" };

    return {
      kind: "class",
      courseId,
      requiredLesson: getRequiredLessonForToday(),
    };
  }

  if (state.dayType === "lab") {
    return {
      kind: "lab",
      labActivityId: "lab-build-study-helper",
      title: "Build Your First AI Study Helper",
      description:
        "Hands-on lab day. Build and iterate on a simple AI Study Helper flow.",
    };
  }

  return { kind: "off" };
}

export function hasCompletedTodaysRequiredAcademicActivity(): boolean {
  const state = useGameStore.getState();
  if (state.dayType === "off") return true;
  return state.mandatoryActivityComplete;
}

export function canTakeAcademicActionToday(): boolean {
  const state = useGameStore.getState();

  if (state.dayType === "off") return false;
  if (state.mandatoryActivityComplete) return false;

  // Class day requires a required lesson; lab day always has a lab activity.
  if (state.dayType === "class") {
    return getRequiredLessonForToday() !== null;
  }

  return state.dayType === "lab";
}

export function getTeacherDeskModeForToday(): "required-lesson" | "extra-credit" {
  const state = useGameStore.getState();

  if (state.dayType !== "class") return "extra-credit";
  if (state.mandatoryActivityComplete) return "extra-credit";

  // If there's no lesson left (course complete), desk becomes extra credit.
  return getRequiredLessonForToday() ? "required-lesson" : "extra-credit";
}
