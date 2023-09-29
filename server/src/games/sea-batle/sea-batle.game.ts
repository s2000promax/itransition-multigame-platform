import {
    BoardT,
    GameState,
    Player,
} from '../../game-platform/types/game-platform.type';

export class SeaBattleGame {
    private boardPlayer1: BoardT;
    private availableMovesBoardPlayer1: boolean[][];

    private boardPlayer2: BoardT;
    private availableMovesBoardPlayer2: boolean[][];

    private ships = [
        { size: 4, count: 1 },
        { size: 3, count: 2 },
        { size: 2, count: 3 },
        { size: 1, count: 4 },
    ];

    private players: Player[];
    private currentPlayer: Player;

    constructor(players: Player[]) {
        this.players = players;
        this.currentPlayer =
            this.players[Math.floor(Math.random() * players.length)];
        this.boardPlayer1 = this.initBoard();
        this.boardPlayer2 = this.initBoard();

        this.placeShips(this.boardPlayer1);
        this.placeShips(this.boardPlayer2);

        this.availableMovesBoardPlayer1 = this.initAvailableMoves();
        this.availableMovesBoardPlayer2 = this.initAvailableMoves();

        this.players = players.map((player, index) => {
            return {
                id: player.id,
                username: player.username,
                rivalName:
                    index === 0
                        ? this.players[1].username
                        : this.players[0].username,
                board: index === 0 ? this.boardPlayer1 : this.boardPlayer2,
                availableMoves:
                    index === 0
                        ? this.availableMovesBoardPlayer1
                        : this.availableMovesBoardPlayer2,
                movesMyBoardPlayer: this.initBoard(),
                movesRivalBoardPlayer: this.initBoard(),
                score: 0,
            };
        });
    }

    private initBoard(): BoardT {
        return Array(10)
            .fill('~')
            .map(() => Array(10).fill('~'));
    }

    private placeShips(board: BoardT): void {
        for (const ship of this.ships) {
            for (let i = 0; i < ship.count; i++) {
                while (true) {
                    const row = Math.floor(Math.random() * 10);
                    const col = Math.floor(Math.random() * 10);
                    const direction =
                        Math.random() > 0.5 ? 'horizontal' : 'vertical';

                    if (
                        this.isValidPlacement(
                            board,
                            row,
                            col,
                            direction,
                            ship.size,
                        )
                    ) {
                        this.placeShip(board, row, col, direction, ship.size);
                        break;
                    }
                }
            }
        }
    }

    startGame(): GameState {
        const gameState: GameState = {
            status: 'playing',
            players: this.players,
            currentPlayer: this.currentPlayer,
        };

        return gameState;
    }

    makeMove(row: number, col: number): GameState {
        const currentUserIndex = this.players.findIndex(
            (player) => player.id === this.currentPlayer.id,
        );
        this.players[currentUserIndex].availableMoves[row][col] = false;

        const opponentIndex = currentUserIndex === 0 ? 1 : 0;
        const symbol =
            this.players[opponentIndex].board[row][col] === 'S' ? 'H' : 'M';
        if (symbol === 'H') {
            this.players[currentUserIndex].score += 1;
        }
        this.players[currentUserIndex].movesMyBoardPlayer[row][col] = symbol;
        this.players[opponentIndex].movesRivalBoardPlayer[row][col] = symbol;

        if (this.checkWin(currentUserIndex)) {
            return {
                status: 'win',
                currentPlayer: this.currentPlayer,
                players: this.players,
            };
        }

        this.currentPlayer = this.players.find(
            (player) => player.id !== this.currentPlayer.id,
        );

        return {
            status: 'playing',
            players: this.players,
            currentPlayer: this.currentPlayer,
        };
    }

    private checkWin(playerIndex: number) {
        if (this.players[playerIndex].score === 20) {
            return true;
        }

        return false;
    }

    private isValidPlacement(
        board: BoardT,
        row: number,
        col: number,
        direction: string,
        size: number,
    ): boolean {
        for (let i = 0; i < size; i++) {
            if (direction === 'horizontal') {
                if (
                    col + i >= 10 ||
                    board[row][col + i] === 'S' ||
                    !this.isSafe(board, row, col + i)
                ) {
                    return false;
                }
            } else {
                if (
                    row + i >= 10 ||
                    board[row + i][col] === 'S' ||
                    !this.isSafe(board, row + i, col)
                ) {
                    return false;
                }
            }
        }
        return true;
    }

    private isSafe(board: BoardT, row: number, col: number): boolean {
        const directions = [
            [-1, 0],
            [1, 0],
            [0, -1],
            [0, 1],
            [-1, -1],
            [-1, 1],
            [1, -1],
            [1, 1],
        ];

        for (const [dx, dy] of directions) {
            const newRow = row + dx;
            const newCol = col + dy;

            if (
                newRow >= 0 &&
                newRow < 10 &&
                newCol >= 0 &&
                newCol < 10 &&
                board[newRow][newCol] === 'S'
            ) {
                return false;
            }
        }

        return true;
    }

    private placeShip(
        board: BoardT,
        row: number,
        col: number,
        direction: string,
        size: number,
    ): void {
        for (let i = 0; i < size; i++) {
            if (direction === 'horizontal') {
                board[row][col + i] = 'S';
            } else {
                board[row + i][col] = 'S';
            }
        }
    }

    private initAvailableMoves(): boolean[][] {
        return Array(10)
            .fill(true)
            .map(() => Array(10).fill(true));
    }
}
