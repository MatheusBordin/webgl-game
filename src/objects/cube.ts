import { mat4 } from "gl-matrix";
import { BaseObject } from "./base";
import { IObjectBuffer } from "../types/object-buffer";
import { BaseProgram } from "../programs/base";
import { IPosition } from "../types/position";

export class Cube extends BaseObject {
    private size: number;

    constructor(context: WebGLRenderingContext, program: BaseProgram, size: number) {
        super(context, program);

        this.size = size;
        this.initBuffers();
    }

    draw(time: number): void {
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

        const colorComponents = 4;
        const colorType = this.context.FLOAT;
        const colorNormalize = false;
        const colorStride = 0;
        const colorOffset = 0;

        this.context.bindBuffer(this.context.ARRAY_BUFFER, this.buffers.color);
        this.context.vertexAttribPointer(
            this.program.attributeLocations.vertexColor,
            colorComponents,
            colorType,
            colorNormalize,
            colorStride,
            colorOffset
        );

        this.context.enableVertexAttribArray(this.program.attributeLocations.vertexColor);
        this.context.bindBuffer(this.context.ELEMENT_ARRAY_BUFFER, this.buffers.indices);
    
        const vertexCount = 36;
        const type = this.context.UNSIGNED_SHORT;
        const offset = 0;

        this.context.useProgram(this.program.program);
        this.context.drawElements(this.context.TRIANGLES, vertexCount, type, offset);
    }

    protected initBuffers() {
        this.updatePositionBuffer();
        this.updateColorBuffer();
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

    protected updateColorBuffer() {
        const faceColors = [
            [1.0,  1.0,  1.0,  1.0],    // Front face: white
            [1.0,  0.0,  0.0,  1.0],    // Back face: red
            [0.0,  1.0,  0.0,  1.0],    // Top face: green
            [0.0,  0.0,  1.0,  1.0],    // Bottom face: blue
            [1.0,  1.0,  0.0,  1.0],    // Right face: yellow
            [1.0,  0.0,  1.0,  1.0],    // Left face: purple
        ];

        let colors: number[] = [];
        for (var j = 0; j < faceColors.length; ++j) {
            const c = faceColors[j];

            colors = colors.concat(c, c, c, c);
        }

        const colorBuffer = this.context.createBuffer();
        this.context.bindBuffer(this.context.ARRAY_BUFFER, colorBuffer);
        this.context.bufferData(this.context.ARRAY_BUFFER, new Float32Array(colors), this.context.STATIC_DRAW);

        this.buffers.color = colorBuffer;
    }

    protected updateIndicesBuffer() {
        const indexBuffer = this.context.createBuffer();
        
        const indices = [
            0,  1,  2,      0,  2,  3,    // front
            4,  5,  6,      4,  6,  7,    // back
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