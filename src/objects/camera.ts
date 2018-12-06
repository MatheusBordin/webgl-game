import { mat4, vec3 } from "gl-matrix";
import { BaseProgram } from "../programs/base";
import { IMoveDirection } from "../types/move-direction";
import { IMousePoint } from "../types/mouse-point";
import { IPosition } from "../types/position";
import { TextureProgram } from "../programs/texture";
import { ColorProgram } from "../programs/color";

export class Camera {
    private projectionMatrix: mat4;

    private position: vec3 = vec3.create();
    private rotation: vec3 = vec3.create();
    private movementSpeed = 500.0;
    private rotationSpeed = 0.01;

    constructor (
        private readonly gl: WebGLRenderingContext, 
        private readonly program: BaseProgram,
        private readonly virtualProgram: BaseProgram,
        private fieldOfView = 45 * Math.PI / 180,
        private zNear = 0.1,
        private zFar = 200,
        private aspect?: number
    ) {
        this.projectionMatrix = mat4.create();
        this.configure();

        this.position[0] = 100;
        this.position[1] = -8;
        this.position[2] = 40;
    }

    /**
     * Draw camera.
     *
     * @memberof Camera
     */
    public draw() {
        const program = this.program as TextureProgram;
        this.gl.useProgram(program.program);

        const normalMatrix = mat4.create();
        mat4.invert(normalMatrix, this.modelViewMatrix);
        mat4.transpose(normalMatrix, normalMatrix);
        
        this.gl.uniformMatrix4fv(
            program.uniformLocations.projectionMatrix,
            false,
            this.projectionMatrix
        );

        this.gl.uniformMatrix4fv(
            program.uniformLocations.modelViewMatrix,
            false,
            this.modelViewMatrix
        );

        this.gl.uniformMatrix4fv(
            program.uniformLocations.normalMatrix,
            false,
            normalMatrix
        );
    }

    /**
     * Draw camera.
     *
     * @memberof Camera
     */
    public drawVirtual() {
        const program = this.virtualProgram as ColorProgram;
        this.gl.useProgram(program.program);
        
        this.gl.uniformMatrix4fv(
            program.uniformLocations.projectionMatrix,
            false,
            this.projectionMatrix
        );

        this.gl.uniformMatrix4fv(
            program.uniformLocations.modelViewMatrix,
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
     * Control camera position, rotation.
     *
     * @param {number} time
     * @param {IMoveDirection} moveIn
     * @param {IMousePoint} prevMouse
     * @param {IMousePoint} currMouse
     * @memberof Camera
     */
    public control(time: number, moveIn: IMoveDirection, prevMouse: IMousePoint, currMouse: IMousePoint) {
        const speed = this.movementSpeed / 1000;
        const direction: IPosition = { x: 0, y: 0, z: 0 };

        // Z Axies
        if (moveIn.front) {
            direction.z -= speed;
        } else if (moveIn.back) {
            direction.z += speed;
        }

        // X Axies
        if (moveIn.left) {
            direction.x += speed;
        } else if (moveIn.right) {
            direction.x -= speed;
        }

        // Y Axies
        if (moveIn.up) {
            direction.y -= speed;
        } else if (moveIn.down) {
            direction.y += speed;
        }

        this.moveByDirection(direction);
        this.rotateByPointer(prevMouse, currMouse);
    }

    private get modelViewMatrix() {
        const out = mat4.create();
        mat4.rotateX(out, out, this.rotation[0]);
        mat4.rotateY(out, out, this.rotation[1]);
        mat4.rotateZ(out, out, this.rotation[2] - Math.PI);
        mat4.translate(out, out, [-this.position[0], -this.position[1], -this.position[2]]);
        return out;
    }

    /**
     * Move camera by direction.
     *
     * @private
     * @param {IPosition} direction
     * @returns
     * @memberof Camera
     */
    private moveByDirection(direction: IPosition) {
        if (direction.x === 0 && direction.y === 0 && direction.z === 0) {
            return;
        }

        const dirVector = vec3.create();
        dirVector[0] = direction.x;
        dirVector[1] = direction.y;
        dirVector[2] = direction.z; 
        
        var cam = mat4.create();
        mat4.rotateY(cam, cam, this.rotation[1]);
        vec3.transformMat4(dirVector, dirVector, cam);
        vec3.add(this.position, this.position, dirVector);
    }

    /**
     * Rotate de camera by mouse point.
     *
     * @private
     * @param {IMousePoint} prevMouse
     * @param {IMousePoint} currMouse
     * @memberof Camera
     */
    private rotateByPointer(prevMouse: IMousePoint, currMouse: IMousePoint) {
        var deltaMouse = [currMouse.x - prevMouse.x, currMouse.y - prevMouse.y];
        this.rotation[1] += deltaMouse[0] * this.rotationSpeed;

        if (this.rotation[1] < 0) {
            this.rotation[1] += Math.PI * 2;
        }

        if (this.rotation[1] >= Math.PI * 2) {
            this.rotation[1] -= Math.PI * 2;
        }

        this.rotation[0] += deltaMouse[1] * this.rotationSpeed;

        if (this.rotation[0] < -Math.PI * .5) {
            this.rotation[0] = -Math.PI*0.5;
        }

        if (this.rotation[0] > Math.PI * .5) {
            this.rotation[0] = Math.PI*0.5;
        }
    }
}