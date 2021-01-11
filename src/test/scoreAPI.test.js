const postScore = require('../postScore');

describe('Score Board', () => {
  test('it should return type', () => {
    postScore('Bksh', 20).then(result => {
      expect(typeof result).toBe('JSON');
    }).catch(err => err);
  });

  test('it should send player name and score', () => {
    postScore('Egotte', 10).then(result => {
      expect(result.result).toBe('Leaderboard score created correctly.');
    }).catch(err => err);
  });
});
