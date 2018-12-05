
/**
 * Base program.
 *
 * @export
 * @class BaseProgram
 */
export abstract class BaseProgram {
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

    protected abstract buildProgram(): void;
    protected abstract loadShader(type: number, content: string): WebGLShader;
}