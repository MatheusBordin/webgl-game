import { Scene } from "./scene";
import { Camera } from "./objects/camera";
import { Control } from "./helpers/controls";
import { BaseProgram } from "./programs/base";
import { BasicProgram } from "./programs/basic";
import { Surface } from "./objects/surface";
import { Cube } from "./objects/cube";

/**
 * Contain all logics of the game. 
 *
 * @export
 * @class Game
 */
export class Game {
    private scene: Scene;
    private camera: Camera;
    private control: Control;
    private program: BaseProgram;
    private surface: Surface;

    constructor() {
        this.scene = new Scene();
        this.program = new BasicProgram(this.scene.context);
        this.camera = new Camera(this.scene.context, this.program);
        this.surface = new Surface(this.scene.context, this.program, 10);
        this.control = new Control();
    }
    
    /**
     * Init game.
     *
     * @memberof Game
     */
    public init() {
        this.setControls();
        this.scene.setCamera(this.camera);
        this.scene.addObject(this.surface);
        this.scene.start();
    }   

    /**
     * Set controls.
     *
     * @private
     * @memberof Game
     */
    private setControls() {
        this.control
            .onChange((keysPress, oldMouse, currMouse) => {
                console.log(keysPress, oldMouse, currMouse);
                this.camera.control(this.scene.frameTime, keysPress, oldMouse, currMouse);
            });

        this.control.onResize(() => {
            this.scene.configureSize();
            this.camera.configure();
        });
    }
}