/* eslint-disable max-len */

import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';

import Phaser from 'phaser';

class GameScene extends Phaser.Scene {
  static platform: Platform;
  static width: number;
  static height: number;
  private background: Phaser.GameObjects.TileSprite;
  private character: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private pointer: Phaser.Input.Pointer;
  private currentPosY = 0;

  private grounds: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody[] = [];

  constructor(config) {
    super(config);
  }

  preload() {
    this.load.image('nightSky', 'assets/backgrounds/night.jpg');
    this.load.image('ground', 'assets/tiles/tile.png');
    this.load.image('mario', 'assets/character/mario.png');
  }

  create() {
    this.background = this.add.tileSprite(0, 0, GameScene.width, GameScene.height, 'nightSky').setOrigin(0, 0);

    // this.add.image(GameScene.width, GameScene.height, 'nightSky');
    // this.background = this.add.tileSprite(GameScene.width/2, GameScene.height/2, GameScene.width, GameScene.height, 'nightSky');
    // this.background.setDisplaySize(GameScene.width, GameScene.height);

    this.character = this.physics.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY, 'mario');
    this.character.setDisplaySize(GameScene.width / 7, GameScene.width / 4);
    this.character.setGravityY(400);

    for (let i = 0; i < 3; i++) {
      const xPos = Math.floor(Math.random() * GameScene.width - 100);
      const yPos = Math.floor(Math.random() * GameScene.height - 100);

      this.grounds[i] = this.physics.add.sprite(xPos <= 0 ? 1 : xPos, yPos <= 0 ? 1 : yPos , 'ground').setOrigin(0, 0);
      this.grounds[i].setDisplaySize(100, 30);
      this.grounds[i].setSize(100,30);
      this.grounds[i].setImmovable();

    }

    this.grounds.push(this.physics.add.sprite(0, GameScene.height-10, 'ground').setOrigin(0,0).setDisplaySize(GameScene.width, 10).setImmovable());
    // ground.displayWidth = GameScene.width;
    this.physics.add.collider(this.character, this.grounds);
    this.physics.systems.start(Phaser.Physics.Arcade);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.pointer = this.input.activePointer;

    this.background.setScrollFactor(0);
    // var particles = this.add.particles('red');

    // var emitter = particles.createEmitter({
    //   speed: 100,
    //   scale: { start: 1, end: 0 },
    //   blendMode: 'ADD'
    // });

    // var logo = this.physics.add.image(400, 100, 'logo');

    // logo.setVelocity(100, 200);
    // logo.setBounce(1, 1);
    // logo.setCollideWorldBounds(true);

    // emitter.startFollow(logo);
  }

  update() {

    this.physics.world.setBounds(0,this.cameras.main.scrollY, this.physics.world.bounds.width, this.physics.world.bounds.height);

    this.cameras.main.setLerp(.5);
		this.cameras.main.centerOnY(this.character.y);

    if(this.cameras.main.scrollY >= 0) {this.cameras.main.scrollY = 0;}

    // console.log(this.cameras.main.scrollY);
    this.background.tilePositionY = this.cameras.main.scrollY;

    if (this.character.y > GameScene.height) {
      this.character.y = GameScene.width / 2;
    }

    if (this.cursors.left.isDown || (this.input.activePointer.isDown && this.input.activePointer.position.x < this.character.body.position.x)) {
      this.character.setVelocityX(-160);

      this.character.anims.play('left', true);
    }
    else if (this.cursors.right.isDown || (this.input.activePointer.isDown && this.input.activePointer.position.x > this.character.body.position.x)) {
      this.character.setVelocityX(160);

      this.character.anims.play('right', true);
    }
    else {
      this.character.setVelocityX(0);

      this.character.anims.play('turn');
    }

    if (this.character.body.touching.down) {
      this.character.setVelocityY(-930);
    }
  }
}


@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
})
export class GamePage implements OnInit {

  phaserGame: Phaser.Game;
  config: Phaser.Types.Core.GameConfig;

  constructor(platform: Platform) {
    const width: number = platform.width() < 430 ? platform.width() : 430;
    const height: number = platform.height() < 780 ? platform.height() : 780;

    this.config = {
      type: Phaser.AUTO,
      width,
      height,
      physics: {
        default: 'arcade'
      },
      parent: 'game',
      scene: GameScene
    };

    GameScene.platform = platform;
    // GameScene.width = platform.width();
    // GameScene.height = platform.height();
    GameScene.width = width;
    GameScene.height = height;
  }

  ngOnInit(): void {
    this.phaserGame = new Phaser.Game(this.config);
  }
}
