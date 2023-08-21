import { GameTypesEnums } from '@config/types/game/gameTypesEnums';

export type Symbols = 'cross' | 'toe';
export type SessionStatus = 'waiting' | 'in-progress' | 'finished';
export type GameStatus = 'playing' | 'win' | 'lose' | 'draw';
export type Move = {
    row: number;
    col: number;
};

export type Player = {
    id: string;
    username: string;
    played?: Symbols;
};

export interface GameModelResponse {
    sessionId: string;
    ownerPlayerId: string;
    gameName: GameTypesEnums;
}

export interface GamesListResponse {
    availableGames: GameTypesEnums[];
    waitingGames: GameModelResponse[];
}

export interface CreateSessionRequest {
    gameType: GameTypesEnums;
    userName: string;
}

export interface JoinSessionRequest {
    sessionId: string;
    userName: string;
}

export type SessionResponse = [string, string];

export interface GameSession {
    id: string;
    gameType: GameTypesEnums;
    ownerPlayerId: string;
    players: Player[];
    status: SessionStatus;
}

export interface GameState {
    status: GameStatus;
    players: Player[];
    currentPlayer: Player;
    availableMoves: boolean[][];
    rivalMove?: Move;
}
