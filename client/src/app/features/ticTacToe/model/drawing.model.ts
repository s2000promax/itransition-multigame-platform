import { Graphics } from 'pixi.js';

export class DrawingModel {
    private figure: Graphics;

    constructor() {
        this.figure = new Graphics();
    }

    cross() {
        const line = new Graphics();
        line.lineStyle(6, 0xff0000);

        line.moveTo(10, 10);
        line.lineTo(40, 40);

        line.moveTo(40, 10);
        line.lineTo(10, 40);

        return line;
    }

    toe() {
        const ellipse = new Graphics();
        ellipse.lineStyle(4, 0xff0000);
        ellipse.drawEllipse(25, 25, 10, 16);
        return ellipse;
    }
}
