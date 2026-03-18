import Phaser from "phaser";
import { createInteriorLayout, InteriorStyling } from "../systems/interiorLayoutSystem";
import type { InteriorLayout } from "../systems/interiorLayoutSystem";
import {
  checkObjectProximity,
  handleObjectInteraction,
  checkCollisionsAndSlide,
} from "../systems/interiorObjectSystem";
import type { InteriorObject } from "../types/interiorObject";
import { useGameStore } from "../../store/useGameStore";
import { createPlayer, type PlayerObject, PLAYER_DEFAULTS } from "./player";
import { isUIInputCaptured } from "../systems/uiInputCapture";

/**
 * BuildingSceneBase - Abstract base class for all building interior scenes
 *
 * Provides:
 * - Automatic inner/outer layout rendering
 * - Player rendering and movement with bounds clamping
 * - Consistent styling across all building interiors
 * - Event handling (E to interact)
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

  // Proximity tracking (updated each frame for UI feedback)
  protected proximityResult: ReturnType<typeof checkObjectProximity> | null = null;

  // Keyboard input
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasdKeys!: {
    w: Phaser.Input.Keyboard.Key;
    a: Phaser.Input.Keyboard.Key;
    s: Phaser.Input.Keyboard.Key;
    d: Phaser.Input.Keyboard.Key;
  };

  // Tracks whether we've disabled Phaser keyboard capture due to UI typing focus.
  private keyboardCaptureDisabledForUI = false;

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

    // Setup input handlers (E to interact, etc.)
    this.setupInputHandlers();

    // Safety: if the Scene shuts down while a DOM input is focused, ensure
    // keyboard capture is restored for the next Scene.
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.input.keyboard?.enableGlobalCapture();
      this.keyboardCaptureDisabledForUI = false;
    });

    this.events.emit("building-scene-created", { sceneKey: this.scene.key });
  }

  update() {
    if (!this.player?.body) return;

    // If a DOM input is focused, let the browser handle key events for typing.
    // Phaser key captures (enableCapture=true by default) can prevent characters
    // like WASD/Tab from reaching the focused input.
    const captured = isUIInputCaptured();
    if (captured && !this.keyboardCaptureDisabledForUI) {
      this.input.keyboard?.disableGlobalCapture();
      this.keyboardCaptureDisabledForUI = true;
    } else if (!captured && this.keyboardCaptureDisabledForUI) {
      this.input.keyboard?.enableGlobalCapture();
      this.keyboardCaptureDisabledForUI = false;
    }

    // When the user is actively typing in an input/textarea/contenteditable element,
    // ignore gameplay movement controls.
    if (captured) {
      this.player.body.setVelocity(0, 0);
    }

    if (!captured) {
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
    }

    // Calculate next position (current + velocity delta)
    let nextX = this.player.x + (this.player.body.velocity.x * 16.67) / 1000; // ~16.67ms per frame at 60fps
    let nextY = this.player.y + (this.player.body.velocity.y * 16.67) / 1000;

    // Check collisions with interior objects and apply soft-sliding
    const collisionAdjusted = checkCollisionsAndSlide(
      this.interiorObjects,
      this.layout,
      nextX,
      nextY
    );
    nextX = collisionAdjusted.x;
    nextY = collisionAdjusted.y;

    // Clamp player position to inner play area bounds (safety net)
    const clamped = this.layout.clampToBounds(nextX, nextY);
    this.player.setPosition(clamped.x, clamped.y);

    // Update proximity tracking for UI feedback (e.g., interaction hints)
    this.proximityResult = checkObjectProximity(
      this.interiorObjects,
      this.layout,
      clamped.x,
      clamped.y
    );

    // Allow subclasses to update proximity-based UI
    this.updateProximityUI();
  }

  /**
   * Optional hook: subclasses can implement this to update proximity-based UI
   * Called each frame after proximity check completes
   */
  protected updateProximityUI(): void {
    // To be overridden by subclasses
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
   * Setup input handlers (E for object interaction)
   */
  protected setupInputHandlers() {
    this.input.keyboard?.on("keydown-E", () => {
      if (isUIInputCaptured()) return;
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

      // Special case: exit interaction requires scene transition (not just store update)
      if (result.object.interactionType === "leave-classroom") {
        this.cameras.main.fade(300, 0, 0, 0, false, () => {
          this.scene.start("GameScene");
        });
      }
    }
  }

  /**
   * Exit building and return to GameScene
   */
  protected exitBuilding() {
    const store = useGameStore.getState();
    // Save player position BEFORE calling exitBuilding(), which clears it from the store.
    // GameScene.init() will receive this and restore the player at the correct spot.
    const savedPos = store.playerPosition;
    store.exitBuilding();

    // Return to GameScene with fade transition, restoring player's last overworld position.
    this.cameras.main.fade(300, 0, 0, 0, false, () => {
      this.scene.start(
        "GameScene",
        savedPos ? { playerX: savedPos.x, playerY: savedPos.y } : {}
      );
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
