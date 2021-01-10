import 'phaser';
import TitleScene from './TitleScene';
import {options} from '../Config/gameOptions';
import config from '../Config/config';

export default class InputScene extends Phaser.Scene {
    constructor() {
        super('Input');
    }

    create() {
        this.input = this.add.dom(200, 235, 'input', {
            type: 'text',
            name: 'name',
            fontSize: '30px',
            backgroundColor: '#fff',
          });
    
          this.inputButton = this.add.sprite(220, 390, 'blueButton1').setInteractive();
          this.centerButton(this.inputButton, 1)

          this.inputText = this.add.text(0, 0, 'Submit', { fontSize: '32px', fill: '#fff' });
          this.centerButtonText(this.inputText, this.inputButton);

          const nameInput = document.createElement('input');
          nameInput.placeholder = 'Insert Your Name: ';
          nameInput.type = 'text';
          nameInput.id = 'username';
          nameInput.className = 'username';
      
          document.querySelector('#game').appendChild(nameInput);

          this.inputButton.on('pointerdown', () => {
            if (nameInput.value !== '') {
              localStorage.setItem('playerName', nameInput.value);
              nameInput.style.display = 'none';
              this.scene.start('Title');
            }
          });
    }

    centerButton (gameObject, offset = 0) {
        Phaser.Display.Align.In.Center(
          gameObject,
          this.add.zone(config.width/2, config.height/2 - offset * 100, config.width, config.height)
        );
      }
      
      centerButtonText (inputText, inputButton) {
        Phaser.Display.Align.In.Center(
          inputText,
          inputButton
        );
      }
} 