import type { InteriorConfig, InteriorObject } from "../../types/interiorObject";
import { createInteriorExitObject } from "./shared";

export const CAFE_OBJECTS: InteriorObject[] = [
  {
    id: "cafe-counter",
    building: "cafe",
    name: "Counter",
    relativeX: 0,
    relativeY: -0.66,
    width: 132,
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
    id: "cafe-table",
    building: "cafe",
    name: "Cafe Table",
    relativeX: -0.34,
    relativeY: 0.12,
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
    id: "cafe-menu-board",
    building: "cafe",
    name: "Menu Board",
    relativeX: 0.7,
    relativeY: -0.18,
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