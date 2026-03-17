import { BuildingSceneBase } from "./BuildingSceneBase";
import { useGameStore } from "../../store/useGameStore";
import { getLocation } from "../data/locations";
import { CLASSROOM_OBJECTS } from "../data/interiorObjects";
import { getObjectWorldPosition } from "../systems/interiorObjectSystem";

/**
 * ClassroomScene - Building interior for classroom/lecture spaces
 *
 * Extends BuildingSceneBase to inherit:
 * - Inner/outer area layout (60% centered play area)
 * - Automatic border + shadow rendering
 * - Consistent styling and input handling
 * - Proximity tracking each frame
 *
 * This class implements createInterior() with classroom-specific content.
 * Implements updateProximityUI() to show/hide interaction hints based on player proximity.
 * Course/lesson UI displayed via React overlay components.
 */
export class ClassroomScene extends BuildingSceneBase {
  // Store label and hint text objects for dynamic visibility toggling
  private objectLabels: Map<string, Phaser.GameObjects.Text> = new Map();
  private objectHints: Map<string, Phaser.GameObjects.Text> = new Map();

  constructor() {
    super("ClassroomScene");
  }

  protected createInterior() {
    const store = useGameStore.getState();
    const buildingId = store.currentBuilding;
    const location = getLocation(buildingId || "");

    if (!location) {
      console.error(`ClassroomScene: No location found for building ${buildingId}`);
      this.scene.start("GameScene");
      return;
    }

    // Update inner background to match location color
    const innerBg = this.children.getByName("innerBackground");
    if (innerBg instanceof Phaser.GameObjects.Rectangle) {
      innerBg.setFillStyle(location.color);
    }

    // Title with building name (positioned at top of inner area)
    this.addTitleText(location.name, 40);

    // Exit instruction (positioned at bottom of inner area)
    this.addFooterText("[ESC] Return to campus", 40);

    // Render interactive objects
    this.renderInteriorObjects();

    console.log(`✓ ClassroomScene created for: ${location.name}`);
  }

  /**
   * Render all interactive objects for this classroom
   * Objects are data-driven from CLASSROOM_OBJECTS
   * 
   * Creates:
   * - Object rectangles with visual hierarchy (color + size)
   * - Object label text (hidden by default, shown on proximity)
   * - Interaction hint text (hidden by default, shown on proximity)
   */
  private renderInteriorObjects() {
    // Store objects for proximity detection
    this.interiorObjects = CLASSROOM_OBJECTS;

    for (const object of CLASSROOM_OBJECTS) {
      // Get world position from relative coordinates
      const worldPos = getObjectWorldPosition(object, this.layout);

      // Get object color (fallback to gray)
      const color = object.color ?? 0x4a4a4a;

      // Create object rectangle
      const rect = this.add.rectangle(worldPos.x, worldPos.y, object.width, object.height, color);
      rect.setOrigin(0.5);
      rect.setDepth(4);

      // Visual styling for collision vs non-collision objects
      if (object.isCollider) {
        rect.setStrokeStyle(3, 0xffff99, 0.8); // Bright yellow-white for collision
      } else {
        rect.setStrokeStyle(2, 0xffffff, 0.5); // Subtle white for non-collision
      }

      // Create object label text (initially hidden, shown on proximity)
      const labelY = worldPos.y - object.height / 2 - 20;
      const label = this.add.text(worldPos.x, labelY, object.label, {
        fontSize: "14px",
        color: "#ffffff",
        align: "center",
        fontStyle: "bold",
      });
      label.setOrigin(0.5);
      label.setDepth(5); // Above objects
      label.setBackgroundColor("#00000088"); // Semi-transparent background for readability
      label.setPadding(4, 6);
      label.setVisible(false); // Hidden by default, shown by proximity system
      
      // Store reference for proximity-based toggling
      this.objectLabels.set(object.id, label);

      // Create hint text for interactive objects (initially hidden)
      let hintText = "";
      
      switch (object.interactionType) {
        case "start-lesson":
          hintText = "[E] Start lesson";
          break;
        case "review-course":
          hintText = "[E] Review course";
          break;
        case "practice-exercise":
          hintText = "[E] Practice";
          break;
        case "reference-materials":
          hintText = "[E] Reference";
          break;
        case "course-goals":
          hintText = "[E] Course goals";
          break;
        case "leave-classroom":
          hintText = "[E] Exit";
          break;
      }

      if (hintText) {
        const hintY = worldPos.y + object.height / 2 + 15;
        const hint = this.add.text(worldPos.x, hintY, hintText, {
          fontSize: "12px",
          color: "#ffff99",
          align: "center",
          fontStyle: "bold",
        });
        hint.setOrigin(0.5);
        hint.setDepth(5);
        hint.setVisible(false); // Hidden by default, shown by proximity system
        
        // Store reference for proximity-based toggling
        this.objectHints.set(object.id, hint);
      }

      console.log(
        `✓ Rendered object: ${object.label} at (${Math.round(worldPos.x)}, ${Math.round(
          worldPos.y
        )})${object.isCollider ? " [COLLIDER]" : ""}`
      );
    }
  }

  /**
   * Update proximity-based UI: show/hide labels and hints based on player distance
   * Called each frame after proximity check completes (from BuildingSceneBase.update)
   */
  protected updateProximityUI(): void {
    if (!this.proximityResult) {
      // No proximity data, hide all labels and hints
      this.objectLabels.forEach((label) => label.setVisible(false));
      this.objectHints.forEach((hint) => hint.setVisible(false));
      return;
    }

    // If object found within threshold, show its label and hint
    if (this.proximityResult.objectFound && this.proximityResult.object) {
      const closestObjectId = this.proximityResult.object.id;
      
      // Show label and hint for closest object
      const label = this.objectLabels.get(closestObjectId);
      if (label) label.setVisible(true);
      
      const hint = this.objectHints.get(closestObjectId);
      if (hint) hint.setVisible(true);
      
      // Hide all other labels and hints
      this.objectLabels.forEach((l, id) => {
        if (id !== closestObjectId) l.setVisible(false);
      });
      this.objectHints.forEach((h, id) => {
        if (id !== closestObjectId) h.setVisible(false);
      });
    } else {
      // No object in range, hide all labels and hints
      this.objectLabels.forEach((label) => label.setVisible(false));
      this.objectHints.forEach((hint) => hint.setVisible(false));
    }
  }
}

