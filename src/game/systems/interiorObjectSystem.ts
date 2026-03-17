/**
 * Interior Object Interaction System
 *
 * Provides reusable utilities for:
 * - Proximity detection (find nearest interactive object)
 * - Interaction dispatch (forward to Zustand based on object type)
 * - Coordinate conversion (relative → world coordinates)
 *
 * Decoupled from scenes and game mechanics.
 * Used by BuildingSceneBase for E-key interactions.
 */

import { useGameStore } from "../../store/useGameStore";
import { courses } from "../data/courses";
import type { InteriorObject, ProximityCheckResult } from "../types/interiorObject";
import type { InteriorLayout } from "./interiorLayoutSystem";

/**
 * Proximity detection threshold in pixels
 * Consistent with NPC interactions in overworld (50px)
 */
const INTERACTION_THRESHOLD = 50;

/**
 * Convert object relative position to world coordinates
 *
 * @param object - InteriorObject with relative coordinates
 * @param layout - InteriorLayout from scene
 * @returns World coordinates {x, y}
 */
export function getObjectWorldPosition(
  object: InteriorObject,
  layout: InteriorLayout
): { x: number; y: number } {
  const innerArea = layout.innerArea;

  // Convert relative [-1, 1] to world coordinates
  const worldX = innerArea.x + (object.relativeX * innerArea.width) / 2;
  const worldY = innerArea.y + (object.relativeY * innerArea.height) / 2;

  return { x: worldX, y: worldY };
}

/**
 * Check proximity to all objects in the scene
 * Returns closest object within interaction threshold
 *
 * @param objects - Array of InteriorObjects to check
 * @param layout - InteriorLayout for coordinate conversion
 * @param playerX - Player center X position (world coords)
 * @param playerY - Player center Y position (world coords)
 * @returns ProximityCheckResult with closest object or null
 */
export function checkObjectProximity(
  objects: InteriorObject[],
  layout: InteriorLayout,
  playerX: number,
  playerY: number
): ProximityCheckResult {
  let closestObject: InteriorObject | undefined;
  let closestDistance = INTERACTION_THRESHOLD;

  for (const object of objects) {
    const objPos = getObjectWorldPosition(object, layout);

    // Distance from player to object center
    const distance = Math.sqrt((playerX - objPos.x) ** 2 + (playerY - objPos.y) ** 2);

    // Keep track of closest object within threshold
    if (distance < closestDistance) {
      closestDistance = distance;
      closestObject = object;
    }
  }

  return {
    objectFound: closestObject !== undefined,
    object: closestObject,
    distance: closestDistance,
  };
}

/**
 * Handle object interaction based on interaction type
 * Dispatches to appropriate Zustand actions
 *
 * @param object - InteriorObject being interacted with
 */
export function handleObjectInteraction(object: InteriorObject): void {
  const store = useGameStore.getState();

  switch (object.interactionType) {
    case "start-lesson": {
      // Get first incomplete course from courseCompletions
      const activeCourseCompletion = store.courseCompletions.find(
        (cc) => !cc.isCompleted
      );

      if (!activeCourseCompletion) {
        console.log("No incomplete courses available");
        return;
      }

      // Find course data by ID
      const courseData = courses.find((c) => c.id === activeCourseCompletion.courseId);
      if (!courseData) {
        console.warn(`Course not found: ${activeCourseCompletion.courseId}`);
        return;
      }

      // Find next incomplete lesson
      const nextIncompleteLesson = courseData.lessons.find(
        (lesson) => !activeCourseCompletion.lessonsCompleted.includes(lesson.id)
      );

      if (nextIncompleteLesson) {
        store.openLessonModal(nextIncompleteLesson);
        console.log(`✓ Opened lesson: ${nextIncompleteLesson.title}`);
      } else {
        console.log(`✓ Course ${activeCourseCompletion.courseId} already completed`);
      }
      break;
    }

    case "review-course": {
      // MVP: CoursePanel already shows the active incomplete course
      // Just log that review was triggered
      const activeCourseCompletion = store.courseCompletions.find(
        (cc) => !cc.isCompleted
      );
      if (activeCourseCompletion) {
        console.log(
          `✓ Reviewing course: ${activeCourseCompletion.courseId}`
        );
      }
      break;
    }

    default: {
      console.warn(`Unknown interaction type: ${object.interactionType}`);
    }
  }
}
