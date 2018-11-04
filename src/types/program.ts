export interface IProgram {
    program: WebGLProgram;

    attributeLocations: {
        vertexPosition: number;
        vertexColor: number;
    };
    
    uniformLocations: {
        projectionMatrix: WebGLUniformLocation;
        modelViewMatrix: WebGLUniformLocation;
    };
}