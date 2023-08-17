import { GameTypesEnums } from '../../../config/types/gameTypesEnums';
import { generateUniqueId } from '../../../libs';

export class GameSession {
    id?: string;
    gameType: GameTypesEnums;
    ownerClientId: string;
    playersIds: string[];

    constructor(
        gameType: GameTypesEnums,
        ownerClientId: string,
        playersIds: string[],
    ) {
        this.id = generateUniqueId();
        this.gameType = gameType;
        this.ownerClientId = ownerClientId;
        this.playersIds = playersIds;
    }
}
