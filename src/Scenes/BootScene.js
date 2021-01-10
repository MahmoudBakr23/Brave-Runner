import Phaser from 'phaser';
import PreloaderScene from './PreloaderScene';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  create() {
    this.scene.start('Preloader', PreloaderScene);
  }
}