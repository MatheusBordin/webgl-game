import { mat4 } from "gl-matrix";
import { BaseProgram } from "../programs/base";

export class Camera {
    private projectionMatrix: mat4;
    private modelViewMatrix: mat4;

    constructor (
        private readonly gl: WebGLRenderingContext, 
        private readonly program: BaseProgram,
        private fieldOfView = 45 * Math.PI / 180,
        private zNear = 0.1,
        private zFar = 100,
        private aspect?: number
    ) {
        this.projectionMatrix = mat4.create();
        this.modelViewMatrix = mat4.create();
        this.configure();
        this.changeLookAt(0, 0, -10);

        mat4.translate(
            this.modelViewMatrix,
            this.modelViewMatrix,
            [-5.0, 5.0, -20.0]
        );
    }

    public get x() {
        return this.projectionMatrix[12];
    }

    public get y() {
        return this.projectionMatrix[13];
    }

    public get z() {
        return this.projectionMatrix[14];
    }

    /**
     * Draw camera.
     *
     * @memberof Camera
     */
    public draw() {
        this.gl.useProgram(this.program.program);
        
        this.gl.uniformMatrix4fv(
            this.program.uniformLocations.projectionMatrix,
            false,
            this.projectionMatrix
        );

        this.gl.uniformMatrix4fv(
            this.program.uniformLocations.modelViewMatrix,
            false,
            this.modelViewMatrix
        );
    }

    /**
     * Configure camera.
     *
     * @memberof Camera
     */
    public configure() {
        this.aspect = this.gl.canvas.clientWidth / this.gl.canvas.clientHeight;

        mat4.perspective(
            this.projectionMatrix,
            this.fieldOfView,
            this.aspect,
            this.zNear,
            this.zFar
        );
    }

    /**
     * Change look at.
     *
     * @param {number} x
     * @param {number} y
     * @param {number} z
     * @memberof Camera
     */
    public changeLookAt(x: number, y: number, z: number) {
        var cameraPosition = [
            this.projectionMatrix[12],
            this.projectionMatrix[13],
            this.projectionMatrix[14],
        ];

        mat4.lookAt(this.modelViewMatrix, cameraPosition, [x, y, z], [0, 1, 0]);
        mat4.invert(this.modelViewMatrix, this.modelViewMatrix);
    }

    /**
     * Translate camera to right.
     *
     * @memberof Camera
     */
    public translateRight(distance = 0.25) {
        mat4.translate(
            this.modelViewMatrix,
            this.modelViewMatrix,
            [distance, 0, 0]
        );
    }

    /**
     * Translate camera to left.
     *
     * @memberof Camera
     */
    public translateLeft(distance = 0.25) {
        mat4.translate(
            this.modelViewMatrix,
            this.modelViewMatrix,
            [-distance, 0, 0]
        );
    }

    /**
     * Translate camera to front.
     *
     * @memberof Camera
     */
    public translateFront(distance = 0.25) {
        mat4.translate(
            this.modelViewMatrix,
            this.modelViewMatrix,
            [0, 0, distance]
        );
    }

    /**
     * Translate camera to back.
     *
     * @memberof Camera
     */
    public translateBack(distance = 0.25) {
        mat4.translate(
            this.modelViewMatrix,
            this.modelViewMatrix,
            [0, 0, -distance]
        );
    }  
    
    /**
     * Translate camera to up.
     *
     * @param {number} [distance=0.25]
     * @memberof Camera
     */
    public translateUp(distance = 0.25) {
        mat4.translate(
            this.modelViewMatrix,
            this.modelViewMatrix,
            [0, distance, 0]
        );
    }

    /**
     * Translate camera to down.
     *
     * @param {number} [distance=0.25]
     * @memberof Camera
     */
    public translateDown(distance = 0.25) {
        mat4.translate(
            this.modelViewMatrix,
            this.modelViewMatrix,
            [0, -distance, 0]
        );
    }    
}