/**
 * MVP Location definitions - 6 campus locations where interactions happen
 * 
 * Positions defined as relative coordinates (0.0-1.0) in `relativeLayout` constant below.
 * Actual pixel positions computed at runtime based on canvas dimensions.
 */

export interface LocationProfile {
  id: string;
  name: string;
  type: "residential" | "academic" | "social" | "support";
  description: string;
  size: { width: number; height: number };
  color: number; // Phaser color code (hex as number)
}

export const locations: LocationProfile[] = [
  // Hand-authored campus layout - natural placement avoiding grid alignment
  // Dorm anchors lower-left as home base
  {
    id: "dorm",
    name: "Dorm",
    type: "residential",
    description: "Your home away from home. A place to rest and recover energy.",
    size: { width: 180, height: 90 },
    color: 0x4f6d7a, // slate blue
  },
  // Advisor sits upper-left, separate and quiet
  {
    id: "advisor-office",
    name: "Advisor Office",
    type: "support",
    description: "One-on-one guidance. Talk to your academic advisor for course planning.",
    size: { width: 150, height: 80 },
    color: 0x9b6b7d, // mauve
  },
  // Classroom as academic core, slightly left of center, upper area
  {
    id: "classroom",
    name: "Classroom",
    type: "academic",
    description: "Where formal lectures happen. Learn foundational concepts from instructors.",
    size: { width: 220, height: 100 },
    color: 0x7a5c61, // terracotta
  },
  // Library in right-upper area, varied depth
  {
    id: "library",
    name: "Library",
    type: "academic",
    description: "Quiet research spaces. Perfect for deep focus and self-study.",
    size: { width: 180, height: 90 },
    color: 0x6b5b3f, // deep brown
  },
  // Cafe as social hub, center-right in middle area
  {
    id: "cafe",
    name: "Cafe",
    type: "social",
    description: "Social hub of campus. Chat with friends and take brain breaks.",
    size: { width: 160, height: 85 },
    color: 0x8b7355, // warm brown
  },
  // Campus Store near social/academic edge for quick supply runs
  {
    id: "campus-store",
    name: "Campus Store",
    type: "support",
    description: "Grab supplies, study gear, and campus merch between classes.",
    size: { width: 165, height: 85 },
    color: 0x9b7b4f, // tan brown
  },
  // Campus Food Area as a larger social and dining hub
  {
    id: "campus-food",
    name: "Campus Food Area",
    type: "social",
    description: "Order food, recharge, and hang out with other students.",
    size: { width: 190, height: 90 },
    color: 0x8c6a3d, // toasted brown
  },
  // Lab on right side, lower area
  {
    id: "lab",
    name: "Lab",
    type: "academic",
    description: "Hands-on experimentation space. Build and test your AI projects here.",
    size: { width: 190, height: 100 },
    color: 0x5b8c5a, // sage green
  },
];

/**
 * Relative layout - defines normalized position (0.0-1.0) for each location
 * Actual pixel positions computed at runtime: x = width * relativeLayout[id].x
 */
export const relativeLocationLayout: Record<string, { x: number; y: number }> = {
  dorm: { x: 0.15, y: 0.78 },
  "advisor-office": { x: 0.20, y: 0.19 },
  classroom: { x: 0.40, y: 0.20 },
  library: { x: 0.80, y: 0.32 },
  cafe: { x: 0.65, y: 0.59 },
  "campus-store": { x: 0.47, y: 0.62 },
  "campus-food": { x: 0.32, y: 0.44 },
  lab: { x: 0.85, y: 0.83 },
};

/**
 * Helper function to get a location by ID
 */
export function getLocation(id: string): LocationProfile | undefined {
  return locations.find((loc) => loc.id === id);
}
