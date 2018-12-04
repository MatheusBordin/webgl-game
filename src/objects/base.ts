import { IPosition } from "../types/position";
import { BaseProgram } from "../programs/base";
import { IObjectBuffer } from "../types/object-buffer";

export abstract class BaseObject {
    protected context: WebGLRenderingContext;
    protected program: BaseProgram;
    protected position: IPosition = { x: 0, y: 0, z: 0 };
    protected buffers: IObjectBuffer = { position: null, color: null, indices: null };

    public abstract draw(time: number): void;
    protected abstract initBuffers(): void;
    protected abstract updatePositionBuffer(): void;
    protected abstract updateColorBuffer(): void;
    protected abstract updateIndicesBuffer(): void;

    constructor(context: WebGLRenderingContext, program: BaseProgram) {
        this.context = context;
        this.program = program;
    }

    public translate(x: number, y: number, z: number) {
        this.position.x = x;
        this.position.y = y;
        this.position.z = z;

        this.updatePositionBuffer();
    }
}