import { BaseObject } from "./base";
import { BaseProgram } from "../programs/base";
import { Cube } from "./cube";
import { IPosition } from "../types/position";

/**
 * Surface object.
 *
 * @export
 * @class Surface
 * @extends {BaseObject}
 */
export class Surface extends BaseObject {
    private matrix: BaseObject[][][];
    private initialPoint: IPosition = { x: 0, y: 0, z: 0 };

    constructor(
        protected readonly context: WebGLRenderingContext, 
        protected readonly program: BaseProgram, 
        private worldSize = 40,
        private slotSize = 5
    ) {
        super(context, program);
        this.initializeMatrix();
    }

    /**
     * Draw all objects in surface.
     *
     * @param {number} time
     * @memberof Surface
     */
    public draw(time: number) {
        for (const line of this.matrix) {
            for (const slot of line) {
                for (const object of slot) {
                    object.draw(time);
                } 
            }
        }
    }

    /**
     * Init all buffers. Is empty because surface is a fake object, compose by other objects.
     *
     * @protected
     * @memberof Surface
     */
    protected initBuffers() {
    }

    /**
     * Update position buffer. Is empty because surface is a fake object, compose by other objects.
     *
     * @protected
     * @memberof Surface
     */
    protected updatePositionBuffer() {
    }

    /**
     * Update position buffer. Is empty because surface is a fake object, compose by other objects.
     *
     * @protected
     * @memberof Surface
     */
    protected updateColorBuffer() {
    }

    /**
     * Update position buffer. Is empty because surface is a fake object, compose by other objects.
     *
     * @protected
     * @memberof Surface
     */
    protected updateIndicesBuffer() {
    }

    /**
     * Initialize surface matrix.
     *
     * @private
     * @memberof Surface
     */
    private initializeMatrix() {
        this.matrix = new Array(this.worldSize);
        for (let i = 0; i < this.worldSize; i++) {
            this.matrix[i] = new Array(this.worldSize);

            for (let j = 0; j < this.worldSize; j++) {
                const cube = new Cube(this.context, this.program, this.slotSize);
                cube.translate(
                    this.initialPoint.x + i * this.slotSize, 
                    this.initialPoint.y,
                    this.initialPoint.z + j * this.slotSize
                );
                
                this.matrix[i][j] = [cube];
            }
        }
    }
}