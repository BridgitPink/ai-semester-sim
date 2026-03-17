import type { InteriorConfig, InteriorObject } from "../../types/interiorObject";
import { createInteriorExitObject } from "./shared";

export const CAFE_OBJECTS: InteriorObject[] = [
  // TOP CENTER — TWO COUNTERS
  {
    id: "cafe-counter-left",
    building: "cafe",
    name: "Counter",
    relativeX: -0.18,
    relativeY: -0.7,
    width: 110,
    height: 54,
    interactionType: "reference-materials",
    label: "Counter",
    color: 0xa1887f,
    isCollider: true,
    collisionMargin: 6,
    metadata: {
      description: "Order flow and social systems are still in progress.",
    },
  },
  {
    id: "cafe-counter-right",
    building: "cafe",
    name: "Counter",
    relativeX: 0.18,
    relativeY: -0.7,
    width: 110,
    height: 54,
    interactionType: "reference-materials",
    label: "Counter",
    color: 0xa1887f,
    isCollider: true,
    collisionMargin: 6,
    metadata: {
      description: "Order flow and social systems are still in progress.",
    },
  },

  // LEFT SIDE — 4 WIDELY SPACED CAFE TABLES
  {
    id: "cafe-table-1",
    building: "cafe",
    name: "Cafe Table",
    relativeX: -0.72,
    relativeY: -0.48,
    width: 60,
    height: 60,
    interactionType: "practice-exercise",
    label: "Cafe Table",
    color: 0xd7b899,
    isCollider: true,
    collisionMargin: 5,
    metadata: {
      description: "A casual spot for future conversation and study interactions.",
    },
  },
  {
    id: "cafe-table-2",
    building: "cafe",
    name: "Cafe Table",
    relativeX: -0.38,
    relativeY: -0.12,
    width: 60,
    height: 60,
    interactionType: "practice-exercise",
    label: "Cafe Table",
    color: 0xd7b899,
    isCollider: true,
    collisionMargin: 5,
    metadata: {
      description: "A casual spot for future conversation and study interactions.",
    },
  },
  {
    id: "cafe-table-3",
    building: "cafe",
    name: "Cafe Table",
    relativeX: -0.72,
    relativeY: 0.28,
    width: 60,
    height: 60,
    interactionType: "practice-exercise",
    label: "Cafe Table",
    color: 0xd7b899,
    isCollider: true,
    collisionMargin: 5,
    metadata: {
      description: "A casual spot for future conversation and study interactions.",
    },
  },
  {
    id: "cafe-table-4",
    building: "cafe",
    name: "Cafe Table",
    relativeX: -0.38,
    relativeY: 0.62,
    width: 60,
    height: 60,
    interactionType: "practice-exercise",
    label: "Cafe Table",
    color: 0xd7b899,
    isCollider: true,
    collisionMargin: 5,
    metadata: {
      description: "A casual spot for future conversation and study interactions.",
    },
  },

  // RIGHT SIDE — MENU BOARD
  {
    id: "cafe-menu-board",
    building: "cafe",
    name: "Menu Board",
    relativeX: 0.72,
    relativeY: -0.12,
    width: 54,
    height: 82,
    interactionType: "course-goals",
    label: "Menu Board",
    color: 0xffcc80,
    isCollider: false,
    metadata: {
      description: "Cafe specials and social event notes.",
    },
  },

  createInteriorExitObject("cafe"),
];

export const CAFE_INTERIOR_CONFIG: InteriorConfig = {
  building: "cafe",
  objects: CAFE_OBJECTS,
};