import { GamePage } from './../game.page';

export default class MenuScene extends Phaser.Scene {
  container: Phaser.GameObjects.Container;
  updateFirstTime: boolean;

  constructor() {
    super('MenuScene');
    this.updateFirstTime = true;
  }

  // created() {
  //   console.log('CREATED CALLED');
  //   const mainCam = this.cameras.main;
  //   const screenCenterX: number = mainCam.worldView.x + mainCam.width / 2;
  //   const screenCenterY: number = mainCam.worldView.y + mainCam.height / 2;
  //   this.add.rectangle(mainCam.worldView.x, mainCam.worldView.y, mainCam.width, mainCam.height)
  //     .setOrigin(0, 0)
  //     .setFillStyle(0x000000, 0.3);
  //   this.add.text(screenCenterX, screenCenterY, 'GAME OVER! REPLAY?', { color: '#000000' })
  //     .setOrigin(0.5)
  //     .setDepth(999)
  //     .setDisplaySize(GamePage.width * 0.5, 30);
  //   this.add.text(screenCenterX, GamePage.height * 0.35, 'REPLAY')
  //     .setDepth(999)
  //     .setDisplaySize(GamePage.width * 0.5, 30)
  //     .setOrigin(0.5);
  //   this.add.rectangle(screenCenterX, GamePage.height * 0.3, GamePage.width * 0.5, GamePage.height * 0.2, 0xffffff)
  //     .setDepth(999)
  //     .setOrigin(0.5)
  //     .addListener('click', () => { this.scene.resume('GameScene'); this.scene.stop(); });
  // }

  update() {
    // this.container.setVisible(true);
    console.log('HÄÄ');

    if (this.updateFirstTime) {
      this.createMenu();
    }
  }

  createMenu() {
    const mainCam = this.cameras.main;
    const screenCenterX: number = mainCam.worldView.x + mainCam.width / 2;
    const screenCenterY: number = mainCam.worldView.y + mainCam.height / 2;
    const overlay = this.add.rectangle(mainCam.worldView.x, mainCam.worldView.y, mainCam.width, mainCam.height)
      .setOrigin(0, 0)
      .setFillStyle(0x000000, 0.5);
    const gameOverTxt = this.add.text(screenCenterX, GamePage.height * 0.3, 'GAME OVER!', { color: '#FF0000' })
      .setOrigin(0.5)
      .setDepth(999)
      .setScale(2.5);
    const restartButton = this.add.rectangle(screenCenterX, GamePage.height * 0.5, GamePage.width * 0.5, GamePage.height * 0.2, 0xaaaaaa, 0.2)
      .setDepth(999)
      .setOrigin(0.5)
      .setInteractive()
      .on('pointerover', () => {
        restartButton.setAlpha(0.1);
      })
      .on('pointerout', () => {
        restartButton.setAlpha(1);
      })
      .on('pointerdown', () => {
        this.updateFirstTime = true;
        this.scene.start('GameScene');
      });
    const replayTxt = this.add.text(screenCenterX, GamePage.height * 0.51, 'REPLAY', { color: '#FF0000' })
      .setDepth(999)
      .setScale(2)
      .setOrigin(0.5);

    this.container = this.add.container();
    this.container.add([overlay, gameOverTxt, replayTxt, restartButton]);

    this.updateFirstTime = false;
    // this.container.setVisible(false);
  }
}
