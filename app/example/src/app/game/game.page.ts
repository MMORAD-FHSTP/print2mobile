import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';

import Phaser from 'phaser';

class GameScene extends Phaser.Scene {
  static platform: Platform;
  static width: number;
  static height: number;
  private background: Phaser.GameObjects.Image;
  private character: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

  constructor(config) {
    super(config);
  }

  preload() {
    this.load.image('nightSky', 'assets/backgrounds/night.jpg');
    this.load.image('ground', 'assets/tiles/tile.png');
    this.load.image('mario', 'assets/character/mario.png');
  }

  create() {
    // this.add.image(GameScene.width, GameScene.height, 'nightSky');
    this.background = this.add.image(GameScene.width/2, GameScene.height/2, 'nightSky');
    // this.background.scale = 0.5;
    this.background.setDisplaySize(GameScene.width, GameScene.height);

    this.character = this.physics.add.sprite(GameScene.width/2, GameScene.height-GameScene.width/4, "mario");
    this.character.setDisplaySize(GameScene.width/7, GameScene.width/4);
    this.character.setGravityY(200);

    const ground = this.physics.add.sprite(GameScene.width/2, GameScene.height*.95, "ground");
    ground.setImmovable();
    // ground.displayWidth = GameScene.width;
    this.physics.add.collider(this.character, ground);

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
    if(this.character.y > GameScene.height){
      this.character.y = GameScene.width/2;
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
      width: width,
      height: height,
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
