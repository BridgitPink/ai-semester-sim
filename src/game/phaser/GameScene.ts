import Phaser from "phaser";
import { locations } from "../data/locations";
import { npcProfiles } from "../data/npcs";
import { useGameStore } from "../../store/useGameStore";
import type { LocationProfile } from "../data/locations";
import { computeResponsiveLayout } from "../systems/layoutSystem";

export class GameScene extends Phaser.Scene {
  private player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private playerBody!: Phaser.GameObjects.Rectangle;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasdKeys!: { w: Phaser.Input.Keyboard.Key; a: Phaser.Input.Keyboard.Key; s: Phaser.Input.Keyboard.Key; d: Phaser.Input.Keyboard.Key };
  
  private npcSprites: { sprite: Phaser.GameObjects.Rectangle; name: string; npcId: string }[] = [];
  private locationZones: { 
    zone: Phaser.Physics.Arcade.StaticGroup; 
    locationId: string;
    visual: Phaser.GameObjects.Rectangle;
  }[] = [];
  private locationColliders: Phaser.Physics.Arcade.Collider[] = [];

  constructor() {
    super("GameScene");
  }

  create() {
    // Set background
    this.cameras.main.setBackgroundColor("#2a2d3e");

    // Get canvas dimensions for responsive layout
    const canvasWidth = this.scale.width;
    const canvasHeight = this.scale.height;

    // Compute responsive positions for all locations and NPCs
    const layout = computeResponsiveLayout(canvasWidth, canvasHeight);

    // Title
    this.add.text(20, 20, "AI Semester Sim", {
      fontSize: "24px",
      color: "#ffffff",
    });

    // Create all location buildings and zones from data
    for (const location of locations) {
      // Get responsive position for this location
      const position = layout.getLocationPosition(location.id);
      if (!position) {
        console.warn(`No layout position found for location: ${location.id}`);
        continue;
      }

      this.createLocationWithZone(
        location,
        position
      );
    }

    // Create player (physics body, visual representation) at center
    const playerX = canvasWidth * 0.5;
    const playerY = canvasHeight * 0.5;

    this.player = this.physics.add.sprite(playerX, playerY, "");
    this.player.setSize(28, 28);
    this.player.setCollideWorldBounds(true);
    this.player.setBounce(0.2);

    // Player visual (yellow rectangle)
    this.playerBody = this.add.rectangle(playerX, playerY, 28, 28, 0xffd166);
    this.player.setVisible(false);

    // Sync visual with physics body
    this.events.on("update", () => {
      this.playerBody.setPosition(this.player.x, this.player.y);
    });

    // Setup keyboard input - arrow keys and WASD
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.wasdKeys = this.input.keyboard!.addKeys({
      w: Phaser.Input.Keyboard.KeyCodes.W,
      a: Phaser.Input.Keyboard.KeyCodes.A,
      s: Phaser.Input.Keyboard.KeyCodes.S,
      d: Phaser.Input.Keyboard.KeyCodes.D,
    }) as any;

    // Create NPCs with physics
    for (const npc of npcProfiles) {
      // Get responsive position for this NPC
      const position = layout.getNpcPosition(npc.id);
      if (!position) {
        console.warn(`No layout position found for NPC: ${npc.id}`);
        continue;
      }

      const sprite = this.physics.add.sprite(position.x, position.y, "");
      sprite.setSize(24, 24);
      sprite.setCollideWorldBounds(true);
      sprite.setBounce(0.2);

      // Visual representation (light blue rectangle)
      const visual = this.add.rectangle(position.x, position.y, 24, 24, 0x8ecae6);
      sprite.setVisible(false);

      // Sync visual with physics
      this.events.on("update", () => {
        visual.setPosition(sprite.x, sprite.y);
      });

      // NPC name label
      this.add.text(position.x - 18, position.y - 28, npc.name, {
        fontSize: "12px",
        color: "#ffffff",
      });

      this.npcSprites.push({ sprite: visual, name: npc.name, npcId: npc.id });

      // Add collisions between player and NPC
      this.physics.add.collider(this.player, sprite);

      // Add collisions between NPC and location zones
      for (const locZone of this.locationZones) {
        this.physics.add.collider(sprite, locZone.zone);
      }
    }

    // Handle interaction input (E key)
    this.input.keyboard?.on("keydown-E", () => {
      this.checkInteraction();
    });

    console.log(`✓ GameScene created with ${locations.length} locations and ${npcProfiles.length} NPCs`);
    console.log(`✓ Canvas size: ${canvasWidth}x${canvasHeight}`);
  }

