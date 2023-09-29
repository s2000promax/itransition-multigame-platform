import { Graphics } from 'pixi.js';

export class DrawingModel {
    private figure: Graphics;

    constructor() {
        this.figure = new Graphics();
    }

    cross() {
        const line = new Graphics();
        line.lineStyle(5, 0xff0000);

        line.moveTo(5, 5);
        line.lineTo(25, 25);

        line.moveTo(25, 5);
        line.lineTo(5, 25);

        return line;
    }

    toe() {
        const ellipse = new Graphics();
        ellipse.lineStyle(5, 0xff0000);
        ellipse.drawEllipse(15, 15, 10, 10);
        return ellipse;
    }
}
