import Phaser from "phaser";

/**
 * PlayerObject - Type for a player rectangle with physics body
 * Used consistently across GameScene and BuildingSceneBase interiors
 */
export type PlayerObject = Phaser.GameObjects.Rectangle & {
  body: Phaser.Physics.Arcade.Body;
};

/**
 * Player creation configuration (optional, for future extensibility)
 */
export interface PlayerConfig {
  spriteKey?: string; // Future: sprite texture key instead of rectangle
  color?: number; // Hex color code (default: 0xffd166 yellow)
  size?: number; // Player size in pixels (default: 28)
}

/**
 * Player constants - shared across all scenes
 */
export const PLAYER_DEFAULTS = {
  SIZE: 28,
  COLOR: 0xffd166, // Bright yellow
  SPEED: 180, // pixels per second
} as const;

/**
 * Create a player object (rectangle with physics body)
 * Reusable factory for consistent player rendering across all scenes
 *
 * @param scene - Phaser scene to add player to
 * @param x - X position
 * @param y - Y position
 * @param config - Optional configuration (spriteKey, color, size)
 * @returns PlayerObject with physics body ready for movement
 */
export function createPlayer(
  scene: Phaser.Scene,
  x: number,
  y: number,
  config?: PlayerConfig
): PlayerObject {
  const color = config?.color ?? PLAYER_DEFAULTS.COLOR;
  const size = config?.size ?? PLAYER_DEFAULTS.SIZE;

  // Create rectangle (for MVP; supports future sprite swap via spriteKey)
  const playerRect = scene.add.rectangle(x, y, size, size, color);

  // Add physics body
  scene.physics.add.existing(playerRect);

  const player = playerRect as PlayerObject;

  // Configure physics body: no gravity, no world collision (scene handles bounds)
  player.body.setAllowGravity(false);
  player.body.setBounce(0, 0);

  return player;
}