  update() {
    const speed = 180;
    let vx = 0;
    let vy = 0;

    // Arrow keys
    if (this.cursors.left?.isDown) vx -= 1;
    if (this.cursors.right?.isDown) vx += 1;
    if (this.cursors.up?.isDown) vy -= 1;
    if (this.cursors.down?.isDown) vy += 1;

    // WASD keys
    if (this.wasdKeys?.a?.isDown) vx -= 1;
    if (this.wasdKeys?.d?.isDown) vx += 1;
    if (this.wasdKeys?.w?.isDown) vy -= 1;
    if (this.wasdKeys?.s?.isDown) vy += 1;

    // Normalize diagonal movement for consistent speed
    if (vx !== 0 || vy !== 0) {
      const magnitude = Math.sqrt(vx * vx + vy * vy);
      this.player.setVelocity((vx / magnitude) * speed, (vy / magnitude) * speed);
    } else {
      this.player.setVelocity(0, 0);
    }
  }

  /**
   * Create a location building and its interaction zone
   * Renders a colored rectangle with label and a visible collision zone
   */
  private createLocationWithZone(location: LocationProfile, position: { x: number; y: number }) {
    const { size, color, name, id } = location;

    // Building/location visual (colored rectangle with border)
    this.add
      .rectangle(position.x, position.y, size.width, size.height, color)
      .setStrokeStyle(2, 0xffffff);

    // Location name label (centered above/on building)
    this.add.text(position.x - size.width / 2 + 10, position.y - size.height / 2 + 5, name, {
      color: "#ffffff",
      fontSize: "16px",
      fontStyle: "bold",
    });

    // Create static group for the interaction zone
    const zoneGroup = this.physics.add.staticGroup();

    // Create the zone rectangle (same size as building)
    const zoneRect = this.add
      .rectangle(position.x, position.y, size.width, size.height, 0x00ff00, 0.1)
      .setStrokeStyle(2, 0x00ff00); // Green outline for visibility during testing

    zoneGroup.add(zoneRect);
    this.physics.add.existing(zoneRect, true);

    // Store zone info for interaction checks
    this.locationZones.push({
      zone: zoneGroup,
      locationId: id,
      visual: zoneRect as Phaser.GameObjects.Rectangle,
    });

    // Add collider between player and this location zone
    const collider = this.physics.add.collider(this.player, zoneGroup);
    this.locationColliders.push(collider);
  }

  /**
   * Check if player is interacting with a location or NPC
   * Priority: Location zones first, then NPCs
   */
  private checkInteraction() {
    const store = useGameStore.getState();

    // Check proximity to location zones
    for (const locZone of this.locationZones) {
      const bounds = locZone.visual.getBounds();
      if (bounds.contains(this.player.x, this.player.y)) {
        store.openLocationPanel(locZone.locationId as any);
        return;
      }
    }

    // Check proximity to NPCs (50 pixel radius)
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

    // No interaction found
    store.closePanel();
  }

  /**
   * Toggle zone visibility for debugging
   * Useful for testing interaction bounds
   */
  toggleZoneVisibility() {
    for (const locZone of this.locationZones) {
      locZone.visual.setVisible(!locZone.visual.visible);
    }
  }
}