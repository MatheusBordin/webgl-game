import { mat4 } from "gl-matrix";
import { fragmentShader } from "./fragmentShader";
import { verticeShader } from "./verticeShader";
import { BaseObject } from "../object";
import { IObjectBuffer } from "../../types/object-buffer";

export class Cube extends BaseObject {
    private size: number;
    private buffers: IObjectBuffer;

    private cubeRotation: number = 0;

    constructor(gl: WebGLRenderingContext, size: number) {
        super(gl, verticeShader, fragmentShader);

        this.size = size;
        this.initBuffers();
    }

    draw(time: number): void {
        const fieldOfView = 45 * Math.PI / 180;   // in radians
        const aspect = this.gl.canvas.clientWidth / this.gl.canvas.clientHeight;
        const zNear = 0.1;
        const zFar = 100.0;
        const projectionMatrix = mat4.create();

        mat4.perspective(
            projectionMatrix,
            fieldOfView,
            aspect,
            zNear,
            zFar
        );

        const modelViewMatrix = mat4.create();

        mat4.translate(
            modelViewMatrix,
            modelViewMatrix,
            [-0.0, 0.0, -6.0]
        );
        mat4.rotate(
            modelViewMatrix,
            modelViewMatrix,
            this.cubeRotation,
            [0, 0, 1]
        );
        mat4.rotate(
            modelViewMatrix,
            modelViewMatrix,
            this.cubeRotation * .7,
            [0, 1, 0]
        );

        {
            const numComponents = 3;
            const type = this.gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;

            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.position);
            this.gl.vertexAttribPointer(
                this.program.attributeLocations.vertexPosition,
                numComponents,
                type,
                normalize,
                stride,
                offset
            );
            this.gl.enableVertexAttribArray(this.program.attributeLocations.vertexPosition);
        }

        {
            const numComponents = 4;
            const type = this.gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.color);
            this.gl.vertexAttribPointer(
                this.program.attributeLocations.vertexColor,
                numComponents,
                type,
                normalize,
                stride,
                offset);
            this.gl.enableVertexAttribArray(
                this.program.attributeLocations.vertexColor);
          }
        
          // Tell Webthis.gl which indices to use to index the vertices
          this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.buffers.indices);
        
          // Tell Webthis.gl to use our program when drawing
        
          this.gl.useProgram(this.program.program);
        
          // Set the shader uniforms
        
          this.gl.uniformMatrix4fv(
              this.program.uniformLocations.projectionMatrix,
              false,
              projectionMatrix);
          this.gl.uniformMatrix4fv(
            this.program.uniformLocations.modelViewMatrix,
              false,
              modelViewMatrix);
        
          {
            const vertexCount = 36;
            const type = this.gl.UNSIGNED_SHORT;
            const offset = 0;
            this.gl.drawElements(this.gl.TRIANGLES, vertexCount, type, offset);
          }
        

        this.cubeRotation += time;
    }

    initBuffers() {
        const positionBuffer = this.gl.createBuffer();
        const halfSize = this.size / 2;
        const positions = [
            // Front face
            -halfSize, -halfSize,  halfSize,
            halfSize, -halfSize,  halfSize,
            halfSize,  halfSize,  halfSize,
            -halfSize,  halfSize,  halfSize,

            // Back face
            -halfSize, -halfSize, -halfSize,
            -halfSize,  halfSize, -halfSize,
            halfSize,  halfSize, -halfSize,
            halfSize, -halfSize, -halfSize,

            // Top face
            -halfSize,  halfSize, -halfSize,
            -halfSize,  halfSize,  halfSize,
            halfSize,  halfSize,  halfSize,
            halfSize,  halfSize, -halfSize,

            // Bottom face
            -halfSize, -halfSize, -halfSize,
            halfSize, -halfSize, -halfSize,
            halfSize, -halfSize,  halfSize,
            -halfSize, -halfSize,  halfSize,

            // Right face
            halfSize, -halfSize, -halfSize,
            halfSize,  halfSize, -halfSize,
            halfSize,  halfSize,  halfSize,
            halfSize, -halfSize,  halfSize,

            // Left face
            -halfSize, -halfSize, -halfSize,
            -halfSize, -halfSize,  halfSize,
            -halfSize,  halfSize,  halfSize,
            -halfSize,  halfSize, -halfSize,
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