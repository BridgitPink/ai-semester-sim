import { useGameStore } from "../../store/useGameStore";
import { getLocation } from "../data/locations";
import { getInteriorConfig } from "../data/interiors";
import { getObjectWorldPosition } from "../systems/interiorObjectSystem";
import { BuildingSceneBase } from "./BuildingSceneBase";

export class InteriorScene extends BuildingSceneBase {
  private objectLabels: Map<string, Phaser.GameObjects.Text> = new Map();
  private objectHints: Map<string, Phaser.GameObjects.Text> = new Map();

  constructor() {
    super("InteriorScene");
  }

  protected createInterior() {
    const store = useGameStore.getState();
    const buildingId = store.currentBuilding;

    if (!buildingId) {
      console.error("InteriorScene: currentBuilding is missing");
      this.scene.start("GameScene");
      return;
    }

    const location = getLocation(buildingId);
    const interiorConfig = getInteriorConfig(buildingId);

    if (!location || !interiorConfig) {
      console.error(`InteriorScene: No config found for building ${buildingId}`);
      this.scene.start("GameScene");
      return;
    }

    const innerBg = this.children.getByName("innerBackground");
    if (innerBg instanceof Phaser.GameObjects.Rectangle) {
      innerBg.setFillStyle(location.color);
    }

    this.addTitleText(location.name, 40);
    this.addFooterText("[ESC] Return to campus", 40);

    this.interiorObjects = interiorConfig.objects;
    this.renderInteriorObjects();

    console.log(`✓ InteriorScene created for: ${location.name}`);
  }

  private renderInteriorObjects() {
    this.objectLabels.clear();
    this.objectHints.clear();

    for (const object of this.interiorObjects) {
      const worldPos = getObjectWorldPosition(object, this.layout);
      const color = object.color ?? 0x4a4a4a;

      const rect = this.add.rectangle(worldPos.x, worldPos.y, object.width, object.height, color);
      rect.setOrigin(0.5);
      rect.setDepth(4);

      if (object.isCollider) {
        rect.setStrokeStyle(3, 0xffff99, 0.8);
      } else {
        rect.setStrokeStyle(2, 0xffffff, 0.5);
      }

      const label = this.add.text(worldPos.x, worldPos.y - object.height / 2 - 20, object.label, {
        fontSize: "14px",
        color: "#ffffff",
        align: "center",
        fontStyle: "bold",
      });
      label.setOrigin(0.5);
      label.setDepth(5);
      label.setBackgroundColor("#00000088");
      label.setPadding(4, 6);
      label.setVisible(false);
      this.objectLabels.set(object.id, label);

      const hintText = this.getHintText(object.interactionType);
      if (!hintText) continue;

      const hint = this.add.text(worldPos.x, worldPos.y + object.height / 2 + 15, hintText, {
        fontSize: "12px",
        color: "#ffff99",
        align: "center",
        fontStyle: "bold",
      });
      hint.setOrigin(0.5);
      hint.setDepth(5);
      hint.setVisible(false);
      this.objectHints.set(object.id, hint);
    }
  }

  protected updateProximityUI(): void {
    if (!this.proximityResult?.objectFound || !this.proximityResult.object) {
      this.objectLabels.forEach((label) => label.setVisible(false));
      this.objectHints.forEach((hint) => hint.setVisible(false));
      return;
    }

    const closestObjectId = this.proximityResult.object.id;

    this.objectLabels.forEach((label, id) => {
      label.setVisible(id === closestObjectId);
    });
    this.objectHints.forEach((hint, id) => {
      hint.setVisible(id === closestObjectId);
    });
  }

  private getHintText(interactionType: string): string {
    switch (interactionType) {
      case "start-lesson":
        return "[E] Start lesson";
      case "review-course":
        return "[E] Review course";
      case "practice-exercise":
        return "[E] Practice";
      case "reference-materials":
        return "[E] Reference";
      case "course-goals":
        return "[E] Course goals";
      case "leave-classroom":
        return "[E] Exit";
      case "sleep":
        return "[E] Sleep";
      case "study":
        return "[E] Study";
      case "storage":
        return "[E] Storage";
      case "view-tasks":
        return "[E] Tasks";
      case "roommate-bed":
        return "[E] Roommate's Bed";
      case "roommate-desk":
        return "[E] Roommate's Desk";
      case "roommate-storage":
        return "[E] Roommate's Storage";
      default:
        return "";
    }
  }
}