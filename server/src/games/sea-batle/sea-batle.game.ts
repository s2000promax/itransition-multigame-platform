export class SeaBattleGame {
    private boardPlayer1: ('S' | 'H' | '~')[][];
    private boardPlayer2: ('S' | 'H' | '~')[][];

    constructor(playersIds: string[]) {
        this.boardPlayer1 = Array.from({ length: 10 }, () =>
            Array(10).fill('~'),
        );
        this.boardPlayer2 = Array.from({ length: 10 }, () =>
            Array(10).fill('~'),
        );
    }

    makeMove(player: 1 | 2, row: number, col: number): void {}

    getStatus(): string {
        return 'win';
    }
}
