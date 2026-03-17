import type { InteriorConfig, InteriorObject } from "../../types/interiorObject";

export const DORM_OBJECTS: InteriorObject[] = [
  // ROW 1 (TOP) - NOTICE BOARD (CENTER)
  {
    id: "dorm-notice-board",
    building: "dorm",
    name: "Notice Board",
    relativeX: 0,
    relativeY: -0.8,
    width: 100,
    height: 64,
    interactionType: "view-tasks",
    label: "Tasks",
    color: 0x9e9e9e,
    isCollider: false,
    metadata: {
      description: "View goals, schedule, and pending tasks. Task system is in progress.",
    },
  },

  // ROW 2 - BEDS
  {
    id: "dorm-bed-player",
    building: "dorm",
    name: "Bed",
    relativeX: -0.75,
    relativeY: -0.65,
    width: 80,
    height: 110,
    interactionType: "sleep-confirm",
    label: "Sleep",
    color: 0x5d7a8f,
    isCollider: true,
    collisionMargin: 6,
    interactionRange: 70,
    metadata: {
      description: "Rest and recover energy. Sleep to advance to the next day.",
    },
  },
  {
    id: "dorm-bed-roommate",
    building: "dorm",
    name: "Roommate's Bed",
    relativeX: 0.75,
    relativeY: -0.65,
    width: 80,
    height: 110,
    interactionType: "roommate-bed",
    label: "Roommate's Bed",
    color: 0x6d8a9f,
    isCollider: true,
    collisionMargin: 6,
    interactionRange: 70,
    metadata: {
      description: "Your roommate's bed. Foundation for future roommate dialogue and social systems.",
    },
  },

  // ROW 3 - DESKS
  {
    id: "dorm-desk-player",
    building: "dorm",
    name: "Study Desk",
    relativeX: -0.85,
    relativeY: -0.08,
    width: 88,
    height: 45,
    interactionType: "study",
    label: "Study",
    color: 0x8d6e63,
    isCollider: true,
    collisionMargin: 5,
    interactionRange: 70,
    metadata: {
      description: "Focus and complete assignments outside of class. Study sessions and homework systems are in progress.",
    },
  },
  {
    id: "dorm-desk-roommate",
    building: "dorm",
    name: "Roommate's Desk",
    relativeX: 0.9,
    relativeY: -0.05,
    width: 45,
    height: 88,
    interactionType: "roommate-desk",
    label: "Roommate's Desk",
    color: 0x9d7e73,
    isCollider: true,
    collisionMargin: 5,
    interactionRange: 70,
    metadata: {
      description: "Your roommate's study desk. Foundation for future shared-space mechanics and interaction.",
    },
  },

  // ROW 4 - WARDROBES
  {
    id: "dorm-wardrobe-player",
    building: "dorm",
    name: "Wardrobe",
    relativeX: -0.9,
    relativeY: 0.55,
    width: 52,
    height: 100,
    interactionType: "storage",
    label: "Storage",
    color: 0x795548,
    isCollider: true,
    collisionMargin: 5,
    interactionRange: 70,
    metadata: {
      description: "Store items and manage inventory. Inventory system is in progress.",
    },
  },
  {
    id: "dorm-wardrobe-roommate",
    building: "dorm",
    name: "Roommate's Wardrobe",
    relativeX: 0.9,
    relativeY: 0.55,
    width: 52,
    height: 100,
    interactionType: "roommate-storage",
    label: "Roommate's Wardrobe",
    color: 0x8a6558,
    isCollider: true,
    collisionMargin: 5,
    interactionRange: 70,
    metadata: {
      description: "Your roommate's wardrobe. Foundation for future inventory and item interaction systems.",
    },
  },

  // ROW 5 (BOTTOM) - EXIT (CENTER)
  {
    id: "dorm-door",
    building: "dorm",
    name: "Door",
    relativeX: 0,
    relativeY: 0.8,
    width: 55,
    height: 75,
    interactionType: "leave-classroom",
    label: "Exit",
    color: 0x666666,
    isCollider: false,
    metadata: {
      description: "Exit to return to campus. Press E to leave.",
    },
  },
];

export const DORM_INTERIOR_CONFIG: InteriorConfig = {
  building: "dorm",
  objects: DORM_OBJECTS,
};