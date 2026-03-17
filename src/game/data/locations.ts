/**
 * MVP Location definitions - 6 campus locations where interactions happen
 */

export interface LocationProfile {
  id: string;
  name: string;
  type: "residential" | "academic" | "social" | "support";
  description: string;
  position: { x: number; y: number }; // Phaser canvas coordinates
  size: { width: number; height: number };
  color: number; // Phaser color code (hex as number)
}

export const locations: LocationProfile[] = [
  {
    id: "dorm",
    name: "Dorm",
    type: "residential",
    description: "Your home away from home. A place to rest and recover energy.",
    position: { x: 120, y: 430 },
    size: { width: 180, height: 90 },
    color: 0x4f6d7a, // slate blue
  },
  {
    id: "classroom",
    name: "Classroom",
    type: "academic",
    description: "Where formal lectures happen. Learn foundational concepts from instructors.",
    position: { x: 430, y: 120 },
    size: { width: 220, height: 100 },
    color: 0x7a5c61, // terracotta
  },
  {
    id: "library",
    name: "Library",
    type: "academic",
    description: "Quiet research spaces. Perfect for deep focus and self-study.",
    position: { x: 770, y: 280 },
    size: { width: 180, height: 90 },
    color: 0x6b5b3f, // deep brown
  },
  {
    id: "cafe",
    name: "Cafe",
    type: "social",
    description: "Social hub of campus. Chat with friends and take brain breaks.",
    position: { x: 620, y: 420 },
    size: { width: 160, height: 85 },
    color: 0x8b7355, // warm brown
  },
  {
    id: "lab",
    name: "Lab",
    type: "academic",
    description: "Hands-on experimentation space. Build and test your AI projects here.",
    position: { x: 770, y: 400 },
    size: { width: 190, height: 100 },
    color: 0x5b8c5a, // sage green
  },
  {
    id: "advisor-office",
    name: "Advisor Office",
    type: "support",
    description: "One-on-one guidance. Talk to your academic advisor for course planning.",
    position: { x: 280, y: 120 },
    size: { width: 150, height: 80 },
    color: 0x9b6b7d, // mauve
  },
];

/**
 * Helper function to get a location by ID
 */
export function getLocation(id: string): LocationProfile | undefined {
  return locations.find((loc) => loc.id === id);
}
