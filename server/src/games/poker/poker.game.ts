export class PokerGame {
    private players: { id: string; hand: string[] }[];
    private deck: string[];
    private communityCards: string[];
    private pot: number;

    constructor(playersIds: string[]) {
        this.players = playersIds.map((id) => ({ id, hand: [] }));
        this.deck = this.generateDeck();
        this.communityCards = [];
        this.pot = 0;
    }

    private generateDeck(): string[] {
        return [];
    }

    dealHands(): void {}

    makeBet(playerId: string, amount: number): void {}

    getGameState() {
        return 'win';
    }
}
