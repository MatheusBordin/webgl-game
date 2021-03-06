
import { BaseObject } from "./objects/base";
import { Camera } from "./objects/camera";

/**
 * Contain all schene logics. 
 *
 * @export
 * @class Scene
 */
export class Scene {
    public canvas: HTMLCanvasElement;
    public isVirtualRender = false;
    private gl : WebGLRenderingContext;

    private prevTime: number = 0;
    private objects: BaseObject[] = [];
    private camera: Camera;

    constructor() {
        try {
            this.canvas = document.getElementById("game") as HTMLCanvasElement;
            this.gl = this.canvas.getContext("webgl") || this.canvas.getContext("experimental-webgl");
            this.requestPointerLock();
            
            this.canvas.addEventListener('click', this.requestPointerLock.bind(this));

            this.configureSize();

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

    get frameTime() {
        return this.prevTime;
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
     * Request pointer lock.
     *
     * @memberof Scene
     */
    requestPointerLock() {
        const elem = this.canvas as any;
        const pl = elem.requestPointerLock ||
              elem.webkitRequestPointerLock ||
              elem.mozRequestPointerLock ||
              elem.msRequestPointerLock ||
              elem.oRequestPointerLock ||
              function() {};
        pl.call(elem);
    }

    /**
     * Configure canvas size.
     *
     * @memberof Game
     */
    configureSize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
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
        
        if (this.isVirtualRender) {
            this.drawVirtual(deltaTime);
        } else {
            this.draw(deltaTime);
        }
        
        requestAnimationFrame(this.render.bind(this));
    }

    /**
     * Draw all objects in screen.
     *
     * @memberof Game
     */
    public draw(time: number) {
        this.gl.clearColor(104/255, 203/255 , 241/255, 1.0);
        this.gl.clearDepth(1.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.depthFunc(this.gl.LEQUAL);

        this.gl.viewport(0, 0, window.innerWidth, window.innerHeight);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        // Draw camera;
        this.camera.draw();

        for (const item of this.objects) {
            item.draw(time);
        }
    }

    /**
     * Draw all objects in screen.
     *
     * @memberof Game
     */
    public drawVirtual(time: number) {
        this.gl.clearColor(104/255, 203/255 , 241/255, 1.0);
        this.gl.clearDepth(1.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.depthFunc(this.gl.LEQUAL);

        this.gl.viewport(0, 0, window.innerWidth, window.innerHeight);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        // Draw camera;
        this.camera.drawVirtual();

        for (const item of this.objects) {
            item.drawVirtual(time);
        }
    }
}