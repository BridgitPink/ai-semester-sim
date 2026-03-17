import Phaser from "phaser";
import { npcProfiles } from "../data/npcs";
import { useGameStore } from "../../store/useGameStore";

export class GameScene extends Phaser.Scene {
  private player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private npcSprites: { sprite: Phaser.GameObjects.Rectangle; name: string }[] = [];
  private locationZones: { zone: Phaser.GameObjects.Zone; id: "dorm" | "classroom" | "lab" }[] = [];

  constructor() {
    super("GameScene");
  }

  create() {
    this.cameras.main.setBackgroundColor("#2a2d3e");

    this.add.text(20, 20, "AI Semester Sim", {
      fontSize: "24px",
      color: "#ffffff",
    });

    this.add.rectangle(120, 430, 180, 90, 0x4f6d7a).setStrokeStyle(2, 0xffffff);
    this.add.text(70, 420, "Dorm", { color: "#ffffff", fontSize: "20px" });

    this.add.rectangle(430, 120, 220, 100, 0x7a5c61).setStrokeStyle(2, 0xffffff);
    this.add.text(365, 110, "Classroom", { color: "#ffffff", fontSize: "20px" });

    this.add.rectangle(770, 400, 190, 100, 0x5b8c5a).setStrokeStyle(2, 0xffffff);
    this.add.text(735, 390, "Lab", { color: "#ffffff", fontSize: "20px" });

    this.player = this.physics.add.sprite(500, 300, "");
    this.player.setSize(28, 28);
    this.player.setCollideWorldBounds(true);

    const playerBody = this.add.rectangle(500, 300, 28, 28, 0xffd166);
    this.player.setVisible(false);

    this.events.on("update", () => {
      playerBody.setPosition(this.player.x, this.player.y);
    });

    this.cursors = this.input.keyboard!.createCursorKeys();

    for (const npc of npcProfiles) {
      const sprite = this.add.rectangle(npc.x, npc.y, 24, 24, 0x8ecae6);
      this.add.text(npc.x - 18, npc.y - 28, npc.name, {
        fontSize: "12px",
        color: "#ffffff",
      });
      this.npcSprites.push({ sprite, name: npc.name });
    }

    this.createLocationZone(120, 430, 180, 90, "dorm");
    this.createLocationZone(430, 120, 220, 100, "classroom");
    this.createLocationZone(770, 400, 190, 100, "lab");

    this.input.keyboard?.on("keydown-E", () => {
      this.checkInteraction();
    });
  }

  update() {
    const speed = 180;
    this.player.setVelocity(0);

    if (this.cursors.left?.isDown) this.player.setVelocityX(-speed);
    if (this.cursors.right?.isDown) this.player.setVelocityX(speed);
    if (this.cursors.up?.isDown) this.player.setVelocityY(-speed);
    if (this.cursors.down?.isDown) this.player.setVelocityY(speed);
  }

  private createLocationZone(
    x: number,
    y: number,
    width: number,
    height: number,
    id: "dorm" | "classroom" | "lab"
  ) {
    const zone = this.add.zone(x, y, width, height);
    this.physics.add.existing(zone, true);
    this.locationZones.push({ zone, id });
  }

  private checkInteraction() {
    const store = useGameStore.getState();

    for (const loc of this.locationZones) {
      const bounds = loc.zone.getBounds();
      if (bounds.contains(this.player.x, this.player.y)) {
        store.openLocationPanel(loc.id);
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
}