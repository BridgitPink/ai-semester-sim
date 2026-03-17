import type { InteriorObject } from "../../types/interiorObject";

export function createInteriorExitObject(building: string): InteriorObject {
  return {
    id: `${building}-door`,
    building,
    name: "Door",
    relativeX: 0.65,
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
  };
}