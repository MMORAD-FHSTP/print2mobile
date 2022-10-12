import { GamePage } from './../game.page';
/* eslint-disable max-len */
import { Platform } from '@ionic/angular';

export default class GameScene extends Phaser.Scene {

  private backgroundSky: Phaser.GameObjects.TileSprite;
  private backgroundGround: Phaser.GameObjects.TileSprite;
  private backgroundForest: Phaser.GameObjects.TileSprite;

  private character: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  private atk_anims = ['atk_1', 'atk_2', 'atk_3'];
  private atkKey: Phaser.Input.Keyboard.Key;
  private lives;
  private isDamageSafe = false;

  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private pointer: Phaser.Input.Pointer;
  private jumpButton: Phaser.GameObjects.Arc;
  private atkButton: Phaser.GameObjects.Arc;

  private grounds: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody[] = [];
  private stones: Phaser.GameObjects.Image[] = [];
  private livesCircles: Phaser.GameObjects.Arc[] = [];

  private distance: number;
  private distanceText: Phaser.GameObjects.Text;


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

    // char animations
    this.load.atlas('idle', 'assets/character/idle.png', 'assets/character/idle.json');
    this.load.atlas('run', 'assets/character/run.png', 'assets/character/run2.json');
    this.load.atlas('jump', 'assets/character/jump.png', 'assets/character/jump.json');
    this.load.atlas('atk_1', 'assets/character/atk_1.png', 'assets/character/atk_1.json');
    this.load.atlas('atk_2', 'assets/character/atk_2.png', 'assets/character/atk_2.json');
    this.load.atlas('atk_3', 'assets/character/atk_3.png', 'assets/character/atk_3.json');
    this.load.atlas('hurt', 'assets/character/hurt.png', 'assets/character/hurt.json');

    // effects
    this.load.atlas('smoke', 'assets/effects/jump_smoke.png', 'assets/effects/jump_smoke.json');

