import { IPosition } from "../types/position";
import { BaseProgram } from "../programs/base";

export abstract class BaseObject {
    protected gl: WebGLRenderingContext;
    protected program: BaseProgram;
    protected position: IPosition;

    abstract initBuffers(): void;
    abstract draw(time: number): void;

    constructor(gl :WebGLRenderingContext, program: BaseProgram) {
        this.gl = gl;
        this.program = program;
    }

    public translate(x: number, y: number, z: number) {
        this.position.x = x;
        this.position.y = y;
        this.position.z = z;
    }
}