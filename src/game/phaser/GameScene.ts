import Phaser from "phaser";
import { locations } from "../data/locations";
import { useGameStore, type LocationId } from "../../store/useGameStore";
import type { LocationProfile } from "../data/locations";
import { computeResponsiveLayout } from "../systems/layoutSystem";
import { validateNpcSpawn } from "../systems/npcPlacementSystem";
import { getCurrentDayType, isClassroomOpen, isLabOpen } from "../systems/timeSystem";
import {
  decideNpcNow,
  getVisibleOverworldNpcIds,
  NPC_LOCATION_ANCHORS,
  pickAnchorSlotIndex,
} from "../systems/npcSystem";
import type { InteriorObject } from "../types/interiorObject";

type PlayerRect = Phaser.GameObjects.Rectangle & {
  body: Phaser.Physics.Arcade.Body;
};

type NpcRect = Phaser.GameObjects.Rectangle & {
  body: Phaser.Physics.Arcade.Body;
};

type LocationZone = Phaser.GameObjects.Zone & {
  body: Phaser.Physics.Arcade.StaticBody;
};

interface SceneData {
  playerX?: number;
  playerY?: number;
}

export class GameScene extends Phaser.Scene {
  private player!: PlayerRect;
  private restoredPlayerPos?: { x: number; y: number };

  private lastNpcSyncKey = "";
  private lastNpcWanderTick = -1;

  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasdKeys!: {
    w: Phaser.Input.Keyboard.Key;
    a: Phaser.Input.Keyboard.Key;
    s: Phaser.Input.Keyboard.Key;
    d: Phaser.Input.Keyboard.Key;
  };

  private npcSprites = new Map<
    string,
    {
      sprite: NpcRect;
      label: Phaser.GameObjects.Text;
      name: string;
      npcId: string;
      collider: Phaser.Physics.Arcade.Collider;
      anchorX: number;
      anchorY: number;
      anchorKey: string;
      targetX: number;
      targetY: number;
    }
  >();

  private locationZones: {
    zone: LocationZone;
    locationId: string;
    visual: Phaser.GameObjects.Rectangle;
  }[] = [];

  private buildings: Array<{
    location: LocationProfile;
    position: { x: number; y: number };
  }> = [];

  constructor() {
    super("GameScene");
  }

  init(data: SceneData) {
    // Store player position passed from an interior scene
    if (data.playerX !== undefined && data.playerY !== undefined) {
      this.restoredPlayerPos = { x: data.playerX, y: data.playerY };
    }
  }

  create() {
    // Reset all scene-local collections at the top of create().
    // Phaser reuses the same class instance when scene.start() is called, so
    // stale destroyed-sprite references in these Maps/arrays would cause NPCs
    // to silently disappear after returning from a building interior.
    this.npcSprites = new Map();
    this.locationZones = [];
    this.buildings = [];
    this.lastNpcSyncKey = "";
    this.lastNpcWanderTick = -1;

    this.cameras.main.setBackgroundColor("#2a2d3e");

    const canvasWidth = this.scale.width;
    const canvasHeight = this.scale.height;

    this.physics.world.setBounds(0, 0, canvasWidth, canvasHeight);

    const layout = computeResponsiveLayout(canvasWidth, canvasHeight);

    this.add.text(20, 20, "AI Semester Sim", {
      fontSize: "24px",
      color: "#ffffff",
    });

    // Create player FIRST, use restored position if available
    let playerX = canvasWidth * 0.5;
    let playerY = canvasHeight * 0.5;
    
    if (this.restoredPlayerPos) {
      playerX = this.restoredPlayerPos.x;
      playerY = this.restoredPlayerPos.y;
      this.restoredPlayerPos = undefined; // Clear after using
    }

    const playerRect = this.add.rectangle(playerX, playerY, 28, 28, 0xffd166);
    this.physics.add.existing(playerRect);

    this.player = playerRect as PlayerRect;
    this.player.body.setCollideWorldBounds(true);
    this.player.body.setAllowGravity(false);
    this.player.body.setBounce(0, 0);

    // Setup keyboard input
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

    // Create locations AFTER player exists
    for (const location of locations) {
      const position = layout.getLocationPosition(location.id);
      if (!position) {
        console.warn(`No layout position found for location: ${location.id}`);
        continue;
      }

      this.buildings.push({ location, position });
      this.createLocationWithZone(location, position);
    }

    // Create NPCs AFTER locations.
    this.syncNpcSprites(layout, canvasWidth, canvasHeight);
    const store = useGameStore.getState();
    this.lastNpcSyncKey = `${store.week}:${store.day}:${getCurrentDayType()}:${store.mandatoryActivityComplete}`;

    this.input.keyboard?.on("keydown-E", () => {
      this.checkInteraction();
    });

    console.log(`✓ GameScene created with ${locations.length} locations`);
    console.log(`✓ Canvas size: ${canvasWidth}x${canvasHeight}`);
  }

