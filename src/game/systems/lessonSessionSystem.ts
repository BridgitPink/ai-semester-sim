/**
 * Lesson Session System
 *
 * Moves lesson completion/study bonus logic out of React components.
 * Uses the centralized Zustand store actions for state changes.
 */

import { useGameStore } from "../../store/useGameStore";
import { findCourseForLesson, onCourseCompleted } from "./semesterSystem";
import { applyLessonProjectProgress } from "./projectSystem";
import { getRequiredLessonForToday } from "./academicScheduleSystem";
import { getKnowledgeBranchForCourse, toKnowledgeDelta } from "./playerStatSystem";

export function finalizeOfficialLessonCompletion(lessonId: string): {
  success: boolean;
  message: string;
} {
  const state = useGameStore.getState();
  const lesson = state.currentSemester?.courses
    .flatMap((course) => course.lessons)
    .find((item) => item.id === lessonId);

  if (!lesson) {
    return { success: false, message: "Lesson not found." };
  }

  // Capture today's required lesson BEFORE we mutate completion state.
  const requiredLesson = getRequiredLessonForToday();
  const satisfiesTodaysRequirement = requiredLesson?.id === lesson.id;

  const course = findCourseForLesson(lesson.id);
  if (!course) {
    return { success: false, message: `Course not found for lesson ${lesson.id}` };
  }

  const courseCompletion = state.courseCompletions.find((c) => c.courseId === course.id);
  if (!courseCompletion) {
    return { success: false, message: `Course completion not found for ${course.id}` };
  }

  // Add lesson to completed
  state.addCompletedLesson(lesson.id, course.id);
  state.applyLessonWorkbenchHooks(lesson.id);
  applyLessonProjectProgress(lesson.id, course.id);

  // Consume today's academic block if this is the scheduled required lesson.
  if (satisfiesTodaysRequirement) {
    state.completeMandatoryActivity(lesson.id);
  }

  const knowledgeBranch = getKnowledgeBranchForCourse(course.id);

  // Apply lesson rewards + stamina pressure.
  state.applyPlayerDeltas({
    knowledge: toKnowledgeDelta(knowledgeBranch, lesson.completionReward.knowledge),
    stats: {
      confidence: lesson.completionReward.confidence,
      focus: lesson.completionReward.focus ?? 2,
      energy: -8,
      stress: 5,
    },
  });

  // If course now complete, unlock milestone.
  const updatedCompletion = useGameStore
    .getState()
    .courseCompletions.find((c) => c.courseId === course.id);
  if (updatedCompletion && updatedCompletion.isCompleted && !updatedCompletion.milestoneUnlocked) {
    onCourseCompleted(course.id);
  }

  return { success: true, message: "Lesson completed." };
}

export function applyStudySessionBonuses(lessonId: string): { success: boolean; message: string } {
  const state = useGameStore.getState();
  const lesson = state.currentSemester?.courses
    .flatMap((course) => course.lessons)
    .find((item) => item.id === lessonId);

  if (!lesson) {
    return { success: false, message: "Lesson not found." };
  }

  // Study sessions are review-only. Never mark lesson complete and never touch gradebook.
  const bonuses = lesson.studyExtension?.bonuses;
  if (!bonuses) {
    return { success: true, message: "Study completed." };
  }

  const branch = getKnowledgeBranchForCourse(lesson.courseId);
  const knowledgeDelta =
    typeof bonuses.knowledge === "number" && Number.isFinite(bonuses.knowledge) && bonuses.knowledge !== 0
      ? toKnowledgeDelta(branch, bonuses.knowledge)
      : undefined;

  // Apply small stat deltas as configured.
  state.applyPlayerDeltas({
    stats: {
      confidence: bonuses.confidence ?? 0,
      focus: bonuses.focus ?? 0,
    },
    knowledge: knowledgeDelta,
  });

  return { success: true, message: "Study completed." };
}
