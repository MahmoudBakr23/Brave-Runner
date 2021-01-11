import Phaser from 'phaser';
import config from '../Config/config';

describe('Game Options', () => {
  test('the height should be 600', () => {
    expect(config.height).toEqual(600);
  });

  test('the width should be 800', () => {
    expect(config.width).toEqual(800);
  });

  test('the game type should be AUTO', () => {
    expect(config.type).toBe(Phaser.AUTO);
  });
});