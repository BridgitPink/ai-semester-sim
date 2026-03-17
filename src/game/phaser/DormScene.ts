import { BuildingSceneBase } from "./BuildingSceneBase";
import { useGameStore } from "../../store/useGameStore";
import { getLocation } from "../data/locations";

/**
 * DormScene - Building interior for dormitory/residential spaces
 *
 * Extends BuildingSceneBase to inherit the inner/outer layout system.
 * Template ready for Phase 3+ when dorm interior content is implemented.
 *
 * Currently displays basic title and description using inherited helpers.
 * Future: Add rest/recovery mechanics, messages, inventory UI, etc.
 */
export class DormScene extends BuildingSceneBase {
  constructor() {
    super("DormScene");
  }

  protected createInterior() {
    const store = useGameStore.getState();
    const buildingId = store.currentBuilding;
    const location = getLocation(buildingId || "");

    if (!location) {
      console.error(`DormScene: No location found for building ${buildingId}`);
      this.scene.start("GameScene");
      return;
    }

    // Update inner background to match location color
    const innerBg = this.children.getByName("innerBackground");
    if (innerBg instanceof Phaser.GameObjects.Rectangle) {
      innerBg.setFillStyle(location.color);
    }

    // Title
    this.addTitleText(location.name, 40);

    // Description
    this.addDescriptionText(location.description, 90);

    // Footer
    this.addFooterText("[ESC] Return to campus", 40);

    // TODO Phase 3+: Add dorm-specific UI (rest button, inventory, messages, etc.)

    console.log(`✓ DormScene initialized for: ${location.name}`);
  }
}
