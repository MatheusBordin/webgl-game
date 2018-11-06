import { BaseObject } from "./objects/base";
import { Camera } from "./objects/camera";

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
    private camera: Camera;

    constructor() {
        try {
            this.canvas = document.getElementById("game") as HTMLCanvasElement;
            this.gl = this.canvas.getContext("webgl") || this.canvas.getContext("experimental-webgl");

            if (!this.gl) {
                throw new Error("Unable to initialize WebGL. Your browser or machine may not support it.")
            }
        } catch (e) {
            console.log(e.message || e);
        }
    }

    get context() {
        return this.gl;
    }

    /**
     * Start rendering.
     *
     * @memberof Game
     */
    start() {
        this.render(0);
    }

    /**
     * Add objects to scene.
     *
     * @param {...BaseObject[]} obj
     * @memberof Game
     */
    addObject(...obj: BaseObject[]) {
        this.objects.push(...obj);
    }

    /**
     * Set camera in scene.
     *
     * @param {Camera} camera
     * @memberof Game
     */
    setCamera(camera: Camera) {
        this.camera = camera;
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

        // Draw camera;
        this.camera.draw();

        for (const item of this.objects) {
            item.draw(time);
        }
    }
}