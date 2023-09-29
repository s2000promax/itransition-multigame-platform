import {
    Component,
    ElementRef,
    OnDestroy,
    OnInit,
    ViewChild
} from '@angular/core';
import {
    BoardT,
    GameState,
    Move
} from '@pages/gameServer/types/game-server.type';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import {
    GameServerService
} from '@pages/gameServer/services/game-server.service';
import { AuthService } from '@services/auth.service';
import { Application, Sprite, Texture } from 'pixi.js';
import PIXI_SOUND from 'pixi-sound';
import { CellSpriteModel } from '@features/seaBattle/model/cell-sprite.model';
import { RoutesEnums } from '@config/routes/routesEnums';


@Component({
    selector: 'mc-seaBattle',
    templateUrl: './seaBattle.component.html',
    styleUrls: ['./seaBattle.component.scss'],
})
export class SeaBattleComponent implements OnInit, OnDestroy {
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
    spritesMy: CellSpriteModel[][] = [];
    spritesRival: CellSpriteModel[][] = [];

    myId!: string;
    gameState!: GameState;
    isMoveBlocked = true;
    rivalMove!: Move;
    availableMoves!: boolean[][];

    gameStateSubscription!: Subscription;

    rows: number = 10;
    cols: number = 10;

    spriteSize: number = 30;
    padding: number = 0;
    offsetX: number = 0;
    fieldsOffsetY: number = 50;
    totalFieldsHeight: number = 0;

    offsetYBase: number = 0;

    constructor(
        private router: Router,
        private gameServerService: GameServerService,
        private auth: AuthService,
    ) {
    }

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

    private initializeSessionValues() {
        this.gameServerService.onGetGameState();

        this.myId = this.gameServerService.myId$.value;

        this.gameStateSubscription =
            this.gameServerService.gameState$.subscribe((gameState) => {
                if (gameState) {
                    this.gameState = gameState;

                    if (gameState.currentPlayer.id === this.myId) {
                        this.isMoveBlocked = false;
                    } else {
                        this.isMoveBlocked = true;
                    }

                    if (gameState.players[0].availableMoves?.length) {
                        this.availableMoves = gameState.players[0].availableMoves;
                    }

                    if (gameState?.players[0]?.board) {
                        this.createMyField(gameState.players[0].board)
                    }

                    if (gameState?.players[0]?.movesMyBoardPlayer) {
                        this.updateFieldAfterMover(gameState?.players[0]?.movesMyBoardPlayer, true);
                    }

                    if (gameState?.players[0]?.movesRivalBoardPlayer) {
                        this.updateFieldAfterMover(gameState?.players[0]?.movesRivalBoardPlayer, false);
                    }

                    let status: string;
                    if (
                        this.gameState.status === 'win' ||
                        this.gameState.status === 'lose'
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
                        mySymbol: '',
                        status: status,
                        rivalName: this.gameState.players.find(
                            (player) => player.id === this.myId,
                        )?.rivalName!,
                        rivalSymbol: '',
                    };
                }
            })
    }

    private initializeScreenSize() {
        this.canvasWidth =
            window.innerWidth - 375 < 70 ? 300 : window.innerWidth - 70;
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

        this.offsetX = (this.game.view.width - this.cols * (this.spriteSize + this.padding) + this.padding) /
            2;

        this.totalFieldsHeight = 2 * this.rows * (this.spriteSize + this.padding) + this.fieldsOffsetY;
        this.offsetYBase = (this.game.view.height - this.totalFieldsHeight + this.padding) / 2;
    }

    private initializeBackground() {
        const backgroundSprite = Sprite.from(
            '/assets/games/sea-battle/background.png',
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

        const offsetX =
            (this.game.view.width - this.cols * (this.spriteSize + this.padding) + this.padding) /
            2;
        const offsetY =
            (this.game.view.height - this.rows * (this.spriteSize + this.padding) + this.padding) /
            2;

        const fieldsOffsetY = 50;
        const totalFieldsHeight = 2 * this.rows * (this.spriteSize + this.padding) + fieldsOffsetY;

        const offsetYBase =
            (this.game.view.height - totalFieldsHeight + this.padding) / 2;

        for (let i = 0; i < 2; i++) {
            const currentSprites = i === 0 ? this.spritesRival : this.spritesMy;
            const currentOffsetY = i === 0 ? offsetYBase : offsetYBase + this.rows * (this.spriteSize + this.padding) + fieldsOffsetY;

            for (let row = 0; row < this.rows; row++) {
                currentSprites[row] = [];
                for (let col = 0; col < this.cols; col++) {
                    const sprite = new CellSpriteModel(row, col, (r, c) =>
                        this.onSpriteClick(r, c, i),
                    );
                    sprite.setSizes(
                        this.spriteSize,
                        offsetX,
                        currentOffsetY,
                        row,
                        col,
                        this.padding
                    );

                    currentSprites[row][col] = sprite;
                    this.game.stage.addChild(sprite.getGraphics());
                }
            }
        }
    }

    private onSpriteClick(row: number, col: number, fieldIndex: number) {
        if (fieldIndex === 1 && !this.isMoveBlocked) {
            if (this.availableMoves[row][col]) {
                PIXI_SOUND.play('correct');

                this.gameServerService.onMove(row, col);
            } else {
                PIXI_SOUND.play('wrong');
            }
        }
    }

    private createMyField(board: BoardT) {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                if (board[row][col] === 'S') {
                    const someCell = new CellSpriteModel(row, col, ((row, col) => {
                    }));
                    const currentOffsetY = this.offsetYBase;
                    someCell.setSizes(this.spriteSize, this.offsetX, currentOffsetY, row, col, this.padding);
                    someCell.setOccupiedByShip();
                    this.game.stage.addChild(someCell.getGraphics());
                }
            }
        }
    }

    private updateFieldAfterMover(board: BoardT, isOffset: boolean) {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                if (board[row][col] === 'H' || board[row][col] === 'M') {
                    const someCell = new CellSpriteModel(row, col, ((row, col) => {
                    }));
                    const currentOffsetY = !isOffset ? this.offsetYBase : this.offsetYBase + this.rows * (this.spriteSize + this.padding) + this.fieldsOffsetY;

                    someCell.setSizes(this.spriteSize, this.offsetX, currentOffsetY, row, col, this.padding);

                    if (board[row][col] === 'H') {
                        someCell.createDraw('cross');
                    } else {
                        someCell.createDraw('toe');
                    }

                    this.game.stage.addChild(someCell.getGraphics());
                }

            }
        }
    }

    private onExit() {
        return this.router.navigate([RoutesEnums.DASHBOARD]);
    }

    ngOnDestroy() {
        this.gameStateSubscription?.unsubscribe();
    }
}
