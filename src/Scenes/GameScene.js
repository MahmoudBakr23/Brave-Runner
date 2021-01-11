import Phaser from 'phaser';
import { options } from '../Config/gameOptions';
import { getScores } from '../scoreAPI';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  create() {
    this.add.image(400, 300, 'sky');

    this.addedPlatforms = 0;

    this.platformGroup = this.add.group({
      removeCallback(platform) {
        platform.scene.platformPool.add(platform);
      },
    });

    this.platformPool = this.add.group({
      removeCallback(platform) {
        platform.scene.platformGroup.add(platform);
      },
    });

    this.coinGroup = this.add.group({
      removeCallback(coin) {
        coin.scene.coinPool.add(coin);
      },
    });

    this.coinPool = this.add.group({
      removeCallback(coin) {
        coin.scene.coinGroup.add(coin);
      },
    });

    this.playerJumps = 0;

    this.addPlatform(this.game.config.width, this.game.config.width / 4, this.game.config.height * options.platformVerticalLimit[1]);

    this.player = this.physics.add.sprite(options.playerStartPosition, this.game.config.height * 0.7, 'player');
    this.player.setGravityY(options.playerGravity);

    this.anims.create({
      key: 'run',
      frames: this.anims.generateFrameNumbers('player', {
        start: 0,
        end: 1,
      }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: 'rotate',
      frames: this.anims.generateFrameNumbers('coin', {
        start: 0,
        end: 5,
      }),
      frameRate: 15,
      yoyo: true,
      repeat: -1,
    });

    this.physics.add.collider(this.player, this.platformGroup, () => {
      if (!this.player.anims.isPlaying) {
        this.player.anims.play('run');
      }
    }, null, this);

    this.physics.add.overlap(this.player, this.coinGroup, collectCoin, null, this);

    function collectCoin(player, coin) {
      options.score += 10;
      options.scoreText.setText(`Score: ${options.score}`);
      coin.disableBody(true, true);
    }

    this.input.on('pointerdown', this.jump, this);
    options.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });
  }

  addPlatform(platformWidth, posX, posY) {
    this.addedPlatforms++;
    let platform;

    if (this.platformPool.getLength()) {
      platform = this.platformPool.getFirst();
      platform.x = posX;
      platform.y = posY;
      platform.active = true;
      platform.visible = true;
      this.platformPool.remove(platform);
      platform.displayWidth = platformWidth;
      platform.tileScaleX = 1 / platform.scaleX;
    } else {
      platform = this.add.tileSprite(posX, posY, platformWidth, 32, 'platform');
      this.physics.add.existing(platform);
      platform.body.setImmovable(true);
      platform.body.setVelocityX(Phaser.Math.Between(options.platformSpeedRange[0], options.platformSpeedRange[1]) * -1);
      this.platformGroup.add(platform);
    }

    platform.displayWidth = platformWidth;
    this.nextPlatformDistance = Phaser.Math.Between(options.spawnRange[0], options.spawnRange[1]);

    if (this.addedPlatforms > 1) {
      if (Phaser.Math.Between(1, 100) <= options.coinPercent) {
        if (this.coinPool.getLength()) {
          const coin = this.coinPool.getFirst();
          coin.x = posX;
          coin.y = posY - 96;
          coin.alpha = 1;
          coin.active = true;
          coin.visible = true;
          this.coinPool.remove(coin);
        } else {
          const coin = this.physics.add.sprite(posX, posY - 96, 'coin');
          coin.setImmovable(true);
          coin.setVelocityX(platform.body.velocity.x);
          coin.anims.play('rotate');
          this.coinGroup.add(coin);
        }
      }
    }
  }

  async topScore() {
    const resultObject = await getScores();

    if (Array.isArray(resultObject.result)) {
      this.scores = resultObject.result.sort((a, b) => ((a.score > b.score) ? -1 : 1));

      for (let i = 0; i < 1; i += 1) {
        localStorage.setItem('highScore', this.scores[0].score);
      }
    }
  }

  jump() {
    if (this.player.body.touching.down || (this.playerJumps > 0 && this.playerJumps < options.jumps)) {
      if (this.player.body.touching.down) {
        this.playerJumps = 0;
      }
      this.player.setVelocityY(options.jumpForce * -1);
      this.playerJumps++;

      this.player.anims.stop();
    }
  }

  update() {
    if (this.player.y > this.game.config.height) {
      this.scene.start('GameOver');
    }
    this.player.x = options.playerStartPosition;

    let minDistance = this.game.config.width;
    let rightmostPlatformHeight = 0;
    this.platformGroup.getChildren().forEach( (platform) => {
      const platformDistance = this.game.config.width - platform.x - platform.displayWidth / 2;
      if (platformDistance < minDistance) {
        minDistance = platformDistance;
        rightmostPlatformHeight = platform.y;
      }
      if (platform.x < -platform.displayWidth / 2) {
        this.platformGroup.killAndHide(platform);
        this.platformGroup.remove(platform);
      }
    }, this);

    this.coinGroup.getChildren().forEach( (coin) => {
      if (coin.x < -coin.displayWidth / 2) {
        this.coinGroup.killAndHide(coin);
        this.coinGroup.remove(coin);
      }
    }, this);

    if (minDistance > this.nextPlatformDistance) {
      const nextPlatformWidth = Phaser.Math.Between(options.platformSizeRange[0], options.platformSizeRange[1]);
      const platformRandomHeight = options.platformHeighScale * Phaser.Math.Between(options.platformHeightRange[0], options.platformHeightRange[1]);
      const nextPlatformGap = rightmostPlatformHeight + platformRandomHeight;
      const minPlatformHeight = this.game.config.height * options.platformVerticalLimit[0];
      const maxPlatformHeight = this.game.config.height * options.platformVerticalLimit[1];
      const nextPlatformHeight = Phaser.Math.Clamp(nextPlatformGap, minPlatformHeight, maxPlatformHeight);
      this.addPlatform(nextPlatformWidth, this.game.config.width + nextPlatformWidth / 2, nextPlatformHeight);
    }
  }
}