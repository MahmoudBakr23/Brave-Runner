import 'phaser'

export default class GameOverScene extends Phaser.Scene {
    constructor() {
        super('GameOver')
    }

    create() {
        this.title = this.add.text(this.game.config.width * 0.5, 128, 'Game Over', {
            fontFamily: 'monospace',
            fontSize: 48,
            fontStyle: 'bold',
            color: '#ffffff'
        })
        this.title.setOrigin(0.5)

        this.retryButton = this.add.sprite(400, 300, 'blueButton1').setInteractive();
      
        this.retryText = this.add.text(0, 0, 'Retry', { fontSize: '32px', fill: '#fff' });
        this.centerButtonText(this.retryText, this.retryButton);
    
        this.retryButton.on('pointerdown', () => {
          this.scene.start('Game');
        });

        this.scoreButton = this.add.sprite(400, 380, 'blueButton1').setInteractive();
        this.scoreText = this.add.text(0, 0, 'Leaderboard', { fontSize: '32px', fill: '#fff' });
        this.centerButtonText(this.scoreText, this.scoreButton);
    
        this.scoreButton.on('pointerdown', () => {
          this.scene.start('Score');
        });
    }

    centerButton(gameObject, offset = 0) {
        Phaser.Display.Align.In.Center(
          gameObject,
          this.add.zone(this.game.config.width / 2,
            this.game.config.height / 2 - offset * 100,
            this.game.config.width, this.game.config.height),
        );
      }
    
      centerButtonText(retryText, retryButton) {
        Phaser.Display.Align.In.Center(
            retryText,
            retryButton,
        );
      }

      centerButtonText(scoreText, scoreButton) {
        Phaser.Display.Align.In.Center(
            scoreText,
            scoreButton,
        );
      }
} 