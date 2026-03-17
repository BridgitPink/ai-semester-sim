import Phaser from "phaser";
import { createInteriorLayout, InteriorStyling } from "../systems/interiorLayoutSystem";
import type { InteriorLayout } from "../systems/interiorLayoutSystem";
import {
  checkObjectProximity,
  handleObjectInteraction,
} from "../systems/interiorObjectSystem";
import type { InteriorObject } from "../types/interiorObject";
import { useGameStore } from "../../store/useGameStore";
import { createPlayer, type PlayerObject, PLAYER_DEFAULTS } from "./player";

/**
 * BuildingSceneBase - Abstract base class for all building interior scenes
 *
 * Provides:
 * - Automatic inner/outer layout rendering
 * - Player rendering and movement with bounds clamping
 * - Consistent styling across all building interiors
 * - Event handling (ESC to exit)
 * - Subclasses only implement createInterior() for unique content
 *
 * Architecture:
 *   create() calls setupLayout() → drawOuterArea() → drawInnerArea() → setupPlayer() → createInterior() → setupInputHandlers()
 *   update() handles player movement with inner-area bounds clamping
 *   Subclasses extend and implement createInterior() with their specific UI
 */
export abstract class BuildingSceneBase extends Phaser.Scene {
  protected layout!: InteriorLayout;
  protected player!: PlayerObject;
  protected interiorObjects: InteriorObject[] = [];

  // Keyboard input
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasdKeys!: {
    w: Phaser.Input.Keyboard.Key;
    a: Phaser.Input.Keyboard.Key;
    s: Phaser.Input.Keyboard.Key;
    d: Phaser.Input.Keyboard.Key;
  };

  constructor(sceneKey: string) {
    super(sceneKey);
  }

  init() {
    // To be overridden by subclasses if needed
  }

  create() {
    // Setup layout calculations
    this.setupLayout();

    // Draw outer area (dark background filling screen)
    this.drawOuterArea();

    // Draw inner area (bordered focus region)
    this.drawInnerArea();

    // Setup keyboard input BEFORE player so keys are ready
    this.setupKeyboardInput();

    // Create player at center of inner area
    this.setupPlayer();

    // Draw scene-specific content (to be implemented by subclasses)
    this.createInterior();

    // Setup input handlers (ESC to exit, etc.)
    this.setupInputHandlers();

    this.events.emit("building-scene-created", { sceneKey: this.scene.key });
  }

  update() {
    if (!this.player?.body) return;

    const speed = PLAYER_DEFAULTS.SPEED; // 180 px/sec
    let vx = 0;
    let vy = 0;

    // Arrow keys
    if (this.cursors.left?.isDown) vx -= 1;
    if (this.cursors.right?.isDown) vx += 1;
    if (this.cursors.up?.isDown) vy -= 1;
    if (this.cursors.down?.isDown) vy += 1;

    // WASD keys
    if (this.wasdKeys.a?.isDown) vx -= 1;
    if (this.wasdKeys.d?.isDown) vx += 1;
    if (this.wasdKeys.w?.isDown) vy -= 1;
    if (this.wasdKeys.s?.isDown) vy += 1;

    // Normalize velocity and apply speed
    if (vx !== 0 || vy !== 0) {
      const magnitude = Math.sqrt(vx * vx + vy * vy);
      this.player.body.setVelocity(
        (vx / magnitude) * speed,
        (vy / magnitude) * speed
      );
    } else {
      this.player.body.setVelocity(0, 0);
    }

    // Clamp player position to inner play area bounds
    const clamped = this.layout.clampToBounds(this.player.x, this.player.y);
    this.player.setPosition(clamped.x, clamped.y);
  }

  /**
   * Setup keyboard input (called in create() before player setup)
   */
  private setupKeyboardInput() {
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.wasdKeys = this.input.keyboard!.addKeys({
      w: Phaser.Input.Keyboard.KeyCodes.W,
      a: Phaser.Input.Keyboard.KeyCodes.A,
      s: Phaser.Input.Keyboard.KeyCodes.S,
      d: Phaser.Input.Keyboard.KeyCodes.D,
    }) as {
      w: Phaser.Input.Keyboard.Key;
      a: Phaser.Input.Keyboard.Key;
      s: Phaser.Input.Keyboard.Key;
      d: Phaser.Input.Keyboard.Key;
    };
  }

  /**
   * Create player at center of inner play area
   * Player is visible and ready for movement immediately after scene loads
   */
  protected setupPlayer() {
    // Spawn at center of inner area (pure center, no offset)
    const spawnX = this.layout.innerArea.x;
    const spawnY = this.layout.innerArea.y;

    // Create player using factory function (consistent styling across all scenes)
    this.player = createPlayer(this, spawnX, spawnY);

    // Set depth to render above backgrounds (depth 2) and borders (depth 3)
    this.player.setDepth(5);

    console.log(
      `✓ Player created at (${Math.round(spawnX)}, ${Math.round(spawnY)}) inside inner area`
    );
  }