    // obstacles
    for (let i = 0; i <= 31; i++) {
      this.load.image('stone' + i, 'assets/obstacles/stones/singles/stone0' + (i > 9 ? i : `0${i}`) + '.png');
    }
  }

  create() {
    this.lives = 2;
    this.cameras.main.fadeIn(1000);
    // setup background
    this.backgroundSky = this.add.tileSprite(0, GamePage.height - 240, GamePage.width, 224, 'sky').setOrigin(0, 0);
    this.backgroundSky.setScrollFactor(0);

    this.backgroundForest = this.add.tileSprite(0, GamePage.height - 169, GamePage.width, 169, 'forest').setOrigin(0, 0);
    this.backgroundForest.setScrollFactor(0);

    this.backgroundGround = this.add.tileSprite(0, GamePage.height - 224, GamePage.width, 224, 'way').setOrigin(0, 0);
    this.backgroundGround.setScrollFactor(0);

    this.backgroundForest.y -= this.backgroundGround.height * 0.2;


    // create character(player)
    this.character = this.physics.add.sprite(10, GamePage.height / 2, 'idle');
    this.character.scale = 1.5;
    this.character.setCollideWorldBounds(true);

    // set gravity of player
    this.character.setGravityY(800);

    this.atkKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

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

    this.anims.create({
      key: 'atk_1',
      frames: this.anims.generateFrameNames('atk_1', { prefix: 'sprite', end: 7, zeroPad: 3 }),
      frameRate: 10,
      repeat: 0,
    });

    this.anims.create({
      key: 'atk_2',
      frames: this.anims.generateFrameNames('atk_2', { prefix: 'sprite', end: 6, zeroPad: 3 }),
      frameRate: 10,
      repeat: 0,
    });

    this.anims.create({
      key: 'atk_3',
      frames: this.anims.generateFrameNames('atk_3', { prefix: 'sprite', end: 8, zeroPad: 3 }),
      frameRate: 10,
      repeat: 0,
    });

    this.anims.create({
      key: 'hurt',
      frames: this.anims.generateFrameNames('hurt', { prefix: 'sprite', end: 6, zeroPad: 3 }),
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

    for (let i = 0; i < 3; i++) {
      const width = 20;
      this.livesCircles[i] = this.add.circle(10 + (i * width * 2) + width, 10 + width / 2, width, 0xFF0000, 1).setStrokeStyle(1, 0);
      this.livesCircles[i].setScrollFactor(0);
    }

    this.grounds.push(this.physics.add.sprite(0, GamePage.height - 25, 'ground')
      .setOrigin(0, 0)
      .setDisplaySize(GamePage.width, 10)
      .setImmovable()
      .setVisible(false));
    // ground.displayWidth = GamePage.width;
    this.physics.add.collider(this.character, this.grounds);
    this.physics.systems.start(Phaser.Physics.Arcade);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.pointer = this.input.activePointer;

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

    this.atkButton = this.add.circle(GamePage.width - 10, GamePage.height - 10, 40, 0, 0.2).setScrollFactor(0);
    this.atkButton.setPosition(GamePage.width - 10 - this.atkButton.width / 2, GamePage.height - 10 - this.atkButton.height / 2)
      .setInteractive()
      .on('pointerdown', () => this.attack());
  }

  update() {
    this.grounds[0].setDisplaySize(this.character.body.x + GamePage.width * 2, 20);
    this.physics.world.setBounds(0, 0, this.character.body.position.x + GamePage.width, this.physics.world.bounds.height);

    // parallax
    this.backgroundSky.tilePositionX = this.cameras.main.scrollX * 0.2;
    this.backgroundForest.tilePositionX = this.cameras.main.scrollX * 0.4;
    this.backgroundGround.tilePositionX = this.cameras.main.scrollX;

    const velocityX = 400;

    const playerRelativePositionX = this.character.body.position.x - this.cameras.main.worldView.x;

    // avoid bugs
    if (this.character.body.y + this.character.body.height > GamePage.height - 25) {
      this.character.body.y = GamePage.height - 25 - this.character.body.height;
    }
    if (playerRelativePositionX < 30) { this.character.body.x += 1; }

    // check for left and right movement
    if (this.cursors.left.isDown && playerRelativePositionX >= 30) {
      this.cameras.main.followOffset.add(Phaser.Math.Vector2.LEFT);
    } else if (this.cursors.right.isDown && playerRelativePositionX < GamePage.width / 2 - 30) {
      this.cameras.main.followOffset.add(Phaser.Math.Vector2.RIGHT);
    }

    // check for jumps & run
    if (this.cursors.up.isDown && this.character.body.touching.down) {
      this.jump();
    } else if (this.character.body.touching.down) {
      if (!this.atk_anims.includes(this.character.anims.currentAnim.key) || !this.character.anims.isPlaying) {
        this.character.play('running', true);
      }
    }

    // check for attack
    if (this.atkKey.isDown) {
      this.attack();
    }

    this.character.setVelocityX(velocityX);

    // check if hurt => life - 1 & timeout for damage
    this.checkObstacleCollision();

    this.distanceText.setText((this.distance / 10).toString() + ' Meter');
    this.distanceText.setPosition(GamePage.width - this.distanceText.width - 10, 10).setScrollFactor(0);
    this.distance++;
  }

  checkObstacleCollision() {
    if (!this.isDamageSafe) {
      this.physics.collide(this.stones, this.character, (stone) => {
        if (this.atk_anims.includes(this.character.anims.currentAnim.key)) {
          stone.destroy();
        } else {
          this.livesCircles[this.lives].setFillStyle(0, 0.1);
          this.character.anims.play('hurt');
          this.isDamageSafe = true;
          if (this.lives > 0) {
            this.lives--;
          } else {
            this.scene.start('MenuScene');
          }
          setTimeout(() => {
            this.isDamageSafe = false;
          }, 1000);
        }
      });
    }
  }

  attack() {
    if (this.character.anims.currentAnim.key === 'running' || this.character.anims.currentAnim.key === 'jumping') {
      const random = Math.floor(Math.random() * this.atk_anims.length);
      this.character.anims.play(this.atk_anims[random], true);
    } else {
      console.log('Already ATTACKING!');
    }
  }

  jump() {
    this.character.setVelocityY(-600);
    this.character.play('jumping', true);
  }

  // shakeCamera() {
  //   setTimeout(() => {
  //     this.cameras.main.shake(1000, 0.003);
  //     this.shakeCamera();
  //   }, 2000);
  // }
}
