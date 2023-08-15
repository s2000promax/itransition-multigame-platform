import { GameTypesEnums } from '../../config/types/gameTypesEnums';

export class CreateSessionDto {
    gameType: GameTypesEnums;
    playersIds: string[];
}
