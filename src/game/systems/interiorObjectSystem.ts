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
 * Player collision radius in pixels (half-width of player sprite)
 */
const PLAYER_COLLISION_RADIUS = 12;

/**
 * AABB-Circle collision detection result
 */
interface CollisionResponse {
  collision: boolean;
  slideX: number;
  slideY: number;
}

/**
 * Check if a movement from (px, py) to (nx, ny) collides with a rectangle
 * Returns collision response with adjusted position if collision detected
 * Implements soft-sliding: if path is blocked, slide along the object edge
 *
 * @param nextX - Player desired next X position
 * @param nextY - Player desired next Y position
 * @param objX - Object center X
 * @param objY - Object center Y
 * @param objWidth - Object width
 * @param objHeight - Object height
 * @param margin - Collision margin/slide distance
 * @returns CollisionResponse with adjusted position
 */
function checkMovementCollision(
  nextX: number,
  nextY: number,
  objX: number,
  objY: number,
  objWidth: number,
  objHeight: number,
  margin: number
): CollisionResponse {
  const radius = PLAYER_COLLISION_RADIUS;
  const halfObjWidth = (objWidth + margin) / 2;
  const halfObjHeight = (objHeight + margin) / 2;

  // Check if next position collides with object
  const dx = Math.abs(nextX - objX);
  const dy = Math.abs(nextY - objY);
  
  // No collision if outside bounds + radius
  if (dx > halfObjWidth + radius || dy > halfObjHeight + radius) {
    return { collision: false, slideX: nextX, slideY: nextY };
  }

  // Collision detected! Calculate slide response
  // Try sliding horizontally (keep next X, clamp Y)
  let slideX = nextX;
  let slideY = nextY;

  // Determine which edge(s) the player is hitting
  const hitLeft = nextX < objX - halfObjWidth;
  const hitRight = nextX > objX + halfObjWidth;
  const hitTop = nextY < objY - halfObjHeight;
  const hitBottom = nextY > objY + halfObjHeight;

  // If hitting a corner or edge, slide along the nearest edge
  if (hitLeft) {
    slideX = objX - halfObjWidth - radius;
  } else if (hitRight) {
    slideX = objX + halfObjWidth + radius;
  }

  if (hitTop) {
    slideY = objY - halfObjHeight - radius;
  } else if (hitBottom) {
    slideY = objY + halfObjHeight + radius;
  }

  return { collision: true, slideX, slideY };
}

/**
 * Check collision with all collider objects and return adjusted position
 * Uses soft-sliding: if movement is blocked, slide player along object edges
 *
 * @param objects - Array of interior objects to check
 * @param layout - Interior layout for coordinate conversion
 * @param nextX - Desired next X position
 * @param nextY - Desired next Y position
 * @returns Adjusted {x, y} position with collisions applied
 */
export function checkCollisionsAndSlide(
  objects: InteriorObject[],
  layout: InteriorLayout,
  nextX: number,
  nextY: number
): { x: number; y: number } {
  let finalX = nextX;
  let finalY = nextY;

  // Check against each collider object
  for (const object of objects) {
    if (!object.isCollider) continue; // Skip non-colliding objects

    const margin = object.collisionMargin ?? 5;
    const objPos = getObjectWorldPosition(object, layout);

    const response = checkMovementCollision(
      finalX,
      finalY,
      objPos.x,
      objPos.y,
      object.width,
      object.height,
      margin
    );

    if (response.collision) {
      finalX = response.slideX;
      finalY = response.slideY;
    }
  }

  return { x: finalX, y: finalY };
}

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
  let closestDistance = Number.POSITIVE_INFINITY;

  for (const object of objects) {
    const objPos = getObjectWorldPosition(object, layout);
    const interactionThreshold = object.interactionRange ?? INTERACTION_THRESHOLD;

    // Distance from player to object center
    const distance = Math.sqrt((playerX - objPos.x) ** 2 + (playerY - objPos.y) ** 2);

    // Keep track of closest object within threshold
    if (distance <= interactionThreshold && distance < closestDistance) {
      closestDistance = distance;
      closestObject = object;
    }
  }

  return {
    objectFound: closestObject !== undefined,
    object: closestObject,
    distance: closestObject ? closestDistance : INTERACTION_THRESHOLD,
  };
}

/**
 * Handle object interaction based on interaction type
 * Dispatches to appropriate Zustand actions or scene transitions
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
      // Open course panel to review course progress
      store.openCoursePanel();
      console.log(`✓ Opening course review panel for: ${object.label}`);
      break;
    }

    case "practice-exercise": {
      // Open object panel with "Coming Soon" placeholder
      store.openObjectPanel(object);
      console.log(`✓ Opening practice panel for: ${object.label}`);
      break;
    }

    case "reference-materials": {
      // Open object panel with "Coming Soon" placeholder
      store.openObjectPanel(object);
      console.log(`✓ Opening reference materials panel for: ${object.label}`);
      break;
    }

    case "course-goals": {
      // Open object panel with "Coming Soon" placeholder
      store.openObjectPanel(object);
      console.log(`✓ Opening course goals panel for: ${object.label}`);
      break;
    }

    case "leave-classroom": {
      // Exit building handled by scene (no modal needed)
      console.log("✓ Exiting classroom...");
      // Note: The scene handles the actual transition in BuildingSceneBase.checkAndHandleObjectInteraction
      break;
    }

    default: {
      console.warn(`Unknown interaction type: ${object.interactionType}`);
    }
  }
}
