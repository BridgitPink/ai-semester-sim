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
 * - Study tables in 2×3 grid at top-right
 * - Bookshelf at left-edge (reference corner)
 * - Course Board repositioned to center-right, higher up (avoid Exit misalignment)
 * - Door at bottom-right (exit, no collision)
 *
 * Collision objects block player movement with soft-sliding behavior.
 */
export const CLASSROOM_OBJECTS: InteriorObject[] = [
  // FRONT WALL - Chalkboard (primary reference point, top-center)
  // Primary focal point: brightest color + larger size
  {
    id: "classroom-chalkboard",
    building: "classroom",
    name: "Chalkboard",
    relativeX: 0,
    relativeY: -0.65,
    width: 110,
    height: 80,
    interactionType: "review-course",
    label: "Chalkboard",
    color: 0x4eaa4e, // Bright green (primary focal point)
    isCollider: true,
    collisionMargin: 8,
    metadata: {
      description: "A chalkboard with course progress. Review your current course.",
    },
  },

  // INFORMATION BOARD - Course Board (right wall, higher up)
  {
    id: "classroom-bulletin-board",
    building: "classroom",
    name: "Course Board",
    relativeX: 0.65,
    relativeY: -0.65,
    width: 55,
    height: 75,
    interactionType: "course-goals",
    label: "Course Board",
    color: 0xcc7722, // Cork/orange
    isCollider: false, // Display only, doesn't block movement
    metadata: {
      description: "Course goals, syllabus, and milestone progress.",
    },
  },

  // TEACHING STATION - Teacher Desk (left side, mid-height)
  // Secondary importance: good contrast, slightly larger
  {
    id: "classroom-teacher-desk",
    building: "classroom",
    name: "Teacher Desk",
    relativeX: -0.35,
    relativeY: 0,
    width: 80,
    height: 75,
    interactionType: "start-lesson",
    label: "Teacher Desk",
    color: 0xa0522d, // Darker brown (secondary focal point)
    isCollider: true,
    collisionMargin: 8,
    metadata: {
      description: "A sturdy desk. Start or continue your lessons here.",
    },
  },

  // REFERENCE CORNER - Bookshelf (bottom-left, tall fixture)
  // Lower emphasis: darker color, positioned at bottom
  {
    id: "classroom-bookshelf",
    building: "classroom",
    name: "Bookshelf",
    relativeX: -0.65,
    relativeY: 0.55,
    width: 50,
    height: 110,
    interactionType: "reference-materials",
    label: "Bookshelf",
    color: 0x5c3d2e, // Dark brown (lower emphasis)
    isCollider: true,
    collisionMargin: 6,
    metadata: {
      description: "Reference materials and learning resources.",
    },
  },

  // STUDY AREA - Study Tables (2×3 grid in top-right area)
  // 2 rows × 3 columns, narrower individual tables for classroom feel
  
  // Row 1, Column 1
  {
    id: "classroom-study-table-1",
    building: "classroom",
    name: "Study Table",
    relativeX: 0.15,
    relativeY: -0.65,
    width: 55,
    height: 50,
    interactionType: "practice-exercise",
    label: "Study Table",
    color: 0xd4a574, // Tan
    isCollider: true,
    collisionMargin: 6,
    metadata: {
      description: "A study table for practice and group work.",
    },
  },

  // Row 1, Column 2
  {
    id: "classroom-study-table-2",
    building: "classroom",
    name: "Study Table",
    relativeX: 0.4,
    relativeY: -0.65,
    width: 55,
    height: 50,
    interactionType: "practice-exercise",
    label: "Study Table",
    color: 0xd4a574, // Tan
    isCollider: true,
    collisionMargin: 6,
    metadata: {
      description: "A study table for practice and group work.",
    },
  },

  // Row 1, Column 3
  {
    id: "classroom-study-table-3",
    building: "classroom",
    name: "Study Table",
    relativeX: 0.65,
    relativeY: -0.65,
    width: 55,
    height: 50,
    interactionType: "practice-exercise",
    label: "Study Table",
    color: 0xd4a574, // Tan
    isCollider: true,
    collisionMargin: 6,
    metadata: {
      description: "A study table for practice and group work.",
    },
  },

  // Row 2, Column 1
  {
    id: "classroom-study-table-4",
    building: "classroom",
    name: "Study Table",
    relativeX: 0.15,
    relativeY: -0.3,
    width: 55,
    height: 50,
    interactionType: "practice-exercise",
    label: "Study Table",
    color: 0xd4a574, // Tan
    isCollider: true,
    collisionMargin: 6,
    metadata: {
      description: "A study table for practice and group work.",
    },
  },

  // Row 2, Column 2
  {
    id: "classroom-study-table-5",
    building: "classroom",
    name: "Study Table",
    relativeX: 0.4,
    relativeY: -0.3,
    width: 55,
    height: 50,
    interactionType: "practice-exercise",
    label: "Study Table",
    color: 0xd4a574, // Tan
    isCollider: true,
    collisionMargin: 6,
    metadata: {
      description: "A study table for practice and group work.",
    },
  },

  // Row 2, Column 3
  {
    id: "classroom-study-table-6",
    building: "classroom",
    name: "Study Table",
    relativeX: 0.65,
    relativeY: -0.3,
    width: 55,
    height: 50,
    interactionType: "practice-exercise",
    label: "Study Table",
    color: 0xd4a574, // Tan
    isCollider: true,
    collisionMargin: 6,
    metadata: {
      description: "A study table for practice and group work.",
    },
  },

  // EXIT - Door/Exit Area (bottom-right corner, non-blocking)
  // Lower emphasis: neutral gray, positioned at bottom-right corner
  {
    id: "classroom-door",
    building: "classroom",
    name: "Door",
    relativeX: 0.65,
    relativeY: 0.7,
    width: 55,
    height: 75,
    interactionType: "leave-classroom",
    label: "Exit",
    color: 0x666666, // Neutral gray (lower emphasis)
    isCollider: false, // Exit doesn't block movement (player walks through)
    metadata: {
      description: "Exit to return to campus. Press E to leave.",
    },
  },
];
