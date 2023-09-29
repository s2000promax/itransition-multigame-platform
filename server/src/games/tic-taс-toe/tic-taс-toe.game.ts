import {
    GameState,
    Player,
    Symbols,
} from '../../game-platform/types/game-platform.type';

export class TicTacToeGame {
    private board: (Symbols | null)[][] = Array(3)
        .fill(null)
        .map(() => Array(3).fill(null));
    private players: Player[];
    private currentPlayer: Player;

    constructor(players: Player[]) {
        const symbols = this.getSymbols;
        this.players = players.map((player, index) => ({
            ...player,
            played: symbols[index],
        }));
        const randomIndex = Math.floor(Math.random() * this.players.length);
        this.currentPlayer = this.players[randomIndex];
    }

    startGame(): GameState {
        console.log("Tic-Tac START!!!")
        const availableMoves: boolean[][] = Array(3)
            .fill(true)
            .map(() => Array(3).fill(true));
        const gameState: GameState = {
            status: 'playing',
            players: this.players,
            currentPlayer: this.currentPlayer,
            availableMoves,
        };

        return gameState;
    }

    makeMove(row: number, col: number): GameState {
        this.board[row][col] = this.currentPlayer.played;
        const availableMoves = this.getAvailableMoves(this.board);

        this.currentPlayer =
            this.players.find((player) => player !== this.currentPlayer) ||
            this.players[0];

        if (this.checkWin()) {
            return {
                status: this.checkWin() === 'draw' ? 'draw' : 'win',
                players: this.players,
                currentPlayer: this.currentPlayer,
                availableMoves: availableMoves,
                rivalMove: {
                    row,
                    col,
                },
            };
        }

        return {
            status: 'playing',
            players: this.players,
            currentPlayer: this.currentPlayer,
            availableMoves: availableMoves,
            rivalMove: {
                row,
                col,
            },
        };
    }

    private getAvailableMoves(board: (Symbols | null)[][]): boolean[][] {
        return board.map((row) => row.map((cell) => cell == null));
    }

    private checkWin(): 'draw' | boolean {
        const lines = [
            [
                [0, 0],
                [0, 1],
                [0, 2],
            ],
            [
                [1, 0],
                [1, 1],
                [1, 2],
            ],
            [
                [2, 0],
                [2, 1],
                [2, 2],
            ],
            [
                [0, 0],
                [1, 0],
                [2, 0],
            ],
            [
                [0, 1],
                [1, 1],
                [2, 1],
            ],
            [
                [0, 2],
                [1, 2],
                [2, 2],
            ],
            [
                [0, 0],
                [1, 1],
                [2, 2],
            ],
            [
                [0, 2],
                [1, 1],
                [2, 0],
            ],
        ];

        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            if (
                this.board[a[0]][a[1]] !== null &&
                this.board[a[0]][a[1]] === this.board[b[0]][b[1]] &&
                this.board[a[0]][a[1]] === this.board[c[0]][c[1]]
            ) {
                return true;
            }
        }

        if (this.board.every((row) => row.every((cell) => cell !== null))) {
            return 'draw';
        }

        return false;
    }

    private get getSymbols() {
        const symbols: Symbols[] = ['cross', 'toe'];
        if (Math.random() < 0.5) {
            return symbols.reverse();
        }
        return symbols;
    }
}
