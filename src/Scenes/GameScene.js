import 'phaser';
// import config from '../Config/config';
import {options} from '../Config/gameOptions';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('Game')
    }

    preload() {
        this.load.image('platform', 'assets/platform.png')
        this.load.image('player', 'assets/dude.png')
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

        this.addPlatform(this.game.config.width, this.game.config.width / 2)

        this.player = this.physics.add.sprite(options.playerStartPosition, this.game.config.height / 2, 'player')
        this.player.setGravityY(options.playerGravity)

        this.physics.add.collider(this.player, this.platformGroup)

        this.input.on('pointerdown', this.jump, this)
    }

    addPlatform(platformWidth, posX) {
        let platform;

        if(this.platformPool.getLength()){
            platform = this.platformPool.getFirst()
            platform.x = posX
            platform.active = true
            platform.visible = true
            this.platformPool.remove(platform)
        } else {
            platform = this.physics.add.sprite(posX, this.game.config.height * 0.8, 'platform')
            platform.setImmovable(true)
            platform.setVelocityX(options.platformStartSpeed * -1)
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
        }
    }

    update() {
        if(this.player.y > this.game.config.height){
            this.scene.start('Game')
        }

        this.player.x = options.playerStartPosition;

        let minDistance = this.game.config.width;
        this.platformGroup.getChildren().forEach(function(platform){
            let platformDistance = this.game.config.width - platform.x - platform.displayWidth / 2;
            minDistance = Math.min(minDistance, platformDistance);
            if(platform.x < - platform.displayWidth / 2){
                this.platformGroup.killAndHide(platform);
                this.platformGroup.remove(platform);
            }
        }, this);

        if(minDistance > this.nextPlatformDistance){
            var nextPlatformWidth = Phaser.Math.Between(options.platformSizeRange[0], options.platformSizeRange[1]);
            this.addPlatform(nextPlatformWidth, this.game.config.width + nextPlatformWidth / 2);
        }
    }
}