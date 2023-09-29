import { Graphics } from 'pixi.js';

import { Symbols } from '@pages/gameServer/types/game-server.type';
import { DrawingModel } from '@features/seaBattle/model/drawing.model';

export class CellSpriteModel {
    private graphics: Graphics;
    private row: number;
    private col: number;
    private onSpriteClick: (row: number, col: number) => void;

    constructor(
        row: number,
        col: number,
        onClick: (row: number, col: number) => void,
    ) {
        this.row = row;
        this.col = col;
        this.onSpriteClick = onClick;

        this.graphics = new Graphics();
        this.graphics.interactive = true;
        this.graphics.cursor = 'pointer';

        this.graphics.on('pointerdown', () => this.handleClick());
    }

    setSizes(
        spriteSize: number,
        offsetX: number,
        offsetY: number,
        row: number,
        col: number,
        padding: number,
    ) {
        const borderColor = 0x000000;
        const borderWidth = 1;

        this.graphics.lineStyle(borderWidth, borderColor);

        this.graphics.beginFill(0xf1efa8);
        this.graphics.alpha = 0.5;
        this.graphics.drawRoundedRect(0, 0, spriteSize, spriteSize, 0);
        this.graphics.endFill();

        this.graphics.x = offsetX + col * (spriteSize + padding);
        this.graphics.y = offsetY + row * (spriteSize + padding);
    }

    setOccupiedByShip() {
        const shipColor = 0x000000;

        this.graphics.beginFill(shipColor);
        this.graphics.alpha = 0.5;
        this.graphics.drawRoundedRect(
            0,
            0,
            this.graphics.width,
            this.graphics.height,
            0,
        );
        this.graphics.endFill();
    }

    handleClick() {
        this.onSpriteClick(this.row, this.col);
    }

    createDraw(symbol: Symbols) {
        if (symbol === 'cross') {
            this.graphics.addChild(new DrawingModel().cross());
        } else {
            this.graphics.addChild(new DrawingModel().toe());
        }
    }

    getGraphics(): Graphics {
        return this.graphics;
    }
}
