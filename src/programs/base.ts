
/**
 * Base program.
 *
 * @export
 * @class BaseProgram
 */
export abstract class BaseProgram {
    public program: WebGLProgram;

    protected abstract buildProgram(): void;
    protected abstract loadShader(type: number, content: string): WebGLShader;
}