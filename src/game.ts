import { BaseObject } from "./objects/object";

/**
 * Contain all game start logics. 
 *
 * @export
 * @class Game
 */
export class Game {
    public canvas: HTMLCanvasElement;
    private gl : WebGLRenderingContext;

    private prevTime: number = 0;
    private objects: BaseObject[] = [];

    constructor() {
        try {
            this.canvas = document.getElementById("game") as HTMLCanvasElement;
            this.gl = this.canvas.getContext("webgl") || this.canvas.getContext("experimental-webgl");

            if (!this.gl) {
                throw new Error("Unable to initialize WebGL. Your browser or machine may not support it.")
            }

            this.render(0);
        } catch (e) {
            console.log(e.message || e);
        }
    }

    addObject(obj: BaseObject) {
        this.objects.push(obj);
    }

    get context() {
        return this.gl;
    }

    /**
     * Called frame a frame.
     *
     * @private
     * @memberof Game
     */
    private render(now: number) {
        const currTime = now * 0.001;
        const deltaTime = currTime - this.prevTime;
        this.prevTime = currTime;
        
        this.draw(deltaTime);
        
        requestAnimationFrame(this.render.bind(this));
    }

    /**
     * Draw all objects in screen.
     *
     * @private
     * @memberof Game
     */
    private draw(time: number) {
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl.clearDepth(1.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.depthFunc(this.gl.LEQUAL);

        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        for (const item of this.objects) {
            item.draw(time);
        }
    }
}