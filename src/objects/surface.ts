import { BaseObject } from "./base";
import { BaseProgram } from "../programs/base";
import { Cube } from "./cube";
import { IPosition } from "../types/position";
import { Color } from "../helpers/color";
import { IBlackListItem } from "../types/random-surface-bl-item";

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
                const cube = new Cube(this.context, this.program, this.slotSize, Color.Earth, Color.Grass);
                cube.translate(
                    this.initialPoint.x + i * this.slotSize, 
                    this.initialPoint.y,
                    this.initialPoint.z + j * this.slotSize
                );
                
                this.matrix[i][j] = [cube];
            }
        }

        this.randomizeSurface();
    }

    private randomizeSurface() {
        for (let i = 0; i < 5; i++) {
            const randomRadius = Math.floor(Math.random() * 4) + 1;
            const item: IBlackListItem = {
                radius: randomRadius,
                x: Math.floor(Math.random() * (this.worldSize - randomRadius * 2)) + randomRadius,
                z: Math.floor(Math.random() * (this.worldSize - randomRadius * 2)) + randomRadius
            };

            console.log(item);

            this.createMountain(item.x, item.z, item.radius);
        }
    }

    private createMountain(x: number, z: number, radius: number) {
        if (x - radius < 0 || z - radius < 0) {
            return;
        }

        const colors = [Color.Red, Color.Blue, Color.Earth];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];

        while (radius > 0) {
            for (let i = -radius; i < radius; i++) {
                for (let j = -radius; j < radius; j++) {
                    const currX = x + i;
                    const currZ = z + j;

                    const slot = this.matrix[currX][currZ];
                    const cube = new Cube(this.context, this.program, this.slotSize, randomColor);
                    cube.translate(
                        this.initialPoint.x + currX * this.slotSize, 
                        this.initialPoint.y - slot.length * this.slotSize,
                        this.initialPoint.z + currZ * this.slotSize
                    )
                    slot.push(cube);
                }
            }

            radius--;
        }
    }
}