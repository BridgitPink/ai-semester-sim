import Phaser from "phaser";
import { createInteriorLayout, InteriorStyling } from "../systems/interiorLayoutSystem";
import type { InteriorLayout } from "../systems/interiorLayoutSystem";
import { useGameStore } from "../../store/useGameStore";

/**
 * BuildingSceneBase - Abstract base class for all building interior scenes
 * 
 * Provides:
 * - Automatic inner/outer layout rendering
 * - Consistent styling across all building interiors
 * - Event handling (ESC to exit)
 * - Subclasses only implement createInterior() for unique content
 * 
 * Architecture:
 *   create() calls setupLayout() → drawOuterArea() → drawInnerArea() → createInterior()
 *   Subclasses extend and implement createInterior() with their specific UI
 */
export abstract class BuildingSceneBase extends Phaser.Scene {
  protected layout!: InteriorLayout;

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

    // Draw scene-specific content (to be implemented by subclasses)
    this.createInterior();

    // Setup input handlers
    this.setupInputHandlers();

    this.events.emit("building-scene-created", { sceneKey: this.scene.key });
  }

  update() {
    // To be overridden by subclasses if needed
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
   * Setup input handlers (ESC to exit, etc.)
   */
  protected setupInputHandlers() {
    this.input.keyboard?.on("keydown-ESC", () => {
      this.exitBuilding();
    });
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
