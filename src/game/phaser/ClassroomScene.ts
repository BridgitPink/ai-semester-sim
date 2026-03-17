import { BuildingSceneBase } from "./BuildingSceneBase";
import { useGameStore } from "../../store/useGameStore";
import { getLocation } from "../data/locations";

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
    // (Find and update the inner background rectangle we created in base class)
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

    console.log(`✓ ClassroomScene created for: ${location.name}`);
  }
}