  update(_time: number, delta: number) {
    if (!this.player?.body) return;

    const store = useGameStore.getState();
    const syncKey = `${store.week}:${store.day}:${getCurrentDayType()}:${store.mandatoryActivityComplete}`;
    if (syncKey !== this.lastNpcSyncKey) {
      const layout = computeResponsiveLayout(this.scale.width, this.scale.height);
      this.syncNpcSprites(layout, this.scale.width, this.scale.height);
      this.lastNpcSyncKey = syncKey;
    }

    // Lightweight deterministic movement: wander within a small radius around anchor.
    const wanderTick = Math.floor(this.time.now / 3500);
    if (wanderTick !== this.lastNpcWanderTick) {
      this.lastNpcWanderTick = wanderTick;
      for (const npc of this.npcSprites.values()) {
        const offset = this.pickWanderOffset(npc.npcId, npc.anchorKey, wanderTick);
        const desired = { x: npc.anchorX + offset.dx, y: npc.anchorY + offset.dy };
        const validated = validateNpcSpawn(desired, this.buildings, {
          width: this.scale.width,
          height: this.scale.height,
        }).position;
        npc.targetX = validated.x;
        npc.targetY = validated.y;
      }
    }

    const speed = 180;
    let vx = 0;
    let vy = 0;

    // Arrow keys
    if (this.cursors.left?.isDown) vx -= 1;
    if (this.cursors.right?.isDown) vx += 1;
    if (this.cursors.up?.isDown) vy -= 1;
    if (this.cursors.down?.isDown) vy += 1;

    // WASD
    if (this.wasdKeys.a?.isDown) vx -= 1;
    if (this.wasdKeys.d?.isDown) vx += 1;
    if (this.wasdKeys.w?.isDown) vy -= 1;
    if (this.wasdKeys.s?.isDown) vy += 1;

    if (vx !== 0 || vy !== 0) {
      const magnitude = Math.sqrt(vx * vx + vy * vy);
      this.player.body.setVelocity((vx / magnitude) * speed, (vy / magnitude) * speed);
    } else {
      this.player.body.setVelocity(0, 0);
    }

    // Move NPCs toward their wander targets + keep labels synced.
    const npcSpeed = 26; // px/sec
    const step = (npcSpeed * delta) / 1000;

    for (const npc of this.npcSprites.values()) {
      const dx = npc.targetX - npc.sprite.x;
      const dy = npc.targetY - npc.sprite.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > 0.5) {
        const ratio = Math.min(1, step / dist);
        npc.sprite.setPosition(npc.sprite.x + dx * ratio, npc.sprite.y + dy * ratio);
      }

      npc.label.setPosition(npc.sprite.x - 18, npc.sprite.y - 28);
    }
  }

  private stableHash(input: string): number {
    let hash = 2166136261;
    for (let i = 0; i < input.length; i++) {
      hash ^= input.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
  }

  private pickWanderOffset(npcId: string, anchorKey: string, tick: number): { dx: number; dy: number } {
    const h1 = this.stableHash(`${npcId}:${anchorKey}:${tick}:x`);
    const h2 = this.stableHash(`${npcId}:${anchorKey}:${tick}:y`);

    // Small radius so it reads as "idling" not pathfinding.
    const radius = 18;
    const dx = ((h1 % (radius * 2 + 1)) - radius);
    const dy = ((h2 % (radius * 2 + 1)) - radius);
    return { dx, dy };
  }

  private syncNpcSprites(
    layout: ReturnType<typeof computeResponsiveLayout>,
    canvasWidth: number,
    canvasHeight: number
  ) {
    const visibleNpcIds = getVisibleOverworldNpcIds();
    const visibleSet = new Set(visibleNpcIds);

    // Remove no-longer-visible NPCs.
    for (const [npcId, existing] of this.npcSprites.entries()) {
      if (!visibleSet.has(npcId)) {
        existing.collider.destroy();
        existing.label.destroy();
        existing.sprite.destroy();
        this.npcSprites.delete(npcId);
      }
    }

    for (const npcId of visibleNpcIds) {
      let decision;
      try {
        decision = decideNpcNow(npcId);
      } catch (err) {
        console.warn(`NPC decision failed for ${npcId}`, err);
        continue;
      }
      if (!decision) continue;

      const basePos = layout.getLocationPosition(decision.locationId);
      if (!basePos) continue;

      const anchors = NPC_LOCATION_ANCHORS[decision.locationId] ?? [{ dx: 0, dy: 0 }];
      const slotIndex = pickAnchorSlotIndex(npcId, decision.locationId);
      const anchor = anchors[slotIndex] ?? anchors[0];

      const anchorX = basePos.x + anchor.dx;
      const anchorY = basePos.y + anchor.dy;

      let position = { x: anchorX, y: anchorY };

      const validation = validateNpcSpawn(position, this.buildings, {
        width: canvasWidth,
        height: canvasHeight,
      });
      position = validation.position;

      const existing = this.npcSprites.get(npcId);
      if (!existing) {
        const npcRect = this.add.rectangle(position.x, position.y, 24, 24, 0x8ecae6);
        this.physics.add.existing(npcRect);

        const npcBody = npcRect as NpcRect;
        npcBody.body.setCollideWorldBounds(true);
        npcBody.body.setAllowGravity(false);
        npcBody.body.setImmovable(true);

        const label = this.add.text(position.x - 18, position.y - 28, decision.name, {
          fontSize: "12px",
          color: "#ffffff",
        });

        const collider = this.physics.add.collider(this.player, npcBody);

        this.npcSprites.set(npcId, {
          sprite: npcBody,
          label,
          name: decision.name,
          npcId,
          collider,
          anchorX,
          anchorY,
          anchorKey: `${decision.locationId}:${slotIndex}`,
          targetX: position.x,
          targetY: position.y,
        });
      } else {
        const nextAnchorKey = `${decision.locationId}:${slotIndex}`;
        const anchorChanged = existing.anchorKey !== nextAnchorKey;

        existing.anchorX = anchorX;
        existing.anchorY = anchorY;
        existing.anchorKey = nextAnchorKey;

        if (anchorChanged) {
          existing.sprite.setPosition(position.x, position.y);
          existing.targetX = position.x;
          existing.targetY = position.y;
        }
        if (existing.name !== decision.name) {
          existing.name = decision.name;
          existing.label.setText(decision.name);
        }
      }
    }
  }

  private createLocationWithZone(
    location: LocationProfile,
    position: { x: number; y: number }
  ) {
    const { size, color, name, id } = location;

    // Building visual
    this.add
      .rectangle(position.x, position.y, size.width, size.height, color)
      .setStrokeStyle(2, 0xffffff);

    this.add.text(position.x - size.width / 2 + 10, position.y - size.height / 2 + 5, name, {
      color: "#ffffff",
      fontSize: "16px",
      fontStyle: "bold",
    });

    // Interaction zone
    const zone = this.add.zone(position.x, position.y, size.width, size.height);
    this.physics.add.existing(zone, true);

    const zoneBody = zone as LocationZone;

    // Optional debug visual
    const zoneVisual = this.add
      .rectangle(position.x, position.y, size.width, size.height, 0x00ff00, 0.08)
      .setStrokeStyle(2, 0x00ff00);

    this.locationZones.push({
      zone: zoneBody,
      locationId: id,
      visual: zoneVisual,
    });

    this.physics.add.collider(this.player, zoneBody);
  }

  private checkInteraction() {
    const store = useGameStore.getState();

    const openClosedBuildingModal = (
      buildingId: string,
      buildingName: string,
      message: string,
      interactionType: InteriorObject["interactionType"]
    ) => {
      const virtualObject: InteriorObject = {
        id: `${buildingId}-closed-info`,
        building: buildingId,
        name: buildingName,
        relativeX: 0,
        relativeY: 0,
        width: 0,
        height: 0,
        interactionType,
        label: buildingName,
        metadata: {
          description: message,
        },
      };

      store.openObjectModal({
        variant: "info",
        interactionType,
        object: virtualObject,
        title: `${buildingName} is closed`,
        subtitle: "Come back later",
        body: message,
      });
    };

    // Check building interactions FIRST (priority over NPCs)
    for (const building of this.buildings) {
      const { location, position } = building;
      
      // Calculate distance from player center to building center
      const distToBuilding = Phaser.Math.Distance.Between(
        this.player.x,
        this.player.y,
        position.x,
        position.y
      );

      // Calculate interaction threshold based on building size + padding
      // Using the larger dimension (width or height) for more forgiving interaction
      const maxDimension = Math.max(location.size.width, location.size.height);
      const interactionThreshold = maxDimension / 2 + 25; // 25px padding buffer

      if (distToBuilding < interactionThreshold) {
        // Building availability rules
        if (location.id === "classroom" && !isClassroomOpen()) {
          const dayType = getCurrentDayType();
          const msg =
            dayType !== "class"
              ? "Classes run Monday through Wednesday. The classroom is closed today."
              : "You already completed today's required lesson. The classroom is closed until tomorrow.";
          openClosedBuildingModal("classroom", location.name, msg, "course-goals");
          return;
        }

        if (location.id === "lab" && !isLabOpen()) {
          const dayType = getCurrentDayType();
          const msg =
            dayType !== "lab"
              ? "The lab is open Thursday and Friday. The lab is closed today."
              : "You already completed today's required lab activity. The lab is closed until next lab day.";
          openClosedBuildingModal("lab", location.name, msg, "lab-activity");
          return;
        }

        // Enter the shared interior scene with the selected building context
        store.enterBuilding(location.id as LocationId, {
          x: this.player.x,
          y: this.player.y,
        });
        
        this.scene.start("InteriorScene");
        return;
      }
    }

    // Check NPC interactions SECOND
    for (const npc of this.npcSprites.values()) {
      const dist = Phaser.Math.Distance.Between(
        this.player.x,
        this.player.y,
        npc.sprite.x,
        npc.sprite.y
      );

      if (dist < 50) {
        store.openNpcPanel(npc.npcId);
        return;
      }
    }

    store.closePanel();
  }

  toggleZoneVisibility() {
    for (const locZone of this.locationZones) {
      locZone.visual.setVisible(!locZone.visual.visible);
    }
  }
}