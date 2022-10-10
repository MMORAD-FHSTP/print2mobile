/* eslint-disable max-len */

import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Platform } from '@ionic/angular';

import Phaser from 'phaser';
import GameScene from './scenes/Game';
import IntroScene from './scenes/Intro';

// export default class Game extends Phaser.Game {

//   constructor(config) {
//     super(config);
//   }

//   create() {
//   }

//   update() {
//   }
// }

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
})
export class GamePage implements OnInit {
  static width: number;
  static height: number;
  static phaserGame: Phaser.Game;
  static platform: Platform;

  @ViewChild('game', { static: true }) gameContainer: ElementRef;

  config: Phaser.Types.Core.GameConfig;

  constructor(private platform: Platform) {
    // const width: number = platform.width() < 780 ? platform.width() : 780;
    // const height: number = platform.height() < 430 ? platform.height() : 430;

  }

  ngOnInit(): void {
    // console.log(this.gameContainer.nativeElement.;
  }

  ionViewDidEnter() {
    const width: number = this.gameContainer.nativeElement.offsetWidth;
    const height: number = this.gameContainer.nativeElement.offsetHeight;

    console.log('width, height:', width, height);
    // const height: number = this.gameContainer?.clientHeight;

    this.config = {
      type: Phaser.AUTO,
      width,
      height,
      physics: {
        default: 'arcade'
      },
      parent: 'game',
      scene: [IntroScene, GameScene]
    };

    GamePage.platform = this.platform;
    GamePage.width = width;
    GamePage.height = height;

    GamePage.phaserGame = new Phaser.Game(this.config);
  }
}
