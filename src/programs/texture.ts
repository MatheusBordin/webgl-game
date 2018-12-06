import { fragmentShader as fsShader } from "../shaders/texture/fragmentShader";
import { verticeShader as vsShader } from "../shaders/texture/verticeShader";
import { BaseProgram } from "./base";

/**
 * Basic program to draw elements.
 *
 * @export
 * @class BasicProgram
 */
export class TextureProgram extends BaseProgram {
    public program: WebGLProgram;

    public attributeLocations: {
        vertexPosition: number;
        vertexNormal: number;
        textureCoord: number;
    };
    
    public uniformLocations: {
        projectionMatrix: WebGLUniformLocation;
        modelViewMatrix: WebGLUniformLocation;
        normalMatrix: WebGLUniformLocation;
        uSampler: WebGLUniformLocation;
    };

    constructor(private readonly gl: WebGLRenderingContext) {
        super();

        this.buildProgram();
    }

    /**
     * Build program using shaders.
     *
     * @protected
     * @returns {IProgram}
     * @memberof BasicProgram
     */
    protected buildProgram(): void {
        const vertexShader = this.loadShader(this.gl.VERTEX_SHADER, vsShader);
        const fragmentShader = this.loadShader(this.gl.FRAGMENT_SHADER, fsShader);

        const shaderProgram = this.gl.createProgram();
        this.gl.attachShader(shaderProgram, vertexShader);
        this.gl.attachShader(shaderProgram, fragmentShader);
        this.gl.linkProgram(shaderProgram);

        const programStatus = this.gl.getProgramParameter(shaderProgram, this.gl.LINK_STATUS);

        if (!programStatus) {
            throw new Error(`Unable to initialize the shader program: ${this.gl.getProgramInfoLog(shaderProgram)}`);
        }

        // Set program.
        this.program = shaderProgram;

        // Set attribute locations.
        this.attributeLocations = {
            vertexPosition: this.gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
            vertexNormal: this.gl.getAttribLocation(shaderProgram, 'aVertexNormal'),
            textureCoord: this.gl.getAttribLocation(shaderProgram, 'aTextureCoord')
        };

        // Set uniform locations.
        this.uniformLocations = {
            projectionMatrix: this.gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
            modelViewMatrix: this.gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
            normalMatrix: this.gl.getUniformLocation(shaderProgram, 'uNormalMatrix'),
            uSampler: this.gl.getUniformLocation(shaderProgram, 'uSampler')
        };
    }

    /**
     * Load shaders
     *
     * @protected
     * @param {number} type
     * @param {string} content
     * @returns {WebGLShader}
     * @memberof BasicProgram
     */
    protected loadShader(type: number, content: string): WebGLShader {
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