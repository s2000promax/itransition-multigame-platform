import { GameTypesEnums } from '../../../config/types/gameTypesEnums';
import { generateUniqueId } from '../../../libs';

export class GameModel {
    id: string;
    type: GameTypesEnums;
    state: any; // Game state

    constructor(type: GameTypesEnums) {
        this.id = generateUniqueId();
        this.type = type;
        this.state = this.initializeState();
    }

    private initializeState() {
        return {};
    }
}
