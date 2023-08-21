import { GameTypesEnums } from '../../config/types/gameTypesEnums';

export interface CreateSessionDto {
    gameType: GameTypesEnums;
    ownerPlayer: {
        id: string;
        username: string;
    };
}
