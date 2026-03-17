import { useGameStore } from "../../store/useGameStore";
import { getLocation } from "../data/locations";
import { getInteriorConfig } from "../data/interiors";
import { getObjectWorldPosition } from "../systems/interiorObjectSystem";
import { isClassroomOpen } from "../systems/timeSystem";
import { BuildingSceneBase } from "./BuildingSceneBase";
import type { InteriorObject } from "../types/interiorObject";

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

    // Filter objects based on building rules (e.g., classroom availability)
    this.interiorObjects = this.filterObjectsByAvailability(buildingId, interiorConfig.objects);
    this.renderInteriorObjects();
    
    // Show closed message for classroom if not open
    if (buildingId === "classroom" && !isClassroomOpen()) {
      this.showClassroomClosedMessage();
    }

    console.log(`✓ InteriorScene created for: ${location.name}`);
  }

  /**
   * Filter objects based on building-specific availability rules
   * For classroom: remove lesson-related objects if classroom is closed
   */
  private filterObjectsByAvailability(buildingId: string, objects: InteriorObject[]): InteriorObject[] {
    if (buildingId !== "classroom") {
      return objects; // No filtering for other buildings
    }

    // If classroom is open, include all objects
    if (isClassroomOpen()) {
      return objects;
    }

    // Classroom is closed: remove lesson-related objects
    const lessonRelatedTypes = ["start-lesson", "review-course", "course-goals"];
    return objects.filter((obj) => !lessonRelatedTypes.includes(obj.interactionType));
  }

  /**
   * Display a "classroom closed" message when classroom is unavailable
   */
  private showClassroomClosedMessage() {
    const closedText = this.add.text(
      this.layout.innerArea.x,
      this.layout.innerArea.y - 80,
      "Classroom is closed",
      {
        fontSize: "24px",
        color: "#ff6b6b",
        align: "center",
        fontStyle: "bold",
      }
    );
    closedText.setOrigin(0.5);
    closedText.setDepth(5);

    const reasonText = this.add.text(
      this.layout.innerArea.x,
      this.layout.innerArea.y - 40,
      "Come back on Monday, Tuesday, or Wednesday before 3 PM",
      {
        fontSize: "13px",
        color: "#cbd5e1",
        align: "center",
      }
    );
    reasonText.setOrigin(0.5);
    reasonText.setDepth(5);
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
      case "sleep-confirm":
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
      case "lab-activity":
        return "[E] Lab Activity";
      default:
        return "";
    }
  }
}