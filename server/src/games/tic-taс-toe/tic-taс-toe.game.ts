export class TicTacToeGame {
    private board: (string | null)[][] = Array(3)
        .fill(null)
        .map(() => Array(3).fill(null));
    private currentPlayer: string;

    constructor(private playersIds: string[]) {
        this.currentPlayer = playersIds[0];
    }

    makeMove(row: number, col: number) {
        if (
            this.board[row][col] != null ||
            row < 0 ||
            row > 2 ||
            col < 0 ||
            col > 2
        ) {
            return { status: 'invalid-move' };
        }

        this.board[row][col] = this.currentPlayer;

        // Проверка победителя
        if (this.checkWin()) {
            return { status: 'winner', winner: this.currentPlayer };
        }

        // Переключение игрока
        this.currentPlayer =
            this.playersIds.find((id) => id !== this.currentPlayer) ||
            this.playersIds[0];

        return { status: 'continue' };
    }

    private checkWin(): boolean {
        if (this.board[0][0] && this.board[0][1] && this.board[0][2]) {
            return true;
        }
        return false;
    }
}
