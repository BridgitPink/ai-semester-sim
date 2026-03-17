/**
 * NPC Spawn Placement System
 * 
 * Validates and corrects NPC spawn positions to ensure they don't overlap with buildings
 * or interaction zones. Uses padding buffer to keep NPCs visually clear of walls.
 */

import type { LocationProfile } from "../data/locations";

interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Point {
  x: number;
  y: number;
}

/**
 * Padding buffer (in pixels) around buildings to keep NPCs clear of walls
 */
const BUILDING_PADDING = 15;

/**
 * Padding buffer (in pixels) from screen edges to keep NPCs fully visible
 */
const SCREEN_MARGIN = 20;

/**
 * Get padded bounds for a building (includes safety buffer)
 * Bounds stores the CENTER position and full dimensions
 */
function getPaddedBuildingBounds(
  location: LocationProfile,
  position: Point
): Bounds {
  return {
    x: position.x, // center x
    y: position.y, // center y
    width: location.size.width + BUILDING_PADDING * 2,
    height: location.size.height + BUILDING_PADDING * 2,
  };
}

/**
 * Check if a point is inside a rectangle bounds
 */
function isPointInBounds(point: Point, bounds: Bounds): boolean {
  const halfWidth = bounds.width / 2;
  const halfHeight = bounds.height / 2;
  
  return (
    point.x >= bounds.x - halfWidth &&
    point.x <= bounds.x + halfWidth &&
    point.y >= bounds.y - halfHeight &&
    point.y <= bounds.y + halfHeight
  );
}

/**
 * Check if a point is inside ANY building (with padding)
 */
function isPointInsideAnyBuilding(
  point: Point,
  buildings: Array<{
    location: LocationProfile;
    position: Point;
  }>
): boolean {
  for (const building of buildings) {
    const bounds = getPaddedBuildingBounds(building.location, building.position);
    if (isPointInBounds(point, bounds)) {
      return true;
    }
  }
  return false;
}

/**
 * Check if NPC spawn position is valid (not inside buildings, not off screen)
 */
export function isNpcSpawnValid(
  npcPos: Point,
  buildings: Array<{
    location: LocationProfile;
    position: Point;
  }>,
  canvasBounds: { width: number; height: number }
): boolean {
  // Check if inside building
  if (isPointInsideAnyBuilding(npcPos, buildings)) {
    return false;
  }

  // Check if fully on screen with margin
  if (
    npcPos.x < SCREEN_MARGIN ||
    npcPos.x > canvasBounds.width - SCREEN_MARGIN ||
    npcPos.y < SCREEN_MARGIN ||
    npcPos.y > canvasBounds.height - SCREEN_MARGIN
  ) {
    return false;
  }

  return true;
}

/**
 * Find the nearest safe position for an NPC by spiral search
 * Starts at original position and expands outward in a spiral pattern
 */
export function findNearestSafeNpcPosition(
  originalPos: Point,
  buildings: Array<{
    location: LocationProfile;
    position: Point;
  }>,
  canvasBounds: { width: number; height: number }
): Point {
  // If original position is valid, use it
  if (isNpcSpawnValid(originalPos, buildings, canvasBounds)) {
    return originalPos;
  }

  // Spiral search for nearest safe position
  const maxRadius = Math.max(canvasBounds.width, canvasBounds.height);
  const step = 20; // Search grid step size

  for (let radius = step; radius < maxRadius; radius += step) {
    // Sample 8 directions from the original position
    const directions = [
      { dx: 0, dy: -radius }, // up
      { dx: radius, dy: -radius }, // up-right
      { dx: radius, dy: 0 }, // right
      { dx: radius, dy: radius }, // down-right
      { dx: 0, dy: radius }, // down
      { dx: -radius, dy: radius }, // down-left
      { dx: -radius, dy: 0 }, // left
      { dx: -radius, dy: -radius }, // up-left
    ];

    for (const dir of directions) {
      const candidate = {
        x: originalPos.x + dir.dx,
        y: originalPos.y + dir.dy,
      };

      if (isNpcSpawnValid(candidate, buildings, canvasBounds)) {
        return candidate;
      }
    }
  }

  // Fallback: return a position in the center of the visible area
  // This should rarely happen with reasonable spawn positions
  return {
    x: canvasBounds.width / 2,
    y: canvasBounds.height / 2,
  };
}

/**
 * Validate and correct NPC spawn position
 * Returns the safe position (either original or adjusted)
 */
export function validateNpcSpawn(
  npcPos: Point,
  buildings: Array<{
    location: LocationProfile;
    position: Point;
  }>,
  canvasBounds: { width: number; height: number }
): { position: Point; wasAdjusted: boolean } {
  if (isNpcSpawnValid(npcPos, buildings, canvasBounds)) {
    return { position: npcPos, wasAdjusted: false };
  }

  const safePosition = findNearestSafeNpcPosition(npcPos, buildings, canvasBounds);
  const wasAdjusted =
    Math.abs(safePosition.x - npcPos.x) > 1 || Math.abs(safePosition.y - npcPos.y) > 1;

  return { position: safePosition, wasAdjusted };
}
