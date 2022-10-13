import { GamePage } from './../game.page';
export default class IntroScene extends Phaser.Scene {
  background: Phaser.GameObjects.Image;
  shakeInterval;
  zoomTimer;
  transitionTimer;
  upKey: Phaser.Input.Keyboard.Key;

  constructor() {
    super('IntroScene');
  }

  preload() {
    this.load.image('train', 'assets/backgrounds/train.png');
  }

  create() {
    this.upKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

    this.shakeInterval = setInterval(() => this.cameras.main.shake(1000, 0.003), 1000);

    // this.scene.start('GameScene');
    this.background = this.add.image(0, 0, 'train').setOrigin(0, 0);
    this.background.setDisplaySize(GamePage.width, GamePage.height);

    this.cameras.main.fadeIn(1500);

    this.zoomTimer = setTimeout(() => {
      this.cameras.main.pan(GamePage.width / 2, GamePage.height * 0.45);
      this.cameras.main.zoomTo(4, 2500, 'Linear', false, () => {

      });

      this.transitionTimer = setTimeout(() => {
        console.log('STARTET TRANSITION');
        this.scene.transition({ target: 'GameScene', duration: 1000 });
        clearInterval(this.shakeInterval);
      }, 2000);
    }, 2000);

  }

  update() {
    if(this.upKey.isDown){
      try{
        this.scene.stop('IntroScene');
        clearTimeout(this.zoomTimer);
        clearTimeout(this.transitionTimer);
        clearInterval(this.shakeInterval);
        this.zoomTimer = null;
        this.transitionTimer = null;
        this.shakeInterval = null;
      } catch(e) {}
      this.scene.stop();
      this.scene.start('GameScene');
    }
  }

}