  /**
   * Calculate layout based on scene dimensions
   */
  protected setupLayout() {
    this.layout = createInteriorLayout(this.scale.width, this.scale.height);
  }

  /**
   * Draw outer area: full-screen dark background
   */
  protected drawOuterArea() {
    const outerBg = this.add.rectangle(
      this.scale.width / 2,
      this.scale.height / 2,
      this.scale.width,
      this.scale.height,
      this.layout.outerColor
    );
    outerBg.setOrigin(0.5);
    outerBg.setDepth(0);
  }

  /**
   * Draw inner area: bordered focus region with shadow effect
   */
  protected drawInnerArea() {
    const { innerArea } = this.layout;

    // Layer 1: Vignette shadow (20% opacity overlay at edges)
    const vignetteOverlay = this.add.rectangle(
      this.scale.width / 2,
      this.scale.height / 2,
      this.scale.width,
      this.scale.height,
      InteriorStyling.SHADOW_COLOR,
      InteriorStyling.SHADOW_OPACITY
    );
    vignetteOverlay.setOrigin(0.5);
    vignetteOverlay.setDepth(1);

    // Layer 2: Inner background (will be colored by subclass via location data)
    const innerBg = this.add.rectangle(
      innerArea.x,
      innerArea.y,
      innerArea.width,
      innerArea.height,
      0x2a2a2a // Default dark; subclasses can override this
    );
    innerBg.setOrigin(0.5);
    innerBg.setDepth(2);
    innerBg.setName("innerBackground"); // Named for easy reference by subclasses

    // Layer 3: Border outline (2px subtle gray)
    const border = this.add.rectangle(
      innerArea.x,
      innerArea.y,
      innerArea.width,
      innerArea.height,
      0x000000,
      0 // Transparent fill, only stroke
    );
    border.setOrigin(0.5);
    border.setStrokeStyle(InteriorStyling.BORDER_WIDTH, InteriorStyling.BORDER_COLOR);
    border.setDepth(3);
  }

  /**
   * Abstract method: subclasses implement their unique interior UI here
   * Content should be positioned using `this.layout.innerArea` for consistent positioning
   */
  protected abstract createInterior(): void;

  /**
   * Setup input handlers (ESC to exit, E for object interaction)
   */
  protected setupInputHandlers() {
    this.input.keyboard?.on("keydown-ESC", () => {
      this.exitBuilding();
    });

    this.input.keyboard?.on("keydown-E", () => {
      this.checkAndHandleObjectInteraction();
    });
  }

  /**
   * Check proximity to interior objects and handle interaction if nearby
   * Called when player presses E key
   */
  protected checkAndHandleObjectInteraction() {
    if (this.interiorObjects.length === 0 || !this.player) {
      return;
    }

    // Check proximity to all objects
    const result = checkObjectProximity(
      this.interiorObjects,
      this.layout,
      this.player.x,
      this.player.y
    );

    // If object found within threshold, handle interaction
    if (result.objectFound && result.object) {
      handleObjectInteraction(result.object);
    }
  }

  /**
   * Exit building and return to GameScene
   */
  protected exitBuilding() {
    const store = useGameStore.getState();
    store.exitBuilding();

    // Return to GameScene with fade transition
    this.cameras.main.fade(300, 0, 0, 0, false, () => {
      this.scene.start("GameScene");
    });
  }

  /**
   * Helper: Position text at top of inner area
   */
  protected addTitleText(text: string, yOffset: number = 40): Phaser.GameObjects.Text {
    return this.add
      .text(this.layout.innerArea.x, this.layout.innerArea.y - this.layout.innerArea.height / 2 + yOffset, text, {
        fontSize: "32px",
        color: "#ffffff",
        fontStyle: "bold",
        align: "center",
      })
      .setOrigin(0.5)
      .setDepth(4);
  }

  /**
   * Helper: Position descriptive text below title
   */
  protected addDescriptionText(text: string, yOffset: number = 90): Phaser.GameObjects.Text {
    return this.add
      .text(this.layout.innerArea.x, this.layout.innerArea.y - this.layout.innerArea.height / 2 + yOffset, text, {
        fontSize: "14px",
        color: "#cccccc",
        align: "center",
        wordWrap: { width: this.layout.innerArea.width - 40 },
      })
      .setOrigin(0.5)
      .setDepth(4);
  }

  /**
   * Helper: Position text at bottom of inner area
   */
  protected addFooterText(text: string, yOffset: number = 40): Phaser.GameObjects.Text {
    return this.add
      .text(this.layout.innerArea.x, this.layout.innerArea.y + this.layout.innerArea.height / 2 - yOffset, text, {
        fontSize: "14px",
        color: "#888888",
        align: "center",
        fontStyle: "italic",
      })
      .setOrigin(0.5)
      .setDepth(4);
  }
}
