/* eslint-disable max-len */

import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';

import Phaser from 'phaser';

class GameScene extends Phaser.Scene {
  static platform: Platform;
  static width: number;
  static height: number;
  private backgroundSky: Phaser.GameObjects.TileSprite;
  private character: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private pointer: Phaser.Input.Pointer;

  private outerCam: Phaser.Cameras.Scene2D.Camera;

  private grounds: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody[] = [];

  constructor(config) {
    super(config);
  }

  preload() {
    this.load.image('sky', 'assets/packs/country-platform-files/layers/country-platform-back.png');
    this.load.image('nightSky', 'assets/backgrounds/night.jpg');
    this.load.image('ground', 'assets/tiles/tile.png');
    this.load.atlas('idle', 'assets/character/idle.png', 'assets/character/idle.json');
    this.load.atlas('run', 'assets/character/run.png', 'assets/character/run2.json');
  }

  create() {
    this.backgroundSky = this.add.tileSprite(0, 0, GameScene.width, GameScene.height, 'sky').setOrigin(0, 0);
    this.backgroundSky.setScrollFactor(0);

    // create character(player)
    this.character = this.physics.add.sprite(10, GameScene.height/2, 'idle');
    this.character.scale = 1.5;
    this.character.setCollideWorldBounds(true);

    // set gravity of player
    this.character.setGravityY(800);

    this.anims.create({
      key: 'standing',
      frames: this.anims.generateFrameNames('idle', {prefix: 'idle', end: 19, zeroPad: 3 }),
      frameRate: 5,
      repeat: -1,
    })

    this.anims.create({
      key: 'running',
      frames: this.anims.generateFrameNames('run', {prefix: 'sprite', end: 24, zeroPad: 3 }),
      repeat: -1,
    })
    
    this.character.anims.play('standing');

    // create grounds
    // for (let i = 0; i < 3; i++) {
    //   const xPos = Math.floor(Math.random() * GameScene.width - 100);
    //   const yPos = Math.floor(Math.random() * GameScene.height - 100);

    //   this.grounds[i] = this.physics.add.sprite(xPos <= 0 ? 1 : xPos, yPos <= 0 ? 1 : yPos , 'ground').setOrigin(0, 0);
    //   this.grounds[i].setDisplaySize(100, 30);
    //   this.grounds[i].setSize(100,30);
    //   this.grounds[i].setImmovable();
    //   this.grounds[i].body.checkCollision.down = false;
    //   this.grounds[i].body.checkCollision.left = false;
    //   this.grounds[i].body.checkCollision.right = false;
    // }

    this.grounds.push(this.physics.add.sprite(0, GameScene.height-10, 'ground').setOrigin(0,0).setDisplaySize(GameScene.width, 10).setImmovable());
    // ground.displayWidth = GameScene.width;
    this.physics.add.collider(this.character, this.grounds);
    this.physics.systems.start(Phaser.Physics.Arcade);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.pointer = this.input.activePointer;

    this.cameras.main.startFollow(this.character, true, 0.05, 0, -200, 0);
    this.shakeCamera();

    this.cameras.main.scaleManager.resize(GameScene.width*0.9, GameScene.height*0.9);
    // this.cameras.main.setPosition(GameScene.width*0.1, GameScene.height*0.1);
    this.outerCam = this.cameras.add(0,0, GameScene.width, GameScene.height, false, "outside");
    this.outerCam.setBackgroundColor("#808080").setAlpha(0.5).scaleManager.resize(GameScene.width, GameScene.height);
    

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
    this.grounds[0].setDisplaySize(this.character.body.x + GameScene.width, 20);
    this.physics.world.setBounds(0,0, this.character.body.position.x+GameScene.width, this.physics.world.bounds.height);

    if(this.cameras.main.scrollX <= 0) {this.cameras.main.scrollX = 0;}

    this.backgroundSky.tilePositionX = this.cameras.main.scrollX;

    if (this.cursors.left.isDown || (this.input.activePointer.isDown && this.input.activePointer.position.x < this.character.body.position.x)) {
      this.character.setVelocityX(-200);

      if(!this.character.flipX){
        this.character.setFlipX(true);
      }
      this.character.anims.play('running', true);
    }
    else if (this.cursors.right.isDown || (this.input.activePointer.isDown && this.input.activePointer.position.x > this.character.body.position.x)) {
      this.character.setVelocityX(200);

      if(this.character.flipX){
        this.character.setFlipX(false);
      }
      this.character.anims.play('running', true);
    }
    else {
      this.character.setVelocityX(0);

      this.character.anims.play('standing', true);
    }

    if (this.cursors.up.isDown && this.character.body.touching.down) {
      this.character.setVelocityY(-500);
    }
  }

  shakeCamera(){
    setTimeout(() => {
      this.cameras.main.shake(1000, 0.003);
      this.shakeCamera();
    }, 2000)
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
    const width: number = platform.width() < 780 ? platform.width() : 780;
    const height: number = platform.height() < 430 ? platform.height() : 430;

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
    GameScene.width = width;
    GameScene.height = height;
  }

  ngOnInit(): void {
    this.phaserGame = new Phaser.Game(this.config);
  }
}
