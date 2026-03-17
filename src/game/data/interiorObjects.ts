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
 * Positioned to create a recognizable classroom layout:
 * - Chalkboard at top-center (front wall)
 * - Teacher desk at right-center (teaching station)
 * - Student desks at left-center (study area)
 * - Bookshelf at left-edge (reference corner)
 * - Bulletin board at top-right (informational display, no collision)
 * - Door at bottom-right (exit, no collision)
 *
 * Collision objects block player movement with soft-sliding behavior.
 */
export const CLASSROOM_OBJECTS: InteriorObject[] = [
  // FRONT WALL - Chalkboard (primary reference point, top-center)
  {
    id: "classroom-chalkboard",
    building: "classroom",
    name: "Chalkboard",
    relativeX: 0,
    relativeY: -0.65,
    width: 100,
    height: 70,
    interactionType: "review-course",
    label: "Chalkboard",
    color: 0x2d5016, // Dark green
    isCollider: true,
    collisionMargin: 8,
    metadata: {
      description: "A chalkboard with course progress. Review your current course.",
    },
  },

  // TEACHING STATION - Teacher Desk (right-center, mid-height)
  {
    id: "classroom-teacher-desk",
    building: "classroom",
    name: "Teacher Desk",
    relativeX: 0.35,
    relativeY: 0,
    width: 70,
    height: 65,
    interactionType: "start-lesson",
    label: "Teacher Desk",
    color: 0x8b4513, // Brown
    isCollider: true,
    collisionMargin: 8,
    metadata: {
      description: "A sturdy desk. Start or continue your lessons here.",
    },
  },

  // STUDY AREA - Student Desks (left-center, stacked arrangement)
  {
    id: "classroom-student-desks",
    building: "classroom",
    name: "Student Desks",
    relativeX: -0.35,
    relativeY: -0.1,
    width: 85,
    height: 75,
    interactionType: "practice-exercise",
    label: "Study Tables",
    color: 0xd4a574, // Tan
    isCollider: true,
    collisionMargin: 8,
    metadata: {
      description: "Study tables for practice exercises and group work.",
    },
  },

  // REFERENCE CORNER - Bookshelf (left-edge, tall fixture)
  {
    id: "classroom-bookshelf",
    building: "classroom",
    name: "Bookshelf",
    relativeX: -0.65,
    relativeY: 0.3,
    width: 50,
    height: 90,
    interactionType: "reference-materials",
    label: "Bookshelf",
    color: 0x5c3d2e, // Dark brown
    isCollider: true,
    collisionMargin: 6,
    metadata: {
      description: "Reference materials and learning resources.",
    },
  },

  // INFORMATION BOARD - Bulletin Board (top-right, display-only, non-blocking)
  {
    id: "classroom-bulletin-board",
    building: "classroom",
    name: "Bulletin Board",
    relativeX: 0.65,
    relativeY: -0.55,
    width: 60,
    height: 75,
    interactionType: "course-goals",
    label: "Course Board",
    color: 0xcc7722, // Cork/orange
    isCollider: false, // Display only, doesn't block movement
    metadata: {
      description: "Course goals, syllabus, and milestone progress.",
    },
  },

  // EXIT - Door/Exit Area (bottom-right, non-blocking)
  {
    id: "classroom-door",
    building: "classroom",
    name: "Door",
    relativeX: 0.55,
    relativeY: 0.7,
    width: 55,
    height: 75,
    interactionType: "leave-classroom",
    label: "Exit",
    color: 0x666666, // Gray
    isCollider: false, // Exit doesn't block movement (player walks through)
    metadata: {
      description: "Exit to return to campus. Press E to leave.",
    },
  },
];
