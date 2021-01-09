import 'phaser';
import PreloaderScene from './PreloaderScene';

export default class BootScene extends Phaser.Scene {
  constructor () {
    super('Boot');
  }

  preload () {
      this.load.image('logo', 'assets/zenva_logo.png')
  }

  create () {
      this.add.image(400, 300, 'logo');
      this.scene.start('Preloader', PreloaderScene)
  }
};