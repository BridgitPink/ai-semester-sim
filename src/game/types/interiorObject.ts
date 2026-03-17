/**
 * Interior Object System Types
 *
 * Defines reusable types for interactive objects placed inside building interiors.
 * Objects are data-driven, positioned relative to the inner play area, and trigger
 * interactions via proximity detection + E-key input.
 *
 * Designed to support:
 * - Classroom (lessons, course review)
 * - Lab, Dorm, Cafe, Library, Advisor Office (future buildings)
 * - Extensible interaction types
 */

/**
 * Object interaction types and their behaviors
 */
export type ObjectInteractionType =
  | "start-lesson"
  | "review-course"
  | "practice-exercise"
  | "reference-materials"
  | "course-goals"
  | "leave-classroom";

/**
 * Positioned relative to inner play area center.
 * World coordinates calculated at runtime based on layout.innerArea.
 */
export interface InteriorObject {
  /**
   * Unique identifier for this object
   * Example: "classroom-desk", "classroom-chalkboard"
   */
  id: string;

  /**
   * Building this object belongs to
   * Example: "classroom", "lab", "dorm"
   */
  building: string;

  /**
   * Display name for this object
   * Example: "Wooden Desk"
   */
  name: string;

  /**
   * X position relative to inner area center (-1 = left edge, 0 = center, 1 = right edge)
   * Actual world X calculated as: innerArea.x + (relativeX * innerArea.width / 2)
   */
  relativeX: number;

  /**
   * Y position relative to inner area center (-1 = top edge, 0 = center, 1 = bottom edge)
   * Actual world Y calculated as: innerArea.y + (relativeY * innerArea.height / 2)
   */
  relativeY: number;

  /**
   * Object width in pixels
   */
  width: number;

  /**
   * Object height in pixels
   */
  height: number;

  /**
   * What happens when player interacts with this object
   */
  interactionType: ObjectInteractionType;

  /**
   * Short text label displayed near the object
   */
  label: string;

  /**
   * Optional: Color hex code for object rectangle (e.g., 0x8B4513 for brown)
   * If not provided, defaults to 0x4a4a4a (gray)
   */
  color?: number;

  /**
   * Optional: Additional data passed to interaction handler
   * Example: { courseId: "ai-foundations" } for chalkboard
   */
  metadata?: Record<string, unknown> & {
    description?: string;
  };

  /**
   * Optional: Whether this object blocks player movement (default: false)
   * Objects marked true will use collision detection to block/slide player
   */
  isCollider?: boolean;

  /**
   * Optional: Distance in pixels for soft-collision sliding (default: 5)
   * Only relevant if isCollider is true
   * Higher values = softer sliding, player can move closer to object
   */
  collisionMargin?: number;

  /**
   * Optional: Override proximity interaction distance in pixels.
   * Useful for large furniture or collider objects that should be easy to use.
   */
  interactionRange?: number;
}

/**
 * Authored interior configuration for a specific building.
 */
export interface InteriorConfig {
  building: string;
  objects: InteriorObject[];
}

/**
 * Proximity detection result
 */
export interface ProximityCheckResult {
  objectFound: boolean;
  object?: InteriorObject;
  distance: number;
}
