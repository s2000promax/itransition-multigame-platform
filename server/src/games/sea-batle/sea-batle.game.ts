import { Player } from '../../game-platform/types/game-platform.type';

export class SeaBattleGame {
    private boardPlayer1: ('S' | 'H' | '~')[][];
    private boardPlayer2: ('S' | 'H' | '~')[][];

    constructor(players: Player[]) {}

    startGame() {}

    makeMove() {}

    private checkWin() {}
}
