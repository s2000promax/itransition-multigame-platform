import { Player } from '../../game-platform/types/game-platform.type';

export class PokerGame {
    private players: { id: string; hand: string[] }[];
    private deck: string[];
    private communityCards: string[];
    private pot: number;

    constructor(players: Player[]) {}

    startGame() {}

    makeMove() {}

    private checkWin() {}
}
