import Phaser from "phaser";
import { locations } from "../data/locations";
import { npcProfiles } from "../data/npcs";
import { useGameStore } from "../../store/useGameStore";
import type { LocationProfile } from "../data/locations";
import { computeResponsiveLayout } from "../systems/layoutSystem";

type PlayerRect = Phaser.GameObjects.Rectangle & {
  body: Phaser.Physics.Arcade.Body;
};

type NpcRect = Phaser.GameObjects.Rectangle & {
  body: Phaser.Physics.Arcade.Body;
};

type LocationZone = Phaser.GameObjects.Zone & {
  body: Phaser.Physics.Arcade.StaticBody;
};

export class GameScene extends Phaser.Scene {
  private player!: PlayerRect;

  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasdKeys!: {
    w: Phaser.Input.Keyboard.Key;
    a: Phaser.Input.Keyboard.Key;
    s: Phaser.Input.Keyboard.Key;
    d: Phaser.Input.Keyboard.Key;
  };

  private npcSprites: {
    sprite: NpcRect;
    label: Phaser.GameObjects.Text;
    name: string;
    npcId: string;
  }[] = [];

  private locationZones: {
    zone: LocationZone;
    locationId: string;
    visual: Phaser.GameObjects.Rectangle;
  }[] = [];

  constructor() {
    super("GameScene");
  }

  create() {
    this.cameras.main.setBackgroundColor("#2a2d3e");

    const canvasWidth = this.scale.width;
    const canvasHeight = this.scale.height;

    this.physics.world.setBounds(0, 0, canvasWidth, canvasHeight);

    const layout = computeResponsiveLayout(canvasWidth, canvasHeight);

    this.add.text(20, 20, "AI Semester Sim", {
      fontSize: "24px",
      color: "#ffffff",
    });

    // Create player FIRST
    const playerX = canvasWidth * 0.5;
    const playerY = canvasHeight * 0.5;

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

      this.createLocationWithZone(location, position);
    }

    // Create NPCs AFTER locations
    for (const npc of npcProfiles) {
      const position = layout.getNpcPosition(npc.id);
      if (!position) {
        console.warn(`No layout position found for NPC: ${npc.id}`);
        continue;
      }

      const npcRect = this.add.rectangle(position.x, position.y, 24, 24, 0x8ecae6);
      this.physics.add.existing(npcRect);

      const npcBody = npcRect as NpcRect;
      npcBody.body.setCollideWorldBounds(true);
      npcBody.body.setAllowGravity(false);
      npcBody.body.setImmovable(true);

      const label = this.add.text(position.x - 18, position.y - 28, npc.name, {
        fontSize: "12px",
        color: "#ffffff",
      });

      this.npcSprites.push({
        sprite: npcBody,
        label,
        name: npc.name,
        npcId: npc.id,
      });

      this.physics.add.collider(this.player, npcBody);
    }

    this.input.keyboard?.on("keydown-E", () => {
      this.checkInteraction();
    });

    console.log(`✓ GameScene created with ${locations.length} locations and ${npcProfiles.length} NPCs`);
    console.log(`✓ Canvas size: ${canvasWidth}x${canvasHeight}`);
  }

  update() {
    if (!this.player?.body) return;

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

    // Keep NPC labels synced in case NPCs move later
    for (const npc of this.npcSprites) {
      npc.label.setPosition(npc.sprite.x - 18, npc.sprite.y - 28);
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

    for (const locZone of this.locationZones) {
      const bounds = locZone.visual.getBounds();
      if (bounds.contains(this.player.x, this.player.y)) {
        store.openLocationPanel(locZone.locationId as any);
        return;
      }
    }

    for (const npc of this.npcSprites) {
      const dist = Phaser.Math.Distance.Between(
        this.player.x,
        this.player.y,
        npc.sprite.x,
        npc.sprite.y
      );

      if (dist < 50) {
        store.openNpcPanel(npc.name);
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