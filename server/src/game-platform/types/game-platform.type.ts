import { GameTypesEnums } from '../../config/types/gameTypesEnums';
import { TicTacToeGame } from '../../games/tic-taс-toe/tic-taс-toe.game';
import { SeaBattleGame } from '../../games/sea-batle/sea-batle.game';
import { PokerGame } from '../../games/poker/poker.game';

export interface GameModelResponse {
    sessionId: string;
    ownerPlayerId: string;
    gameName: GameTypesEnums;
}

export interface GamesListResponse {
    availableGames: GameTypesEnums[];
    waitingGames: GameModelResponse[];
}

export type Symbols = 'cross' | 'toe';
export type SessionStatus = 'waiting' | 'in-progress' | 'finished';
export type GameStatus = 'playing' | 'win' | 'lose' | 'draw';
export type Move = {
    row: number;
    col: number;
};

export interface Player {
    id: string;
    username: string;
    played?: Symbols;
}

export interface GameSession {
    id: string;
    gameType: GameTypesEnums;
    ownerPlayerId: string;
    players: Player[];
    gameInstance: TicTacToeGame | SeaBattleGame | PokerGame;
    status: SessionStatus;
}

export interface GameState {
    status: GameStatus;
    players: Player[];
    currentPlayer: Player;
    availableMoves: boolean[][];
    rivalMove?: Move;
}

export interface CreateSessionRequest {
    gameType: GameTypesEnums;
    userName: string;
}

export interface JoinSessionRequest {
    sessionId: string;
    userName: string;
}
