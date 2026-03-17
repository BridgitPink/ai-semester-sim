import type { InteriorConfig, InteriorObject } from "../../types/interiorObject";
import { createInteriorExitObject } from "./shared";

export const LAB_OBJECTS: InteriorObject[] = [
  {
    id: "lab-workbench",
    building: "lab",
    name: "Workbench",
    relativeX: -0.14,
    relativeY: 0.14,
    width: 108,
    height: 62,
    interactionType: "practice-exercise",
    label: "Workbench",
    color: 0x78909c,
    isCollider: true,
    collisionMargin: 6,
    metadata: {
      description: "Prototype, test, and debug future lab projects here.",
    },
  },
  {
    id: "lab-parts-shelf",
    building: "lab",
    name: "Parts Shelf",
    relativeX: -0.72,
    relativeY: -0.32,
    width: 54,
    height: 118,
    interactionType: "reference-materials",
    label: "Parts Shelf",
    color: 0x546e7a,
    isCollider: true,
    collisionMargin: 5,
    metadata: {
      description: "Components and tools for future lab systems.",
    },
  },
  {
    id: "lab-project-board",
    building: "lab",
    name: "Project Board",
    relativeX: 0.68,
    relativeY: -0.54,
    width: 58,
    height: 76,
    interactionType: "course-goals",
    label: "Project Board",
    color: 0x42a5f5,
    isCollider: false,
    metadata: {
      description: "Project milestones and experiment notes.",
    },
  },
  createInteriorExitObject("lab"),
];

export const LAB_INTERIOR_CONFIG: InteriorConfig = {
  building: "lab",
  objects: LAB_OBJECTS,
};