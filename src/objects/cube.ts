import { BaseObject } from "./base";
import { BaseProgram } from "../programs/base";
import { IPosition } from "../types/position";
import { AtlasTexture } from "../textures/atlas";
import { TextureProgram } from "../programs/texture";
import { currentCubeMode, CubeMode } from "../helpers/cube-mode";

/**
 * Cube object.
 *
 * @export
 * @class Cube
 * @extends {BaseObject}
 */
export class Cube extends BaseObject {
    private mode: CubeMode;
    private size: number;
    private texture: any;
    private grassArround: boolean = false;

    constructor(context: WebGLRenderingContext, program: BaseProgram, virtualProgram: BaseProgram, size: number) {
        super(context, program, virtualProgram);

        this.size = size;
        this.texture = AtlasTexture.load(context);
        this.mode = currentCubeMode.current;
        this.initBuffers();
    }

    /**
     * Set grass arround.
     *
     * @param {boolean} value
     * @memberof Cube
     */
    public setGrassArround(value: boolean) {
        if (value !== this.grassArround) {
            this.grassArround = value;
            
            if (currentCubeMode.current === CubeMode.GRASS && this.mode === CubeMode.GRASS) {
                this.updateTextureBuffer();
            }
        }
    }

    /**
     * Draw cube.
     *
     * @param {number} time
     * @memberof Cube
     */
    public draw(time: number): void {
        const program = this.program as TextureProgram;

        // Position
        const positionComponents = 3;
        const positionType = this.context.FLOAT;
        const positionNormalize = false;
        const positionStride = 0;
        const positionOffset = 0;

        this.context.bindBuffer(this.context.ARRAY_BUFFER, this.buffers.position);
        this.context.vertexAttribPointer(
            program.attributeLocations.vertexPosition,
            positionComponents,
            positionType,
            positionNormalize,
            positionStride,
            positionOffset
        );
        this.context.enableVertexAttribArray(program.attributeLocations.vertexPosition);

        // Texture
        const textureComponents = 2;
        const textureType = this.context.FLOAT;
        const textureNormalize = false;
        const textureStride = 0;
        const textureOffset = 0;

        this.context.bindBuffer(this.context.ARRAY_BUFFER, this.buffers.texture);
        this.context.vertexAttribPointer(
            program.attributeLocations.textureCoord,
            textureComponents,
            textureType,
            textureNormalize,
            textureStride,
            textureOffset
        );
        this.context.enableVertexAttribArray(program.attributeLocations.textureCoord);

        // Normal
        const normalComponents = 3;
        const normalType = this.context.FLOAT;
        const normalNormalize = false;
        const normalStride = 0;
        const normalOffset = 0;

        this.context.bindBuffer(this.context.ARRAY_BUFFER, this.buffers.normal);
        this.context.vertexAttribPointer(
            program.attributeLocations.vertexNormal,
            normalComponents,
            normalType,
            normalNormalize,
            normalStride,
            normalOffset
        );
        this.context.enableVertexAttribArray(program.attributeLocations.vertexNormal);

        // Indices
        this.context.bindBuffer(this.context.ELEMENT_ARRAY_BUFFER, this.buffers.indices);

        // Set program
        this.context.useProgram(program.program);

        // Choose texture
        this.context.activeTexture(this.context.TEXTURE0);
        this.context.bindTexture(this.context.TEXTURE_2D, this.texture);
        this.context.uniform1i(program.uniformLocations.uSampler, 0);
        
        // Draw
        const vertexCount = 36;
        const type = this.context.UNSIGNED_SHORT;
        const offset = 0;
        this.context.drawElements(this.context.TRIANGLES, vertexCount, type, offset);
    }

    /**
     * Initialize buffers.
     *
     * @protected
     * @memberof Cube
     */
    protected initBuffers() {
        this.updatePositionBuffer();
        this.updateNormalBuffer();
        this.updateTextureBuffer();
        this.updateIndicesBuffer();
        this.updateColorBuffer();
    }

    /**
     * Update position buffers.
     *
     * @protected
     * @memberof Cube
     */
    protected updatePositionBuffer() {
        const positionBuffer = this.context.createBuffer();
        const extrPoint: IPosition = {
            x: this.position.x + this.size,
            y: this.position.y + this.size,
            z: this.position.z + this.size
        };
        const basePoint: IPosition = {
            x: this.position.x,
            y: this.position.y,
            z: this.position.z
        };


        const positions = [
            // Front face
            basePoint.x, basePoint.y, extrPoint.z, 
            extrPoint.x, basePoint.y, extrPoint.z, 
            extrPoint.x, extrPoint.y, extrPoint.z, 
            basePoint.x, extrPoint.y, extrPoint.z, 

            // Back face
            basePoint.x, basePoint.y, basePoint.z, 
            basePoint.x, extrPoint.y, basePoint.z, 
            extrPoint.x, extrPoint.y, basePoint.z, 
            extrPoint.x, basePoint.y, basePoint.z, 

            // Top face
            basePoint.x, extrPoint.y, basePoint.z, 
            basePoint.x, extrPoint.y, extrPoint.z, 
            extrPoint.x, extrPoint.y, extrPoint.z, 
            extrPoint.x, extrPoint.y, basePoint.z, 

            // Bottom face
            basePoint.x, basePoint.y, basePoint.z, 
            extrPoint.x, basePoint.y, basePoint.z, 
            extrPoint.x, basePoint.y, extrPoint.z, 
            basePoint.x, basePoint.y, extrPoint.z, 

            // Right face
            extrPoint.x, basePoint.y, basePoint.z, 
            extrPoint.x, extrPoint.y, basePoint.z, 
            extrPoint.x, extrPoint.y, extrPoint.z, 
            extrPoint.x, basePoint.y, extrPoint.z, 

            // Left face
            basePoint.x, basePoint.y, basePoint.z, 
            basePoint.x, basePoint.y, extrPoint.z, 
            basePoint.x, extrPoint.y, extrPoint.z, 
            basePoint.x, extrPoint.y, basePoint.z, 
        ];

        this.context.bindBuffer(this.context.ARRAY_BUFFER, positionBuffer);
        this.context.bufferData(this.context.ARRAY_BUFFER, new Float32Array(positions), this.context.STATIC_DRAW);

        this.buffers.position = positionBuffer;
    }

