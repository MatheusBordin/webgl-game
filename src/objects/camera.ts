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
        this.aspect =  this.aspect || this.gl.canvas.clientWidth / this.gl.canvas.clientHeight;

        this.configure();
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
     * @private
     * @memberof Camera
     */
    private configure() {
        mat4.perspective(
            this.projectionMatrix,
            this.fieldOfView,
            this.aspect,
            this.zNear,
            this.zFar
        );

        mat4.translate(
            this.modelViewMatrix,
            this.modelViewMatrix,
            [-0.0, 0.0, -10.0]
        );
    }
}