/**
 * Interior Layout System
 * 
 * Provides reusable layout calculations for building interior scenes.
 * Creates a centered "focus area" within a larger room, improving
 * immersion by avoiding empty space while keeping MVP simple.
 * 
 * Usage:
 *   const layout = createInteriorLayout(sceneWidth, sceneHeight);
 *   // Use layout.innerArea for positioning content
 *   // Use layout styling for outer/inner backgrounds
 */

export interface InnerAreaBounds {
  x: number;      // Center X of inner area
  y: number;      // Center Y of inner area
  width: number;  // Width of inner area
  height: number; // Height of inner area
}

export interface InteriorLayout {
  /** Bounded region where gameplay content should live (60% of screen, centered) */
  innerArea: InnerAreaBounds;
  
  /** Color for outer background (surrounding area) */
  outerColor: number; // Phaser hex color code
  
  /** Helper: Check if point is inside inner bounds */
  isInsideBounds(x: number, y: number): boolean;
  
  /** Helper: Clamp coordinates to stay within inner bounds */
  clampToBounds(x: number, y: number): { x: number; y: number };
  
  /** Helper: Get top-left corner of inner area (useful for containers) */
  getInnerTopLeft(): { x: number; y: number };
  
  /** Helper: Get bottom-right corner of inner area */
  getInnerBottomRight(): { x: number; y: number };
}

/**
 * Create interior layout with:
 * - 60% inner play area, centered
 * - Minimum 500px width to keep UI readable
 * - 20% opacity vignette shadow at edges
 * - 2px border around inner area
 */
export function createInteriorLayout(sceneWidth: number, sceneHeight: number): InteriorLayout {
  // Calculate inner area: 60% of screen, but respect minimum width
  const INNER_RATIO = 0.6;
  const MIN_INNER_WIDTH = 500;
  const OUTER_COLOR = 0x1a1a1a; // Dark gray/black
  
  // Start with 60% calculation
  let innerWidth = sceneWidth * INNER_RATIO;
  let innerHeight = sceneHeight * INNER_RATIO;
  
  // Enforce minimum width, adjust height proportionally to maintain square-ish appearance
  if (innerWidth < MIN_INNER_WIDTH) {
    innerWidth = MIN_INNER_WIDTH;
    innerHeight = Math.min(innerHeight, sceneHeight * 0.8); // Don't exceed 80% height
  }
  
  // Center the inner area
  const innerX = sceneWidth / 2;
  const innerY = sceneHeight / 2;
  
  return {
    innerArea: {
      x: innerX,
      y: innerY,
      width: innerWidth,
      height: innerHeight,
    },
    
    outerColor: OUTER_COLOR,
    
    isInsideBounds(x: number, y: number): boolean {
      const halfWidth = innerWidth / 2;
      const halfHeight = innerHeight / 2;
      return (
        x >= innerX - halfWidth &&
        x <= innerX + halfWidth &&
        y >= innerY - halfHeight &&
        y <= innerY + halfHeight
      );
    },
    
    clampToBounds(x: number, y: number): { x: number; y: number } {
      const halfWidth = innerWidth / 2;
      const halfHeight = innerHeight / 2;
      
      return {
        x: Math.max(innerX - halfWidth, Math.min(x, innerX + halfWidth)),
        y: Math.max(innerY - halfHeight, Math.min(y, innerY + halfHeight)),
      };
    },
    
    getInnerTopLeft(): { x: number; y: number } {
      const halfWidth = innerWidth / 2;
      const halfHeight = innerHeight / 2;
      return {
        x: innerX - halfWidth,
        y: innerY - halfHeight,
      };
    },
    
    getInnerBottomRight(): { x: number; y: number } {
      const halfWidth = innerWidth / 2;
      const halfHeight = innerHeight / 2;
      return {
        x: innerX + halfWidth,
        y: innerY + halfHeight,
      };
    },
  };
}

/**
 * Visual styling configuration for interior scenes
 */
export const InteriorStyling = {
  OUTER_COLOR: 0x1a1a1a,           // Dark background
  BORDER_COLOR: 0x444444,          // Subtle border
  BORDER_WIDTH: 2,                 // 2px border
  SHADOW_OPACITY: 0.2,             // 20% opacity for vignette
  SHADOW_COLOR: 0x000000,          // Black for shadow
};
