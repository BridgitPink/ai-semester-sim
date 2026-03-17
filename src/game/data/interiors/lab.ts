import type { InteriorConfig, InteriorObject } from "../../types/interiorObject";

export const LAB_OBJECTS: InteriorObject[] = [
  // ========================
  // LEFT COLUMN — SHELVES (3 evenly spaced)
  // ========================
  {
    id: "lab-shelf-1",
    building: "lab",
    name: "Shelf",
    relativeX: -0.75,
    relativeY: -0.6,
    width: 50,
    height: 110,
    interactionType: "reference-materials",
    label: "Shelf",
    color: 0x546e7a,
    isCollider: true,
    collisionMargin: 5,
    interactionRange: 70,
    metadata: {
      description: "Reference materials and components for lab work.",
    },
  },
  {
    id: "lab-shelf-2",
    building: "lab",
    name: "Shelf",
    relativeX: -0.75,
    relativeY: 0.0,
    width: 50,
    height: 110,
    interactionType: "reference-materials",
    label: "Shelf",
    color: 0x546e7a,
    isCollider: true,
    collisionMargin: 5,
    interactionRange: 70,
    metadata: {
      description: "Reference materials and components for lab work.",
    },
  },
  {
    id: "lab-shelf-3",
    building: "lab",
    name: "Shelf",
    relativeX: -0.75,
    relativeY: 0.6,
    width: 50,
    height: 110,
    interactionType: "reference-materials",
    label: "Shelf",
    color: 0x546e7a,
    isCollider: true,
    collisionMargin: 5,
    interactionRange: 70,
    metadata: {
      description: "Reference materials and components for lab work.",
    },
  },

  // ========================
  // CENTER — WORKBENCHES (even vertical spacing)
  // ========================
  {
    id: "lab-workbench-1",
    building: "lab",
    name: "Workbench",
    relativeX: 0,
    relativeY: -0.3,
    width: 120,
    height: 60,
    interactionType: "practice-exercise",
    label: "Workbench",
    color: 0x78909c,
    isCollider: true,
    collisionMargin: 6,
    interactionRange: 70,
    metadata: {
      description: "Prototype, test, and debug lab experiments here.",
    },
  },
  {
    id: "lab-workbench-2",
    building: "lab",
    name: "Workbench",
    relativeX: 0,
    relativeY: 0.3,
    width: 120,
    height: 60,
    interactionType: "practice-exercise",
    label: "Workbench",
    color: 0x78909c,
    isCollider: true,
    collisionMargin: 6,
    interactionRange: 70,
    metadata: {
      description: "Prototype, test, and debug lab experiments here.",
    },
  },

  // ========================
  // RIGHT COLUMN — BOARD + TECH DESK + EXIT
  // ========================
  {
    id: "lab-project-board",
    building: "lab",
    name: "Project Board",
    relativeX: 0.75,
    relativeY: -0.7,
    width: 80,
    height: 100,
    interactionType: "course-goals",
    label: "Projects",
    color: 0x42a5f5,
    isCollider: true,
    collisionMargin: 5,
    interactionRange: 70,
    metadata: {
      description: "Project milestones and achievement tracking.",
    },
  },

  {
    id: "lab-tech-desk",
    building: "lab",
    name: "Lab Tech Desk",
    relativeX: 0.75,
    relativeY: 0.0,
    width: 90,
    height: 60,
    interactionType: "lab-activity",
    label: "Lab Tech",
    color: 0x8d6e63,
    isCollider: true,
    collisionMargin: 5,
    interactionRange: 70,
    metadata: {
      description: "Lab technical support and course material review.",
    },
  },

  // NPC: Quinn — lab tech, wanders between the project board and lab tech station.
  {
    id: "lab-npc-quinn",
    building: "lab",
    name: "Quinn",
    relativeX: 0.75,
    relativeY: -0.35,
    width: 28,
    height: 28,
    interactionType: "talk-npc",
    label: "Quinn",
    color: 0xb0c4de,
    isCollider: false,
    interactionRange: 65,
    metadata: {
      npcId: "quinn-lab-tech",
      wandering: true,
      wanderRadius: 60,
      description: "Quinn keeps the lab running. Safety-first, always.",
    },
  },
  // NPC: Niko — lab-focused student, wanders between the two workbenches.
  {
    id: "lab-npc-niko",
    building: "lab",
    name: "Niko",
    relativeX: 0.0,
    relativeY: 0.0,
    width: 28,
    height: 28,
    interactionType: "talk-npc",
    label: "Niko",
    color: 0x8ecae6,
    isCollider: false,
    interactionRange: 65,
    metadata: {
      npcId: "niko-lab",
      wandering: true,
      wanderRadius: 55,
      description: "Niko is always iterating on something. Curious and hands-on.",
    },
  },

  {
    id: "lab-exit",
    building: "lab",
    name: "Exit",
    relativeX: 0.75,
    relativeY: 0.7,
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

export const LAB_INTERIOR_CONFIG: InteriorConfig = {
  building: "lab",
  objects: LAB_OBJECTS,
};