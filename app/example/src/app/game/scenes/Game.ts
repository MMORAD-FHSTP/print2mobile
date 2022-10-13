import { GamePage } from './../game.page';
/* eslint-disable max-len */
import { Platform } from '@ionic/angular';

export default class GameScene extends Phaser.Scene {

  private backgroundSky: Phaser.GameObjects.TileSprite;
  private backgroundGround: Phaser.GameObjects.TileSprite;
  private backgroundForest: Phaser.GameObjects.TileSprite;
  private train: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

  private character: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

  private isDamageSafe = false;

  private jumpButton: Phaser.GameObjects.Arc;

  private grounds: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody[] = [];
  private stones: Phaser.GameObjects.Image[] = [];

  private distance: number;
  private distanceText: Phaser.GameObjects.Text;

  private currVelocityX;



  constructor() {
    super('GameScene');
  }

  preload() {
    // backgrounds
    this.load.image('sky', 'assets/packs/country-platform-files/layers/country-platform-back.png');
    this.load.image('nightSky', 'assets/backgrounds/night.jpg');
    this.load.image('ground', 'assets/tiles/tile.png');
    this.load.image('way', 'assets/packs/country-platform-files/layers/country-platform-tiles-example.png');
    this.load.image('forest', 'assets/packs/country-platform-files/layers/country-platform-forest.png');
    this.load.image('train2', 'assets/trains/train_cut.png');

    // char animations
    this.load.atlas('idle', 'assets/character/idle.png', 'assets/character/idle.json');
    this.load.atlas('run', 'assets/character/run.png', 'assets/character/run2.json');
    this.load.atlas('jump', 'assets/character/jump.png', 'assets/character/jump.json');

    // effects
    this.load.atlas('smoke', 'assets/effects/jump_smoke.png', 'assets/effects/jump_smoke.json');

    // obstacles
    for (let i = 0; i <= 31; i++) {
      this.load.image('stone' + i, 'assets/obstacles/stones/singles/stone0' + (i > 9 ? i : `0${i}`) + '.png');
    }
  }

  create() {
    this.currVelocityX = 400;
    this.cameras.main.fadeIn(1000);
    // setup background
    this.backgroundSky = this.add.tileSprite(0, GamePage.height - 240, GamePage.width, 224, 'sky').setOrigin(0, 0);
    this.backgroundSky.setScrollFactor(0);

    this.backgroundForest = this.add.tileSprite(0, GamePage.height - 169, GamePage.width, 169, 'forest').setOrigin(0, 0);
    this.backgroundForest.setScrollFactor(0);

    this.backgroundGround = this.add.tileSprite(0, GamePage.height - 224, GamePage.width, 224, 'way').setOrigin(0, 0);
    this.backgroundGround.setScrollFactor(0);

    this.backgroundForest.y -= this.backgroundGround.height * 0.2;

    this.train = this.physics.add.sprite(0, 0, 'train2').setOrigin(0, 0);
    console.log(this.train.width);
    this.train.setPosition(-this.train.width, GamePage.height - this.train.height - 30);

    // create character(player)
    this.character = this.physics.add.sprite(10, GamePage.height / 2, 'idle');
    this.character.scale = 1.5;
    this.character.setCollideWorldBounds(true);

    // set gravity of player
    this.character.setGravityY(800);

    // create animations
    this.anims.create({
      key: 'running',
      frames: this.anims.generateFrameNames('run', { prefix: 'sprite', end: 23, zeroPad: 3 }),
      frameRate: 28,
      repeat: -1,
    });

    this.anims.create({
      key: 'jumping',
      frames: this.anims.generateFrameNames('jump', { prefix: 'sprite', end: 18, zeroPad: 3 }),
      frameRate: 10,
      repeat: 0,
    });

    this.character.anims.play('running');

    // create stones
    for (let i = 0; i <= 31; i++) {
      const xPos = Math.floor((Math.random() * GamePage.width * 10) + GamePage.width);
      const yPos = GamePage.height - 35 - ((32 * 1.5) / 2);

      this.stones[i] = this.physics.add.image(xPos, yPos, 'stone' + i).setOrigin(0, 0).setScale(1.5).setPushable(false);
    }

    this.grounds.push(this.physics.add.sprite(0, GamePage.height - 25, 'ground')
      .setOrigin(0, 0)
      .setDisplaySize(GamePage.width, 10)
      .setImmovable()
      .setVisible(false));
    // ground.displayWidth = GamePage.width;
    this.physics.add.collider(this.character, this.grounds);
    this.physics.systems.start(Phaser.Physics.Arcade);

    this.cameras.main.startFollow(this.character, true, 0.05, 0, -290, 0);
    this.cameras.main.setBackgroundColor('#82b6ff');

    const particles = this.add.particles('smoke');
    const emitter = particles.createEmitter({
      speed: 10,
      scale: { start: 1, end: 2.5 },
      blendMode: 'ADD',
      lifespan: 1500
    });

    emitter.startFollow(this.character, -15, 17);

    this.distance = 0;
    this.distanceText = this.add.text(0, 0, this.distance.toString(), { color: '#00cc00', fontSize: '35px' });
    this.distanceText.setPosition(GamePage.width - this.distanceText.width - 20, 20).setScrollFactor(0);

    this.jumpButton = this.add.circle(10, GamePage.height - 10, 40, 0, 0.2).setScrollFactor(0);
    this.jumpButton.setPosition(this.jumpButton.width / 2 + 10, GamePage.height - this.jumpButton.height / 2 - 10)
      .setInteractive()
      .on('pointerdown', () => {
        if (this.character.body.touching.down
          || this.character.body.y + this.character.body.height >= GamePage.height - 30) this.jump()
      });
  }

