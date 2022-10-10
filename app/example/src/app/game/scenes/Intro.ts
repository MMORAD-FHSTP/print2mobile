import { GamePage } from './../game.page';
export default class IntroScene extends Phaser.Scene {
  background: Phaser.GameObjects.Image;

  constructor() {
    super('IntroScene');
  }

  preload() {
    this.load.image('train', 'assets/backgrounds/train.png');
  }

  create() {
    this.shakeCamera();
    // this.scene.start('GameScene');
    this.background = this.add.image(0, 0, 'train').setOrigin(0, 0);
    this.background.setDisplaySize(GamePage.width, GamePage.height);

    this.cameras.main.fadeIn(1500);


    setTimeout(() => {
      this.cameras.main.pan(GamePage.width / 2, GamePage.height * 0.45);
      this.cameras.main.zoomTo(4, 2500, 'Linear', false, () => {

      });

      setTimeout(() => {
        console.log('STARTET TRANSITION');
        this.scene.transition({ target: 'GameScene', duration: 3500 });
      }, 2000);
    }, 2000);

  }

  update() { }

  shakeCamera() {
    setTimeout(() => {
      this.cameras.main.shake(1000, 0.003);
      this.shakeCamera();
    }, 1000);
  }

}
