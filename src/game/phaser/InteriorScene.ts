import { useGameStore } from "../../store/useGameStore";
import { getLocation } from "../data/locations";
import { getInteriorConfig } from "../data/interiors";
import { getObjectWorldPosition } from "../systems/interiorObjectSystem";
import { isClassroomOpen } from "../systems/timeSystem";
import { BuildingSceneBase } from "./BuildingSceneBase";
import type { InteriorObject } from "../types/interiorObject";
import { decideNpcNow } from "../systems/npcSystem";

export class InteriorScene extends BuildingSceneBase {
  private objectLabels: Map<string, Phaser.GameObjects.Text> = new Map();
  private objectHints: Map<string, Phaser.GameObjects.Text> = new Map();

  // Wandering NPC tracking
  private npcWanderingSprites: Map<string, Phaser.GameObjects.Rectangle> = new Map();
  private npcWanderAnchors: Map<string, { wx: number; wy: number }> = new Map();
  private npcWanderTargets: Map<string, { tx: number; ty: number }> = new Map();
  private npcWanderRadii: Map<string, number> = new Map();
  private lastNpcWanderTick: number = -1;

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
    this.addFooterText("Use [E] on an exit object to leave", 40);

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
    // Pass 1 — schedule-aware NPC filter (all buildings).
    // A talk-npc object is only shown when the NPC's current AI decision routes them here.
    const withNpcs = objects.filter((obj) => {
      if (obj.interactionType !== "talk-npc") return true;
      const npcId = obj.metadata?.npcId;
      if (!npcId) return true;
      try {
        const decision = decideNpcNow(npcId);
        return decision?.locationId === buildingId;
      } catch {
        return true; // keep on any error to avoid accidental removal
      }
    });

    // Pass 2 — classroom lesson filter (Phase 4, unchanged).
    if (buildingId !== "classroom") return withNpcs;
    if (isClassroomOpen()) return withNpcs;

    const lessonRelatedTypes = ["start-lesson", "review-course", "course-goals"];
    return withNpcs.filter((obj) => !lessonRelatedTypes.includes(obj.interactionType));
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
    this.npcWanderingSprites.clear();
    this.npcWanderAnchors.clear();
    this.npcWanderTargets.clear();
    this.npcWanderRadii.clear();
    this.lastNpcWanderTick = -1;

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

      if (object.metadata?.wandering === true) {
        this.npcWanderingSprites.set(object.id, rect);
        this.npcWanderAnchors.set(object.id, { wx: worldPos.x, wy: worldPos.y });
        this.npcWanderTargets.set(object.id, { tx: worldPos.x, ty: worldPos.y });
        const r = typeof object.metadata.wanderRadius === "number" ? object.metadata.wanderRadius : 28;
        this.npcWanderRadii.set(object.id, r);
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

  update() {
    super.update();
    this.tickNpcWander();
  }

  private tickNpcWander() {
    const WANDER_INTERVAL = 2500; // ms between target picks
    const LERP_SPEED = 0.04;      // fraction per frame toward target

    const tick = Math.floor(this.time.now / WANDER_INTERVAL);
    if (tick !== this.lastNpcWanderTick) {
      this.lastNpcWanderTick = tick;
      let i = 0;
      for (const [id, anchor] of this.npcWanderAnchors) {
        const radius = this.npcWanderRadii.get(id) ?? 28;
        // Deterministic pseudo-random angle and distance
        const seed = tick * 31337 + id.charCodeAt(0) * 421 + i * 199;
        const angle = ((seed % 10000) / 10000) * Math.PI * 2;
        const dist = radius * (((seed % 1000) / 1000) * 0.7 + 0.3);
        this.npcWanderTargets.set(id, {
          tx: anchor.wx + Math.cos(angle) * dist,
          ty: anchor.wy + Math.sin(angle) * dist,
        });
        i++;
      }
    }

    for (const [id, sprite] of this.npcWanderingSprites) {
      const target = this.npcWanderTargets.get(id);
      if (!target) continue;
      sprite.setPosition(
        Phaser.Math.Linear(sprite.x, target.tx, LERP_SPEED),
        Phaser.Math.Linear(sprite.y, target.ty, LERP_SPEED)
      );
      // Keep label and hint anchored to the drifting sprite
      const label = this.objectLabels.get(id);
      const hint = this.objectHints.get(id);
      if (label) label.setPosition(sprite.x, sprite.y - sprite.height / 2 - 20);
      if (hint) hint.setPosition(sprite.x, sprite.y + sprite.height / 2 + 15);
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
      case "talk-npc":
        return "[E] Talk";
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
      case "shop-shelf":
        return "[E] Browse Shelf";
      case "checkout":
        return "[E] Checkout";
      case "order-food":
        return "[E] Order Food";
      case "table-interaction":
        return "[E] Use Table";
      default:
        return "";
    }
  }
}