import { IPosition } from "../types/position";
import { BaseProgram } from "../programs/base";
import { IObjectBuffer } from "../types/object-buffer";
import { IDGenerator, UniqueID } from "../helpers/unique-id";
import { ColorProgram } from "../programs/color";

export abstract class BaseObject {
    public id: number;
    private uniqueId: UniqueID;

    protected context: WebGLRenderingContext;
    protected program: BaseProgram;
    protected virtualProgram: BaseProgram;
    protected position: IPosition = { x: 0, y: 0, z: 0 };
    protected buffers: IObjectBuffer = { position: null, texture: null, normal: null, indices: null, color: null };

    public abstract draw(time: number): void;
    protected abstract initBuffers(): void;
    protected abstract updatePositionBuffer(): void;

    constructor(context: WebGLRenderingContext, program: BaseProgram, virtualProgram: BaseProgram) {
        this.context = context;
        this.program = program;
        this.virtualProgram = virtualProgram;
        this.id = IDGenerator.next();
        this.uniqueId = new UniqueID(this.context);
    }

    public translate(x: number, y: number, z: number) {
        this.position.x = x;
        this.position.y = y;
        this.position.z = z;

        this.updatePositionBuffer();
    }

    protected updateColorBuffer() {
        const colorById = this.uniqueId.toColor(this.id);

        const faceColors = [
            [colorById[0], colorById[1], colorById[2], colorById[3]],    // Front face: white
            [colorById[0], colorById[1], colorById[2], colorById[3]],    // Back face: red
            [colorById[0], colorById[1], colorById[2], colorById[3]],    // Top face: green
            [colorById[0], colorById[1], colorById[2], colorById[3]],    // Bottom face: blue
            [colorById[0], colorById[1], colorById[2], colorById[3]],    // Right face: yellow
            [colorById[0], colorById[1], colorById[2], colorById[3]],    // Left face: purple
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

    public drawVirtual(time: number) {
        const program = this.virtualProgram as ColorProgram;

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

        const colorComponents = 4;
        const colorType = this.context.FLOAT;
        const colorNormalize = false;
        const colorStride = 0;
        const colorOffset = 0;

        this.context.bindBuffer(this.context.ARRAY_BUFFER, this.buffers.color);
        this.context.vertexAttribPointer(
            program.attributeLocations.vertexColor,
            colorComponents,
            colorType,
            colorNormalize,
            colorStride,
            colorOffset
        );

        this.context.enableVertexAttribArray(program.attributeLocations.vertexColor);
        this.context.bindBuffer(this.context.ELEMENT_ARRAY_BUFFER, this.buffers.indices);
    
        const vertexCount = 36;
        const type = this.context.UNSIGNED_SHORT;
        const offset = 0;

        this.context.useProgram(program.program);
        this.context.drawElements(this.context.TRIANGLES, vertexCount, type, offset);
    }
}