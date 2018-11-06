import { mat4 } from "gl-matrix";
import { BaseObject } from "./base";
import { IObjectBuffer } from "../types/object-buffer";
import { BaseProgram } from "../programs/base";

export class Cube extends BaseObject {
    private size: number;
    private buffers: IObjectBuffer;

    private cubeRotation: number = 0;

    constructor(gl: WebGLRenderingContext, program: BaseProgram, size: number) {
        super(gl, program);

        this.size = size;
        this.initBuffers();
    }

    draw(time: number): void {
        const positionComponents = 3;
        const positionType = this.gl.FLOAT;
        const positionNormalize = false;
        const positionStride = 0;
        const positionOffset = 0;

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.position);
        this.gl.vertexAttribPointer(
            this.program.attributeLocations.vertexPosition,
            positionComponents,
            positionType,
            positionNormalize,
            positionStride,
            positionOffset
        );
        this.gl.enableVertexAttribArray(this.program.attributeLocations.vertexPosition);

        const colorComponents = 4;
        const colorType = this.gl.FLOAT;
        const colorNormalize = false;
        const colorStride = 0;
        const colorOffset = 0;

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.color);
        this.gl.vertexAttribPointer(
            this.program.attributeLocations.vertexColor,
            colorComponents,
            colorType,
            colorNormalize,
            colorStride,
            colorOffset
        );

        this.gl.enableVertexAttribArray(this.program.attributeLocations.vertexColor);
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.buffers.indices);
    
        const vertexCount = 36;
        const type = this.gl.UNSIGNED_SHORT;
        const offset = 0;

        this.gl.useProgram(this.program.program);

        this.gl.drawElements(this.gl.TRIANGLES, vertexCount, type, offset);
        this.cubeRotation += time;
    }

    initBuffers() {
        const positionBuffer = this.gl.createBuffer();
        const halfSize = this.size / 2;
        const positions = [
            // Front face
            -halfSize + 5, -halfSize,  halfSize,
             halfSize + 5, -halfSize,  halfSize,
             halfSize + 5,  halfSize,  halfSize,
            -halfSize + 5,  halfSize,  halfSize,

            // Back face
            -halfSize + 5, -halfSize, -halfSize,
            -halfSize + 5,  halfSize, -halfSize,
             halfSize + 5,  halfSize, -halfSize,
             halfSize + 5, -halfSize, -halfSize,

            // Top face
            -halfSize + 5,  halfSize, -halfSize,
            -halfSize + 5,  halfSize,  halfSize,
             halfSize + 5,  halfSize,  halfSize,
             halfSize + 5,  halfSize, -halfSize,

            // Bottom face
            -halfSize + 5, -halfSize, -halfSize,
             halfSize + 5, -halfSize, -halfSize,
             halfSize + 5, -halfSize,  halfSize,
            -halfSize + 5, -halfSize,  halfSize,

            // Right face
            halfSize + 5, -halfSize, -halfSize,
            halfSize + 5,  halfSize, -halfSize,
            halfSize + 5,  halfSize,  halfSize,
            halfSize + 5, -halfSize,  halfSize,

            // Left face
            -halfSize + 5, -halfSize, -halfSize,
            -halfSize + 5, -halfSize,  halfSize,
            -halfSize + 5,  halfSize,  halfSize,
            -halfSize + 5,  halfSize, -halfSize,
        ];

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(positions), this.gl.STATIC_DRAW);

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

        const colorBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, colorBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(colors), this.gl.STATIC_DRAW);

        const indexBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

        const indices = [
            0,  1,  2,      0,  2,  3,    // front
            4,  5,  6,      4,  6,  7,    // back
            8,  9,  10,     8,  10, 11,   // top
            12, 13, 14,     12, 14, 15,   // bottom
            16, 17, 18,     16, 18, 19,   // right
            20, 21, 22,     20, 22, 23,   // left
        ];

        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), this.gl.STATIC_DRAW);

        this.buffers = {
            position: positionBuffer,
            color: colorBuffer,
            indices: indexBuffer,
        };
    }
}