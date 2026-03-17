/**
 * Interior Objects - Classroom
 *
 * Defines all interactive objects for the Classroom building.
 * Objects are positioned relative to the inner play area center.
 *
 * Positioning convention:
 * - relativeX: -1 (left edge), 0 (center), 1 (right edge)
 * - relativeY: -1 (top edge), 0 (center), 1 (bottom edge)
 */

import type { InteriorObject } from "../types/interiorObject";

/**
 * Classroom interactive objects
 * Includes desk (lesson interaction) and chalkboard (course progress review)
 */
export const CLASSROOM_OBJECTS: InteriorObject[] = [
  {
    id: "classroom-desk",
    building: "classroom",
    name: "Wooden Desk",
    relativeX: -0.25,
    relativeY: 0.15,
    width: 60,
    height: 60,
    interactionType: "start-lesson",
    label: "Desk",
    color: 0x8b4513, // Brown
    metadata: {
      description: "A sturdy wooden desk. Start or continue your lessons here.",
    },
  },
  {
    id: "classroom-chalkboard",
    building: "classroom",
    name: "Chalkboard",
    relativeX: 0.35,
    relativeY: -0.25,
    width: 80,
    height: 80,
    interactionType: "review-course",
    label: "Chalkboard",
    color: 0x2d5016, // Dark green
    metadata: {
      description: "A chalkboard with course progress. Review your current course.",
    },
  },
];
