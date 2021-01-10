import 'phaser';
import {options} from '../Config/gameOptions';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('Game')
    }

    preload() {
    }

    create() {
        this.add.image(400, 300, 'sky');

        this.addedPlatforms = 0;

        this.platformGroup = this.add.group({
            removeCallback: function(platform){
                platform.scene.platformPool.add(platform)
            }
        })
    
        this.platformPool = this.add.group({
            removeCallback: function(platform){
                platform.scene.platformGroup.add(platform)
            }
        })

        this.coinGroup = this.add.group({
            removeCallback: function(coin){
                coin.scene.coinPool.add(coin)
            }
        });

        this.coinPool = this.add.group({
            removeCallback: function(coin){
                coin.scene.coinGroup.add(coin)
            }
        });

        this.playerJumps = 0;

        this.addPlatform(this.game.config.width, this.game.config.width / 4, this.game.config.height * options.platformVerticalLimit[1])

        this.player = this.physics.add.sprite(options.playerStartPosition, this.game.config.height * 0.7, 'player')
        this.player.setGravityY(options.playerGravity)

        this.anims.create({
            key: "run",
            frames: this.anims.generateFrameNumbers("player", {
                start: 0,
                end: 1
            }),
            frameRate: 8,
            repeat: -1
        })

        this.anims.create({
            key: "rotate",
            frames: this.anims.generateFrameNumbers("coin", {
                start: 0,
                end: 5
            }),
            frameRate: 15,
            yoyo: true,
            repeat: -1
        });

        this.physics.add.collider(this.player, this.platformGroup, function(){
            if(!this.player.anims.isPlaying){
                this.player.anims.play('run')
            }
        }, null, this)

        this.physics.add.overlap(this.player, this.coinGroup, collectCoin, null, this);

        function collectCoin(player, coin){
            options.score += 10;
            options.scoreText.setText('Score: ' + options.score)
            coin.disableBody(true, true);

            // this.tweens.add({
            //     targets: coin,
            //     y: coin.y - 100,
            //     alpha: 0,
            //     duration: 400,
            //     ease: "Cubic.easeOut",
            //     callbackScope: this,
            //     onComplete: function(){
            //         this.coinGroup.killAndHide(coin);
            //         this.coinGroup.remove(coin);
            //     }
            // });
        }

        this.input.on('pointerdown', this.jump, this)
        options.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });
    }

    addPlatform(platformWidth, posX, posY) {
        this.addedPlatforms ++;
        let platform;

        if(this.platformPool.getLength()){
            platform = this.platformPool.getFirst()
            platform.x = posX
            platform.y = posY;
            platform.active = true
            platform.visible = true
            this.platformPool.remove(platform)
            let newRatio =  platformWidth / platform.displayWidth;
            platform.displayWidth = platformWidth;
            platform.tileScaleX = 1 / platform.scaleX;
        } else {
            platform = this.add.tileSprite(posX, posY, platformWidth, 32, 'platform')
            this.physics.add.existing(platform);
            platform.body.setImmovable(true)
            platform.body.setVelocityX(Phaser.Math.Between(options.platformSpeedRange[0], options.platformSpeedRange[1]) * -1)
            this.platformGroup.add(platform)
        }
        
        platform.displayWidth = platformWidth
        this.nextPlatformDistance = Phaser.Math.Between(options.spawnRange[0], options.spawnRange[1])

        if(this.addedPlatforms > 1){
            if(Phaser.Math.Between(1, 100) <= options.coinPercent){
                if(this.coinPool.getLength()){
                    let coin = this.coinPool.getFirst();
                    coin.x = posX;
                    coin.y = posY - 96;
                    coin.alpha = 1;
                    coin.active = true;
                    coin.visible = true;
                    this.coinPool.remove(coin);
                }
                else{
                    let coin = this.physics.add.sprite(posX, posY - 96, "coin");
                    coin.setImmovable(true);
                    coin.setVelocityX(platform.body.velocity.x);
                    coin.anims.play("rotate");
                    this.coinGroup.add(coin);
                }
            }
        }
    }

    jump() {
        if(this.player.body.touching.down || (this.playerJumps > 0 && this.playerJumps < options.jumps)){
            if(this.player.body.touching.down){
                this.playerJumps = 0
            }
            this.player.setVelocityY(options.jumpForce * -1)
            this.playerJumps ++

            this.player.anims.stop()
        }
    }

    update() {
        if(this.player.y > this.game.config.height){
            this.scene.start("Game");
            options.score = 0;
        }
        this.player.x = options.playerStartPosition;

        let minDistance = this.game.config.width;
        let rightmostPlatformHeight = 0;
        this.platformGroup.getChildren().forEach(function(platform){
            let platformDistance = this.game.config.width - platform.x - platform.displayWidth / 2;
            if(platformDistance < minDistance){
                minDistance = platformDistance;
                rightmostPlatformHeight = platform.y;
            }
            if(platform.x < - platform.displayWidth / 2){
                this.platformGroup.killAndHide(platform);
                this.platformGroup.remove(platform);
            }
        }, this);

        this.coinGroup.getChildren().forEach(function(coin){
            if(coin.x < - coin.displayWidth / 2){
                this.coinGroup.killAndHide(coin);
                this.coinGroup.remove(coin);
            }
        }, this);

        if(minDistance > this.nextPlatformDistance){
            let nextPlatformWidth = Phaser.Math.Between(options.platformSizeRange[0], options.platformSizeRange[1]);
            let platformRandomHeight = options.platformHeighScale * Phaser.Math.Between(options.platformHeightRange[0], options.platformHeightRange[1]);
            let nextPlatformGap = rightmostPlatformHeight + platformRandomHeight;
            let minPlatformHeight = this.game.config.height * options.platformVerticalLimit[0];
            let maxPlatformHeight = this.game.config.height * options.platformVerticalLimit[1];
            let nextPlatformHeight = Phaser.Math.Clamp(nextPlatformGap, minPlatformHeight, maxPlatformHeight);
            this.addPlatform(nextPlatformWidth, this.game.config.width + nextPlatformWidth / 2, nextPlatformHeight);
        }
    }
}