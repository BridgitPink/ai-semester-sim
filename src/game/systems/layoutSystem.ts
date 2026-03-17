/**
 * Layout positioning system for responsive, canvas-size-aware building and NPC placement
 * 
 * Converts relative positions (0.0-1.0) into pixel coordinates based on actual
 * Phaser canvas dimensions at runtime.
 * 
 * This maintains the natural, intentional layout across all viewport sizes.
 */

import { relativeLocationLayout } from "../data/locations";
import { relativeNpcLayout } from "../data/npcs";

/**
 * Compute responsive layout for locations and NPCs at runtime
 * @param canvasWidth Current Phaser scene width
 * @param canvasHeight Current Phaser scene height
 * @returns Object with functions to get computed positions for locations and NPCs
 */
export function computeResponsiveLayout(canvasWidth: number, canvasHeight: number) {
  /**
   * Get computed pixel position for a location by ID
   * @param locationId Location ID to look up
   * @returns Pixel coordinates { x, y } or undefined if not found
   */
  function getLocationPosition(locationId: string): { x: number; y: number } | undefined {
    const relative = relativeLocationLayout[locationId];
    if (!relative) return undefined;
    return {
      x: Math.round(canvasWidth * relative.x),
      y: Math.round(canvasHeight * relative.y),
    };
  }

  /**
   * Get computed pixel position for an NPC by ID
   * @param npcId NPC ID to look up
   * @returns Pixel coordinates { x, y } or undefined if not found
   */
  function getNpcPosition(npcId: string): { x: number; y: number } | undefined {
    const relative = relativeNpcLayout[npcId];
    if (!relative) return undefined;
    return {
      x: Math.round(canvasWidth * relative.x),
      y: Math.round(canvasHeight * relative.y),
    };
  }

  /**
   * Get all location positions as a map
   */
  function getAllLocationPositions(): Record<string, { x: number; y: number }> {
    const result: Record<string, { x: number; y: number }> = {};
    for (const locationId in relativeLocationLayout) {
      const pos = getLocationPosition(locationId);
      if (pos) result[locationId] = pos;
    }
    return result;
  }

  /**
   * Get all NPC positions as a map
   */
  function getAllNpcPositions(): Record<string, { x: number; y: number }> {
    const result: Record<string, { x: number; y: number }> = {};
    for (const npcId in relativeNpcLayout) {
      const pos = getNpcPosition(npcId);
      if (pos) result[npcId] = pos;
    }
    return result;
  }

  return {
    getLocationPosition,
    getNpcPosition,
    getAllLocationPositions,
    getAllNpcPositions,
  };
}
