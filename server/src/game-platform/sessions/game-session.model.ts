import { GameTypesEnums } from '../../config/types/gameTypesEnums';
import { generateUniqueId } from '../../libs';

export class GameSession {
    id?: string;
    gameType: GameTypesEnums;
    playersIds: string[];

    constructor(gameType: GameTypesEnums, playersIds: string[]) {
        this.id = generateUniqueId();
        this.gameType = gameType;
        this.playersIds = playersIds;
    }
}
