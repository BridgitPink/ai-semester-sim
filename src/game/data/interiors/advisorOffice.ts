import type { InteriorConfig, InteriorObject } from "../../types/interiorObject";
import { createInteriorExitObject } from "./shared";

export const ADVISOR_OFFICE_OBJECTS: InteriorObject[] = [
  {
    id: "advisor-office-desk",
    building: "advisor-office",
    name: "Advisor Desk",
    relativeX: 0.24,
    relativeY: 0.06,
    width: 104,
    height: 58,
    interactionType: "course-goals",
    label: "Advisor Desk",
    color: 0x8d6e63,
    isCollider: true,
    collisionMargin: 6,
    metadata: {
      description: "Advising interactions are still being implemented.",
    },
  },
  {
    id: "advisor-office-bookshelf",
    building: "advisor-office",
    name: "Bookshelf",
    relativeX: -0.72,
    relativeY: -0.16,
    width: 52,
    height: 116,
    interactionType: "reference-materials",
    label: "Bookshelf",
    color: 0x6d4c41,
    isCollider: true,
    collisionMargin: 5,
    metadata: {
      description: "Planning guides and advising resources.",
    },
  },
  {
    id: "advisor-office-chair",
    building: "advisor-office",
    name: "Visitor Chair",
    relativeX: -0.04,
    relativeY: 0.42,
    width: 46,
    height: 46,
    interactionType: "practice-exercise",
    label: "Visitor Chair",
    color: 0xbcaaa4,
    isCollider: true,
    collisionMargin: 4,
    metadata: {
      description: "A placeholder interaction point for future advising conversations.",
    },
  },
  createInteriorExitObject("advisor-office"),
];

export const ADVISOR_OFFICE_INTERIOR_CONFIG: InteriorConfig = {
  building: "advisor-office",
  objects: ADVISOR_OFFICE_OBJECTS,
};