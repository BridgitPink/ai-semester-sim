import type { InteriorConfig, InteriorObject } from "../../types/interiorObject";
import { createInteriorExitObject } from "./shared";

export const LIBRARY_OBJECTS: InteriorObject[] = [
  {
    id: "library-stacks",
    building: "library",
    name: "Stacks",
    relativeX: -0.7,
    relativeY: -0.08,
    width: 52,
    height: 126,
    interactionType: "reference-materials",
    label: "Stacks",
    color: 0x6d4c41,
    isCollider: true,
    collisionMargin: 6,
    metadata: {
      description: "Research materials and reference books.",
    },
  },
  {
    id: "library-study-carrel",
    building: "library",
    name: "Study Carrel",
    relativeX: 0.02,
    relativeY: 0.18,
    width: 82,
    height: 58,
    interactionType: "practice-exercise",
    label: "Study Carrel",
    color: 0xb08968,
    isCollider: true,
    collisionMargin: 5,
    metadata: {
      description: "A focused place for quiet solo work.",
    },
  },
  {
    id: "library-board",
    building: "library",
    name: "Notice Board",
    relativeX: 0.68,
    relativeY: -0.56,
    width: 56,
    height: 72,
    interactionType: "course-goals",
    label: "Notice Board",
    color: 0xa1887f,
    isCollider: false,
    metadata: {
      description: "Library notices, deadlines, and research prompts.",
    },
  },
  createInteriorExitObject("library"),
];

export const LIBRARY_INTERIOR_CONFIG: InteriorConfig = {
  building: "library",
  objects: LIBRARY_OBJECTS,
};