  update() {

    this.train.setVelocityX(370);

    this.grounds[0].setDisplaySize(this.character.body.x + GamePage.width * 2, 20);
    this.physics.world.setBounds(0, 0, this.character.body.position.x + GamePage.width, this.physics.world.bounds.height);

    // parallax
    this.backgroundSky.tilePositionX = this.cameras.main.scrollX * 0.2;
    this.backgroundForest.tilePositionX = this.cameras.main.scrollX * 0.4;
    this.backgroundGround.tilePositionX = this.cameras.main.scrollX;

    const velocityX = this.currVelocityX;

    const playerRelativePositionX = this.character.body.position.x - this.cameras.main.worldView.x;

    // avoid bugs
    if (this.character.body.y + this.character.body.height > GamePage.height - 25) {
      this.character.body.y = GamePage.height - 25 - this.character.body.height;
    }
    if (playerRelativePositionX < 30) { this.character.body.x += 1; }

    // check for jumps & run
    if (this.character.body.touching.down) {
      this.character.play('running', true);
    }

    if (this.currVelocityX < 400) {
      this.currVelocityX += 2;
    }

    this.character.setVelocityX(velocityX);

    // check if hurt => life - 1 & timeout for damage
    this.checkObstacleCollision();

    this.distanceText.setText((this.distance / 10).toString() + ' Meter');
    this.distanceText.setPosition(GamePage.width - this.distanceText.width - 10, 10).setScrollFactor(0);
    this.distance++;

    this.moveStones();
  }

  checkObstacleCollision() {
    this.physics.collide(this.stones, this.character, (stone) => {
      if (this.currVelocityX > 50) {
        this.currVelocityX -= 5;
      }
    });

    this.physics.collide(this.train, this.character, () => {
      
      this.scene.stop();
      this.scene.start('MenuScene');
    })
  }

  jump() {
    this.character.setVelocityY(-600);
    this.character.play('jumping', true);
  }

  moveStones(){
    for (let i = 0; i <= 31; i++) {
      if(this.stones[i].x < (this.character.body.x - GamePage.width)){
        const xPos = Math.floor((Math.random() * (this.character.body.x + GamePage.width * 10)) + GamePage.width);
        const yPos = GamePage.height - 35 - ((32 * 1.5) / 2);
        this.stones[i].setPosition(xPos, yPos);
      }
    }
  }
}
