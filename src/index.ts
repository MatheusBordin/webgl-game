import { GameObject } from "./object";

/**
 * Contain all game start logics. 
 *
 * @export
 * @class Game
 */
export class Game {
    public canvas: HTMLCanvasElement;
    private ctx: WebGLRenderingContext;

    constructor() {
        try {
            this.canvas = document.getElementById("game") as HTMLCanvasElement;
            this.ctx = this.canvas.getContext("webgl") || this.canvas.getContext("experimental-webgl");
        } catch (e) {
            console.log("Error on initialize Game");
        }
    }

    /**
     * Called frame a frame.
     *
     * @private
     * @memberof Game
     */
    private render() {
        this.draw();

        requestAnimationFrame(this.render.bind(this));
    }

    /**
     * Draw all objects in screen.
     *
     * @private
     * @memberof Game
     */
    private draw() {

    }
}

const game = new Game();