import { mat4 } from "gl-matrix";
import { BaseObject } from "./base";
import { IObjectBuffer } from "../types/object-buffer";
import { BaseProgram } from "../programs/base";
import { IPosition } from "../types/position";
import { Color } from "../helpers/color";
import { AtlasTexture } from "../textures/atlas";

export class Cube extends BaseObject {
    private size: number;
    private texture: any;
    private grassArround: boolean = false;

    constructor(context: WebGLRenderingContext, program: BaseProgram, size: number) {
        super(context, program);

        this.size = size;
        this.texture = AtlasTexture.load(context);
        this.initBuffers();
    }

    public setGrassArround(value: boolean) {
        if (value !== this.grassArround) {
            this.grassArround = value;
            this.updateTextureBuffer();
        }
    }

    public draw(time: number): void {
        // Position
        const positionComponents = 3;
        const positionType = this.context.FLOAT;
        const positionNormalize = false;
        const positionStride = 0;
        const positionOffset = 0;

        this.context.bindBuffer(this.context.ARRAY_BUFFER, this.buffers.position);
        this.context.vertexAttribPointer(
            this.program.attributeLocations.vertexPosition,
            positionComponents,
            positionType,
            positionNormalize,
            positionStride,
            positionOffset
        );
        this.context.enableVertexAttribArray(this.program.attributeLocations.vertexPosition);

        // Texture
        const textureComponents = 2;
        const textureType = this.context.FLOAT;
        const textureNormalize = false;
        const textureStride = 0;
        const textureOffset = 0;

        this.context.bindBuffer(this.context.ARRAY_BUFFER, this.buffers.texture);
        this.context.vertexAttribPointer(
            this.program.attributeLocations.textureCoord,
            textureComponents,
            textureType,
            textureNormalize,
            textureStride,
            textureOffset
        );
        this.context.enableVertexAttribArray(this.program.attributeLocations.textureCoord);

        // Normal
        const normalComponents = 3;
        const normalType = this.context.FLOAT;
        const normalNormalize = false;
        const normalStride = 0;
        const normalOffset = 0;

        this.context.bindBuffer(this.context.ARRAY_BUFFER, this.buffers.normal);
        this.context.vertexAttribPointer(
            this.program.attributeLocations.vertexNormal,
            normalComponents,
            normalType,
            normalNormalize,
            normalStride,
            normalOffset
        );
        this.context.enableVertexAttribArray(this.program.attributeLocations.vertexNormal);

        // Indices
        this.context.bindBuffer(this.context.ELEMENT_ARRAY_BUFFER, this.buffers.indices);

        // Set program
        this.context.useProgram(this.program.program);

        // Choose texture
        this.context.activeTexture(this.context.TEXTURE0);
        this.context.bindTexture(this.context.TEXTURE_2D, this.texture);
        this.context.uniform1i(this.program.uniformLocations.uSampler, 0);
        
        // Draw
        const vertexCount = 36;
        const type = this.context.UNSIGNED_SHORT;
        const offset = 0;
        this.context.drawElements(this.context.TRIANGLES, vertexCount, type, offset);
    }

    protected initBuffers() {
        this.updatePositionBuffer();
        this.updateNormalBuffer();
        this.updateTextureBuffer();
        this.updateIndicesBuffer();
    }

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

    protected updateTextureBuffer() {
        const textureCoordBuffer = this.context.createBuffer();
        this.context.bindBuffer(this.context.ARRAY_BUFFER, textureCoordBuffer);

        const arroundOne = this.grassArround ? AtlasTexture.earthAndGrassCube : AtlasTexture.earthCube;
        const arroundTwo = this.grassArround ? AtlasTexture.earthAndGrassCubeTwo : AtlasTexture.earthCube;

        const textureCoordinates = [
            // Front
            ...arroundOne,
            // Back
            ...arroundTwo,
            // Bottom
            ...AtlasTexture.earthCube,
            // Top
            ...AtlasTexture.grassCube,
            // Left
            ...arroundTwo,
            // Right
            ...arroundOne,
        ];

        this.context.bufferData(this.context.ARRAY_BUFFER, new Float32Array(textureCoordinates), this.context.STATIC_DRAW);
        this.buffers.texture = textureCoordBuffer;
    }

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