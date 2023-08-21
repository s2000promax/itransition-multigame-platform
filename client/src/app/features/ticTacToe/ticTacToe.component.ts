import {
    Component,
    ElementRef,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import { Application, Sprite, Texture } from 'pixi.js';
import PIXI_SOUND from 'pixi-sound';
import { Router } from '@angular/router';
import { RoutesEnums } from '@config/routes/routesEnums';
import { Subscription } from 'rxjs';
import { CellSpriteModel } from '@features/ticTacToe/model/cell-sprite.model';
import { AuthService } from '@services/auth.service';
import {
    GameState,
    Move,
    Symbols,
} from '@pages/gameServer/types/game-server.type';
import { GameServerService } from '@pages/gameServer/services/game-server.service';

@Component({
    selector: 'mc-ticTacToe',
    templateUrl: './ticTacToe.component.html',
})
export class TicTacToeComponent implements OnInit, OnDestroy {
    @ViewChild('game', { static: true }) gameContainer!: ElementRef;

    game!: Application;
    sound!: typeof PIXI_SOUND;

    canvasWidth!: number;
    canvasHeight!: number;
    headerContainerStyle!: string;
    header = {
        myName: this.auth.getUsername,
        mySymbol: '',
        status: '',
        rivalName: 'waiting',
        rivalSymbol: '',
    };

    sprites: CellSpriteModel[][] = [];

    myId!: string;
    mySymbol!: Symbols;
    rivalSymbol!: Symbols;

    gameState!: GameState;
    isMoveBlocked = true;
    rivalMove!: Move;

    gameStateSubscription!: Subscription;

    constructor(
        private router: Router,
        private gameServerService: GameServerService,
        private auth: AuthService,
    ) {}

    ngOnInit() {
        this.initializeValues();
        this.createSprites();
    }

    private initializeValues() {
        this.initializeSessionValues();
        this.initializeScreenSize();
        this.initializeCanvas();
        this.initializeBackground();
        this.initializeSounds();
    }

    createSprites() {
        const btnExitTexture = Texture.from(
            '/assets/games/tic-tac-toe/exit-btn.png',
        );
        const btnExitSprite = new Sprite(btnExitTexture);
        btnExitSprite.width = 30;
        btnExitSprite.height = 30;
        btnExitSprite.position.set(this.canvasWidth - 40, 10);
        btnExitSprite.alpha = 0.6;
        btnExitSprite.interactive = true;
        btnExitSprite.cursor = 'pointer';
        btnExitSprite.on('pointerdown', () => this.onExit());

        this.game.stage.addChild(btnExitSprite);

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
            this.sprites[row] = [];
            for (let col = 0; col < cols; col++) {
                const sprite = new CellSpriteModel(row, col, (r, c) =>
                    this.onSpriteClick(r, c),
                );
                sprite.setSizes(
                    spriteSize,
                    offsetX,
                    offsetY,
                    row,
                    col,
                    padding,
                );

                this.sprites[row][col] = sprite;
                this.game.stage.addChild(sprite.getGraphics());
            }
        }
    }

    public makeExternalMove(row: number, col: number) {
        const sprite = this.sprites[row][col];
        if (sprite) {
            PIXI_SOUND.play('correct');
            sprite.createDraw(this.rivalSymbol);
        }
    }

    private onSpriteClick(row: number, col: number) {
        if (!this.isMoveBlocked) {
            if (this.gameState.availableMoves[row][col]) {
                PIXI_SOUND.play('correct');

                this.sprites[row][col].createDraw(this.mySymbol);
                this.gameServerService.onMove(row, col);
            } else {
                PIXI_SOUND.play('wrong');
            }
        }
    }

    private onExit() {
        return this.router.navigate([RoutesEnums.DASHBOARD]);
    }

    private initializeSessionValues() {
        this.gameServerService.onGetGameState();

        this.myId = this.gameServerService.myId$.value;

        this.gameStateSubscription =
            this.gameServerService.gameState$.subscribe((gameState) => {
                if (gameState) {
                    this.gameState = gameState;

                    this.mySymbol = gameState.players.find(
                        (player) => player.id === this.myId,
                    )!.played!;
                    this.rivalSymbol = gameState.players.find(
                        (player) => player.id !== this.myId,
                    )!.played!;

                    if (gameState.currentPlayer.id === this.myId) {
                        this.isMoveBlocked = false;
                    } else {
                        this.isMoveBlocked = true;
                    }
                }

                if (gameState?.rivalMove) {
                    if (gameState.currentPlayer.id === this.myId) {
                        this.rivalMove = gameState.rivalMove;
                        this.makeExternalMove(
                            gameState.rivalMove.row,
                            gameState.rivalMove.col,
                        );
                    }
                }

                let status: string;
                if (
                    this.gameState.status === 'win' ||
                    this.gameState.status === 'lose' ||
                    this.gameState.status === 'draw'
                ) {
                    status = this.gameState.status;
                } else {
                    status =
                        this.gameState.currentPlayer.id === this.myId
                            ? 'You move!'
                            : ' Rival move!';
                }

                this.header = {
                    ...this.header,
                    mySymbol: `(${this.mySymbol})`,
                    status: status,
                    rivalName: this.gameState.players.find(
                        (player) => player.id !== this.myId,
                    )!.username,
                    rivalSymbol: `(${this.rivalSymbol})`,
                };
            });
    }

    private initializeScreenSize() {
        this.canvasWidth =
            window.innerWidth - 375 < 375 ? 300 : window.innerWidth - 375;
        this.canvasHeight = 0.75 * this.canvasWidth;

        this.headerContainerStyle = `width: ${this.canvasWidth}px`;
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
        this.gameStateSubscription?.unsubscribe();
    }
}
