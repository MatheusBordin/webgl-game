import { IProgram } from "../types/program";
import { IObjectBuffer } from "../types/object-buffer";

export abstract class BaseObject {
    protected vsSource: string;
    protected fsSource: string;

    protected gl: WebGLRenderingContext;
    protected program: IProgram;

    abstract initBuffers(): void;
    abstract draw(time: number): void;

    constructor(gl :WebGLRenderingContext, vsSource: string, fsSource: string) {
        this.gl = gl;
        this.vsSource = vsSource;
        this.fsSource = fsSource;

        this.program = this.getProgram();
    }

    getProgram(): IProgram {
        const vertexShader = this.loadShader(this.gl.VERTEX_SHADER, this.vsSource);
        const fragmentShader = this.loadShader(this.gl.FRAGMENT_SHADER, this.fsSource);

        const shaderProgram = this.gl.createProgram();
        this.gl.attachShader(shaderProgram, vertexShader);
        this.gl.attachShader(shaderProgram, fragmentShader);
        this.gl.linkProgram(shaderProgram);

        const programStatus = this.gl.getProgramParameter(shaderProgram, this.gl.LINK_STATUS);

        if (!programStatus) {
            throw new Error(`Unable to initialize the shader program: ${this.gl.getProgramInfoLog(shaderProgram)}`);
        }

        return {
            program: shaderProgram,
            attributeLocations: {
                vertexPosition: this.gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
                vertexColor: this.gl.getAttribLocation(shaderProgram, 'aVertexColor'),
            },
            uniformLocations: {
                projectionMatrix: this.gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
                modelViewMatrix: this.gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
            }
        };
    }

    loadShader(type: number, content: string): WebGLShader {
        const shader = this.gl.createShader(type);

        this.gl.shaderSource(shader, content);
        this.gl.compileShader(shader);

        const shaderStatus = this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS);

        if (!shaderStatus) {
            this.gl.deleteShader(shader);
            throw new Error(`An error occurred compiling the shaders: ${this.gl.getShaderInfoLog(shader)}`);
        }

        return shader;
    }
}