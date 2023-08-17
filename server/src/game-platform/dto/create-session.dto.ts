import { GameTypesEnums } from '../../config/types/gameTypesEnums';

export interface CreateSessionDto {
    gameType: GameTypesEnums;
    ownerPlayerId: string;
}
