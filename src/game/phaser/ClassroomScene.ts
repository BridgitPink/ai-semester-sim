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
 *
 * This class implements createInterior() with classroom-specific content.
 * Course/lesson UI displayed via React overlay components.
 */
export class ClassroomScene extends BuildingSceneBase {
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

    // Description (positioned below title)
    this.addDescriptionText(location.description, 90);

    // Exit instruction (positioned at bottom of inner area)
    this.addFooterText("[ESC] Return to campus", 40);

    // Render interactive objects
    this.renderInteriorObjects();

    console.log(`✓ ClassroomScene created for: ${location.name}`);
  }

  /**
   * Render all interactive objects for this classroom
   * Objects are data-driven from CLASSROOM_OBJECTS
   */
  private renderInteriorObjects() {
    // Store objects for proximity detection
    this.interiorObjects = CLASSROOM_OBJECTS;

    for (const object of CLASSROOM_OBJECTS) {
      // Get world position from relative coordinates
      const worldPos = getObjectWorldPosition(object, this.layout);

      // Default color if not specified
      const color = object.color ?? 0x4a4a4a;

      // Create object rectangle
      const rect = this.add.rectangle(worldPos.x, worldPos.y, object.width, object.height, color);
      rect.setOrigin(0.5);
      rect.setDepth(4);
      rect.setStrokeStyle(2, 0xffffff, 0.5); // White outline for visibility

      // Create label text above/below object
      const labelY = worldPos.y - object.height / 2 - 15;
      const label = this.add.text(worldPos.x, labelY, object.label, {
        fontSize: "14px",
        color: "#ffffff",
        align: "center",
        fontStyle: "bold",
      });
      label.setOrigin(0.5);
      label.setDepth(4);

      console.log(
        `✓ Rendered object: ${object.label} at (${Math.round(worldPos.x)}, ${Math.round(worldPos.y)})`
      );
    }
  }
}
