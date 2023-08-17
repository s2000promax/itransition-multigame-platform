import {
    Component,
    ElementRef,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import { Application, Graphics, Sprite } from 'pixi.js';
// import PIXI from 'pixi-sound';
import PIXI_SOUND from 'pixi-sound';
import { DrawingModel } from '@features/ticTacToe/model/drawing.model';

@Component({
    selector: 'mc-ticTacToe',
    templateUrl: './ticTacToe.component.html',
    styleUrls: ['./ticTacToe.component.scss'],
})
export class TicTacToeComponent implements OnInit, OnDestroy {
    @ViewChild('game', { static: true }) gameContainer!: ElementRef;

    game!: Application;
    sound!: typeof PIXI_SOUND;

    canvasWidth!: number;
    canvasHeight!: number;

    ngOnInit() {
        this.initializeValues();

        this.createSprites();
    }

    private initializeValues() {
        this.initializeScreenSize();
        this.initializeCanvas();
        this.initializeBackground();
        this.initializeSounds();
    }

    createSprites() {
        const rows = 3;
        const cols = 3;
        const spriteSize = 50;
        const padding = 10;
        const offsetX =
            (this.game.view.width - cols * (spriteSize + padding) + padding) /
            2;
        const offsetY =
            (this.game.view.height - rows * (spriteSize + padding) + padding) /
            2;

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const rect = new Graphics();
                rect.beginFill(0xf1efa8);
                rect.alpha = 0.5;
                rect.drawRoundedRect(0, 0, spriteSize, spriteSize, 10);
                rect.endFill();
                rect.x = offsetX + col * (spriteSize + padding);
                rect.y = offsetY + row * (spriteSize + padding);
                rect.interactive = true;

                rect.on('pointerdown', () =>
                    this.onSpriteClick(rect, row, col),
                );

                this.game.stage.addChild(rect);
            }
        }
    }

    onSpriteClick(rect: Graphics, row: number, col: number) {
        console.log(row, col);
        PIXI_SOUND.play('correct');

        // rect.addChild(new DrawingModel().cross());
        rect.addChild(new DrawingModel().toe());
    }

    private initializeScreenSize() {
        this.canvasWidth =
            window.innerWidth - 375 < 375 ? 300 : window.innerWidth - 375;
        this.canvasHeight = 0.75 * this.canvasWidth;
    }

    private initializeCanvas() {
        this.game = new Application<HTMLCanvasElement>({
            width: this.canvasWidth,
            height: this.canvasHeight,
            backgroundAlpha: 1,
            backgroundColor: 0xffffff,
            antialias: true,
        });
        this.game.stage.interactive = true;
        this.gameContainer.nativeElement.appendChild(this.game.view);
    }

    private initializeBackground() {
        const backgroundSprite = Sprite.from(
            '/assets/games/tic-tac-toe/background.png',
        );
        backgroundSprite.scale.set(
            this.canvasWidth / 800,
            this.canvasHeight / 600,
        );

        this.game.stage.addChild(backgroundSprite);
    }

    private initializeSounds() {
        PIXI_SOUND.add(
            'correct',
            '/assets/games/tic-tac-toe/voices/correct.wav',
        );
        PIXI_SOUND.add('lose', '/assets/games/tic-tac-toe/voices/lose.wav');
        PIXI_SOUND.add('win', '/assets/games/tic-tac-toe/voices/win.wav');
        PIXI_SOUND.add('wrong', '/assets/games/tic-tac-toe/voices/wrong.wav');
    }

    ngOnDestroy() {
        this.game.stage.destroy(true);
    }
}
