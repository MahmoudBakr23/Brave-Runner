import 'phaser';
// import config from '../Config/config';
import {options} from '../Config/gameOptions';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('Game')
    }

    preload() {
        this.load.image('platform', 'assets/platform.png')
        this.load.spritesheet('player', 'assets/dude.png', {
            frameWidth: 24,
            frameHeight: 48
        })
    }

    create() {
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

        this.playerJumps = 0;

        this.addPlatform(this.game.config.width, this.game.config.width / 2, this.game.config.height * options.platformVerticalLimit[1])

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

        this.physics.add.collider(this.player, this.platformGroup, function(){
            if(!this.player.anims.isPlaying){
                this.player.anims.play('run')
            }
        }, null, this)

        this.input.on('pointerdown', this.jump, this)
    }

    addPlatform(platformWidth, posX, posY) {
        let platform;

        if(this.platformPool.getLength()){
            platform = this.platformPool.getFirst()
            platform.x = posX
            platform.active = true
            platform.visible = true
            this.platformPool.remove(platform)
        } else {
            platform = this.physics.add.sprite(posX, posY, 'platform')
            platform.setImmovable(true)
            platform.setVelocityX(Phaser.Math.Between(options.platformSpeedRange[0], options.platformSpeedRange[1]) * -1)
            this.platformGroup.add(platform)
        }
        platform.displayWidth = platformWidth
        this.nextPlatformDistance = Phaser.Math.Between(options.spawnRange[0], options.spawnRange[1])
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
        if(this.player.y > game.config.height){
            this.scene.start("Game");
        }
        this.player.x = options.playerStartPosition;

        let minDistance = game.config.width;
        let rightmostPlatformHeight = 0;
        this.platformGroup.getChildren().forEach(function(platform){
            let platformDistance = game.config.width - platform.x - platform.displayWidth / 2;
            if(platformDistance < minDistance){
                minDistance = platformDistance;
                rightmostPlatformHeight = platform.y;
            }
            if(platform.x < - platform.displayWidth / 2){
                this.platformGroup.killAndHide(platform);
                this.platformGroup.remove(platform);
            }
        }, this);

        if(minDistance > this.nextPlatformDistance){
            let nextPlatformWidth = Phaser.Math.Between(options.platformSizeRange[0], options.platformSizeRange[1]);
            let platformRandomHeight = options.platformHeighScale * Phaser.Math.Between(options.platformHeightRange[0], options.platformHeightRange[1]);
            let nextPlatformGap = rightmostPlatformHeight + platformRandomHeight;
            let minPlatformHeight = game.config.height * options.platformVerticalLimit[0];
            let maxPlatformHeight = game.config.height * options.platformVerticalLimit[1];
            let nextPlatformHeight = Phaser.Math.Clamp(nextPlatformGap, minPlatformHeight, maxPlatformHeight);
            this.addPlatform(nextPlatformWidth, game.config.width + nextPlatformWidth / 2, nextPlatformHeight);
        }
    }
}