    /**
     * Update normal buffer.
     *
     * @protected
     * @memberof Cube
     */
    protected updateNormalBuffer() {
        const normalBuffer = this.context.createBuffer();
        this.context.bindBuffer(this.context.ARRAY_BUFFER, normalBuffer);

        const vertexNormals = [
            // Front
             0.0,  0.0,  1.0,
             0.0,  0.0,  1.0,
             0.0,  0.0,  1.0,
             0.0,  0.0,  1.0,
        
            // Back
             0.0,  0.0, -1.0,
             0.0,  0.0, -1.0,
             0.0,  0.0, -1.0,
             0.0,  0.0, -1.0,
        
            // Top
             0.0,  1.0,  0.0,
             0.0,  1.0,  0.0,
             0.0,  1.0,  0.0,
             0.0,  1.0,  0.0,
        
            // Bottom
             0.0, -1.0,  0.0,
             0.0, -1.0,  0.0,
             0.0, -1.0,  0.0,
             0.0, -1.0,  0.0,
        
            // Right
             1.0,  0.0,  0.0,
             1.0,  0.0,  0.0,
             1.0,  0.0,  0.0,
             1.0,  0.0,  0.0,
        
            // Left
            -1.0,  0.0,  0.0,
            -1.0,  0.0,  0.0,
            -1.0,  0.0,  0.0,
            -1.0,  0.0,  0.0
        ];

        this.context.bufferData(this.context.ARRAY_BUFFER, new Float32Array(vertexNormals), this.context.STATIC_DRAW);
        this.buffers.normal = normalBuffer;
    }

    /**
     * Update texture buffer.
     *
     * @protected
     * @memberof Cube
     */
    public updateTextureBuffer() {
        const textureCoordBuffer = this.context.createBuffer();
        this.context.bindBuffer(this.context.ARRAY_BUFFER, textureCoordBuffer);

        let textureCoordinates: number[];

        if (this.mode === CubeMode.GRASS) {
            const arroundOne = this.grassArround ? AtlasTexture.earthAndGrassCube : AtlasTexture.earthCube;
            const arroundTwo = this.grassArround ? AtlasTexture.earthAndGrassCubeTwo : AtlasTexture.earthCube;
            const topTexture = this.grassArround ? AtlasTexture.grassCube : AtlasTexture.earthCube;
    
            textureCoordinates = [
                // Front
                ...AtlasTexture.grassCube,
                // Back
                ...AtlasTexture.grassCube,
                // Bottom
                ...AtlasTexture.grassCube,
                // Top
                ...AtlasTexture.grassCube,
                // Left
                ...AtlasTexture.grassCube,
                // Right
                ...AtlasTexture.grassCube,
            ];
        } else if (this.mode === CubeMode.EARTH) {
            textureCoordinates = [
                // Front
                ...AtlasTexture.earthCube,
                // Back
                ...AtlasTexture.earthCube,
                // Bottom
                ...AtlasTexture.earthCube,
                // Top
                ...AtlasTexture.earthCube,
                // Left
                ...AtlasTexture.earthCube,
                // Right
                ...AtlasTexture.earthCube,
            ];
        } else if (this.mode === CubeMode.IRON) {
            textureCoordinates = [
                // Front
                ...AtlasTexture.darkCube,
                // Back
                ...AtlasTexture.darkCube,
                // Bottom
                ...AtlasTexture.darkCube,
                // Top
                ...AtlasTexture.darkCube,
                // Left
                ...AtlasTexture.darkCube,
                // Right
                ...AtlasTexture.darkCube,
            ];
        }

        

        this.context.bufferData(this.context.ARRAY_BUFFER, new Float32Array(textureCoordinates), this.context.STATIC_DRAW);
        this.buffers.texture = textureCoordBuffer;
    }

    /**
     * Update indices buffer.
     *
     * @protected
     * @memberof Cube
     */
    protected updateIndicesBuffer() {
        const indexBuffer = this.context.createBuffer();
        
        const indices = [
            0,  1,  2,      0,  2,  3,    // front
            4,  6,  7,      4,  5,  6,    // back
            8,  9,  10,     8,  10, 11,   // top
            12, 13, 14,     12, 14, 15,   // bottom
            16, 17, 18,     16, 18, 19,   // right
            20, 21, 22,     20, 22, 23,   // left
        ];
        
        this.context.bindBuffer(this.context.ELEMENT_ARRAY_BUFFER, indexBuffer);
        this.context.bufferData(this.context.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), this.context.STATIC_DRAW);
        this.buffers.indices = indexBuffer;
    }
}