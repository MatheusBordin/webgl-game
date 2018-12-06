import { Scene } from "./scene";
import { Camera } from "./objects/camera";
import { Control } from "./helpers/controls";
import { BaseProgram } from "./programs/base";
import { TextureProgram } from "./programs/texture";
import { Surface } from "./objects/surface";
import { Cube } from "./objects/cube";
import { ColorProgram } from "./programs/color";
import { UniqueID } from "./helpers/unique-id";
import { currentCubeMode, CubeMode } from "./helpers/cube-mode";

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
    private virtualProgram: BaseProgram;
    private surface: Surface;
    private uniqueId: UniqueID;
    private cubeModeElement: HTMLDivElement;

    constructor() {
        this.scene = new Scene();
        this.program = new TextureProgram(this.scene.context);
        this.virtualProgram = new ColorProgram(this.scene.context);
        this.camera = new Camera(this.scene.context, this.program, this.virtualProgram);
        this.surface = new Surface(this.scene.context, this.program, this.virtualProgram, 30);
        this.control = new Control();
        this.uniqueId = new UniqueID(this.scene.context);
        this.cubeModeElement = document.querySelector('.cube-mode');
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
            .onChange((keysPress, oldMouse, currMouse) => this.camera.control(this.scene.frameTime, keysPress, oldMouse, currMouse));

        this.control.onResize(() => {
            this.scene.configureSize();
            this.camera.configure();
        });

        this.control.onRightClick((mouse_x, mouse_y) => {
            const doc = document as any;
            const pointerLockElement = doc.pointerLockElement || doc.mozPointerLockElement || doc.webkitPointerLockElement;
            if (pointerLockElement !== this.scene.canvas) {
                return;
            }

            mouse_x = window.innerWidth / 2;
            mouse_y = window.innerHeight / 2;

            this.scene.isVirtualRender = true;
            this.scene.drawVirtual(0);

            mouse_y = this.scene.canvas.clientHeight - mouse_y;
            const pixel = new Uint8Array(4);

            // Get the color value from the rendered color buffer.
            this.scene.context.readPixels(mouse_x, mouse_y, 1, 1, this.scene.context.RGBA, this.scene.context.UNSIGNED_BYTE, pixel);

            // Convert the RGBA color array into a single integer
            const idSelected = this.uniqueId.fromColor(pixel[0], pixel[1], pixel[2], pixel[3]);
            this.surface.addObjectUpTo(idSelected);

            this.scene.isVirtualRender = false;
            this.scene.draw(0);
        });

        this.control.onClick((mouse_x, mouse_y) => {
            const doc = document as any;
            const pointerLockElement = doc.pointerLockElement || doc.mozPointerLockElement || doc.webkitPointerLockElement;
            if (pointerLockElement !== this.scene.canvas) {
                return;
            }

            mouse_x = window.innerWidth / 2;
            mouse_y = window.innerHeight / 2;

            this.scene.isVirtualRender = true;
            this.scene.drawVirtual(0);

            mouse_y = this.scene.canvas.clientHeight - mouse_y;
            const pixel = new Uint8Array(4);

            // Get the color value from the rendered color buffer.
            this.scene.context.readPixels(mouse_x, mouse_y, 1, 1, this.scene.context.RGBA, this.scene.context.UNSIGNED_BYTE, pixel);

            // Convert the RGBA color array into a single integer
            const idSelected = this.uniqueId.fromColor(pixel[0], pixel[1], pixel[2], pixel[3]);
            this.surface.removeObject(idSelected);

            this.scene.isVirtualRender = false;
            this.scene.draw(0);
        });

        this.control.onChangeCube((mode) => {
            currentCubeMode.current = mode;

            if (mode === CubeMode.GRASS) {
                this.cubeModeElement.innerText = 'Grass';
            } else if (mode === CubeMode.EARTH) {
                this.cubeModeElement.innerText = 'Earth';
            } else {
                this.cubeModeElement.innerText = 'Iron';
            }
        });
    }
}