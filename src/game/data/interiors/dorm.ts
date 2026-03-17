import type { InteriorConfig, InteriorObject } from "../../types/interiorObject";
import { createInteriorExitObject } from "./shared";

export const DORM_OBJECTS: InteriorObject[] = [
  {
    id: "dorm-bed",
    building: "dorm",
    name: "Bed",
    relativeX: -0.58,
    relativeY: -0.18,
    width: 88,
    height: 116,
    interactionType: "reference-materials",
    label: "Bed",
    color: 0x607d8b,
    isCollider: true,
    collisionMargin: 6,
    metadata: {
      description: "Your bed. Rest interactions are still being finished.",
    },
  },
  {
    id: "dorm-study-desk",
    building: "dorm",
    name: "Study Desk",
    relativeX: 0.34,
    relativeY: -0.1,
    width: 80,
    height: 58,
    interactionType: "practice-exercise",
    label: "Study Desk",
    color: 0x8d6e63,
    isCollider: true,
    collisionMargin: 5,
    metadata: {
      description: "A quiet place to work after class.",
    },
  },
  {
    id: "dorm-shelf",
    building: "dorm",
    name: "Shelf",
    relativeX: 0.62,
    relativeY: 0.38,
    width: 48,
    height: 92,
    interactionType: "course-goals",
    label: "Shelf",
    color: 0x795548,
    isCollider: true,
    collisionMargin: 5,
    metadata: {
      description: "Storage and personal items for future dorm systems.",
    },
  },
  createInteriorExitObject("dorm"),
];

export const DORM_INTERIOR_CONFIG: InteriorConfig = {
  building: "dorm",
  objects: DORM_OBJECTS,
};