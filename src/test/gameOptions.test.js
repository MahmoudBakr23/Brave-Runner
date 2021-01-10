import { options } from '../Config/gameOptions';

describe('Game Options', () => {
  test('it should return the value of score at the beginning of the game', () => {
    expect(options.score).toEqual(0);
  });

  test('it should return playerGravity is 900', () => {
    expect(options.playerGravity).toEqual(900);
  });

  test('it should return jumpForce is 400', () => {
    expect(options.jumpForce).toEqual(400);
  });

  test('it should return playerStartPosition is 200', () => {
    expect(options.playerStartPosition).toEqual(200);
  });
});