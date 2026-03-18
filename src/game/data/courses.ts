/**
 * Course aggregation layer.
 *
 * Each class lives in its own dedicated data module so lesson content can be
 * refined in isolation while the rest of the app imports a stable surface.
 */

import type { Course, CourseId } from "../types/course";
import { aiFoundationsCourse } from "./courses/aiFoundations";
import { dataAndPromptingCourse } from "./courses/dataAndPrompting";
import { systemsThinkingCourse } from "./courses/systemsThinking";

const courseRegistry: Record<CourseId, Course> = {
  "ai-foundations": aiFoundationsCourse,
  "data-prompting-basics": dataAndPromptingCourse,
  "systems-thinking-ai": systemsThinkingCourse,
};

export const courses: Course[] = [
  aiFoundationsCourse,
  dataAndPromptingCourse,
  systemsThinkingCourse,
];

export function getCourseById(courseId: CourseId): Course | undefined {
  return courseRegistry[courseId];
}

export {
  aiFoundationsCourse,
  dataAndPromptingCourse,
  systemsThinkingCourse,
};
