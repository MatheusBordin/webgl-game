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
        protected readonly virtualProgram: BaseProgram,
        private worldSize = 40,
        private slotSize = 5
    ) {
        super(context, program, virtualProgram);
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
                for (let i = slot.length - 1; i >= 0; i--) {
                    const object = slot[i];

                    if (object instanceof Cube) {
                        object.setGrassArround(this.getMaxHeightOfSlot(slot) === object.heightPosition);
                    }

                    object.draw(time);
                } 
            }
        }
    }

    /**
     * Draw all objects in surface.
     *
     * @param {number} time
     * @memberof Surface
     */
    public drawVirtual(time: number) {
        for (const line of this.matrix) {
            for (const slot of line) {
                for (let i = slot.length - 1; i >= 0; i--) {
                    const object = slot[i];

                    if (object instanceof Cube) {
                        object.setGrassArround(i === slot.length - 1);
                    }

                    object.drawVirtual(time);
                } 
            }
        }
    }

    /**
     * Add object up to de id object.
     *
     * @param {number} id
     * @returns
     * @memberof Surface
     */
    public async addObjectUpTo(id: number) {
        for (let i = 0; i < this.matrix.length; i++) {
            const line = this.matrix[i];
            for (let j = 0; j < line.length; j++) {
                const slot = this.matrix[i][j];
                for (const object of slot) {
                    if (object.id === id) {
                        const cube = new Cube(this.context, this.program, this.virtualProgram, this.slotSize);
                        cube.heightPosition = this.getNextHeightInSlot(slot, object.heightPosition);
                        cube.translate(
                            this.initialPoint.x + i * this.slotSize, 
                            this.initialPoint.y - cube.heightPosition * this.slotSize,
                            this.initialPoint.z + j * this.slotSize
                        );

                        cube.updateTextureBuffer();

                        slot.push(cube);
                        return;
                    }
                }
            }
        }
    }

    /**
     * Remove object by id.
     *
     * @param {number} id
     * @returns
     * @memberof Surface
     */
    public async removeObject(id: number) {
        for (let i = 0; i < this.matrix.length; i++) {
            const line = this.matrix[i];
            for (let j = 0; j < line.length; j++) {
                const slot = line[j];
                for (let k = 0; k < slot.length; k++) {
                    const object = slot[k];
                    if (object.id === id) {
                        slot.splice(k, 1);
                        return;
                    }
                }
            }
        }
    }

    /**
     * Get next height of slot.
     *
     * @param {BaseObject[]} slot
     * @param {number} [initialIndex=0]
     * @returns
     * @memberof Surface
     */
    public getNextHeightInSlot(slot: BaseObject[], initialIndex = 0) {
        const heights = slot.map(x => x.heightPosition).filter(x => x >= initialIndex).sort();
        let result = initialIndex + 1;

        for (const item of heights) {
            if (item == result) {
                result = item + 1;
            }
        }

        return result;
    }

    /**
     * Get max height.
     *
     * @param {BaseObject[]} slot
     * @returns
     * @memberof Surface
     */
    public getMaxHeightOfSlot(slot: BaseObject[]) {
        const heights = slot.map(x => x.heightPosition).sort();
        return heights[heights.length - 1];
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
                const cube = new Cube(this.context, this.program, this.virtualProgram, this.slotSize);
                cube.heightPosition = 0;
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

    /**
     * Randomize surface
     *
     * @private
     * @memberof Surface
     */
    private randomizeSurface() {
        const generateX = (radius = 0) => Math.floor(Math.random() * (this.worldSize - radius * 2)) + radius;
        const generateZ = (radius = 0) => Math.floor(Math.random() * (this.worldSize - radius * 2)) + radius;

        for (let i = 0; i < 5; i++) {
            const randomRadius = Math.floor(Math.random() * 4) + 1;
            const randomBlockCount = Math.floor(Math.random() * 15) + 5;

            this.createMountain(generateX(randomRadius), generateZ(randomRadius), randomRadius);
            this.createSurfaces(generateX(), generateZ(), randomBlockCount);
        }
    }

    /**
     * Create surfaces.
     *
     * @private
     * @param {number} x Position x to initialize surface.
     * @param {number} z Position z to initialize surface.
     * @param {number} blocks Blocks count in surface.
     * @memberof Surface
     */
    private createSurfaces(x: number, z: number, blocks: number) {
        let currX = x;
        let currZ = z;

        while (blocks > 0) {
            const incX = Math.floor(Math.random() * 3) - 1;
            const incZ = Math.floor(Math.random() * 3) - 1;

            currX += incX;
            currZ += incZ;

            if (currX >= this.worldSize || currX < 0 || currZ >= this.worldSize || currZ < 0) {
                continue;
            }

            const slot = this.matrix[currX][currZ];

            const cube = new Cube(this.context, this.program, this.virtualProgram, this.slotSize);
            cube.heightPosition = slot.length;
            cube.translate(
                this.initialPoint.x + currX * this.slotSize, 
                this.initialPoint.y - cube.heightPosition * this.slotSize,
                this.initialPoint.z + currZ * this.slotSize
            )
            slot.push(cube);

            blocks--;
        }
    }
    
    /**
     * Create mountain
     *
     * @private
     * @param {number} x Position in x
     * @param {number} z Position in z
     * @param {number} radius Radius size
     * @returns
     * @memberof Surface
     */
    private createMountain(x: number, z: number, radius: number) {
        if (x - radius < 0 || z - radius < 0) {
            return;
        }

        while (radius > 0) {
            for (let i = -radius; i < radius; i++) {
                for (let j = -radius; j < radius; j++) {
                    const currX = x + i;
                    const currZ = z + j;

                    const slot = this.matrix[currX][currZ];
                    const cube = new Cube(this.context, this.program, this.virtualProgram, this.slotSize);
                    cube.heightPosition = slot.length;
                    cube.translate(
                        this.initialPoint.x + currX * this.slotSize, 
                        this.initialPoint.y - cube.heightPosition * this.slotSize,
                        this.initialPoint.z + currZ * this.slotSize
                    )
                    slot.push(cube);
                }
            }

            radius--;
        }
    }
}