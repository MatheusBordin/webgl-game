export  class AtlasTexture {
    public static load(gl: WebGLRenderingContext) {
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);

        const level = 0;
        const internalFormat = gl.RGBA;
        const width = 1;
        const height = 1;
        const border = 0;
        const srcFormat = gl.RGBA;
        const srcType = gl.UNSIGNED_BYTE;
        const pixel = new Uint8Array([0, 0, 255, 255]);

        gl.texImage2D(
            gl.TEXTURE_2D, 
            level, 
            internalFormat,
            width, 
            height, 
            border, 
            srcFormat, 
            srcType,
            pixel
        );
      
        const image = new Image();
        image.onload = function() {
          gl.bindTexture(gl.TEXTURE_2D, texture);
          gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, srcFormat, srcType, image);
      
          const isPowerOf2 = (value: number) => (value & (value - 1)) == 0;

          if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
             gl.generateMipmap(gl.TEXTURE_2D);
          } else {
             gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
             gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
             gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
          }
        };

        image.src = '/assets/textures/atlas.png';
        return texture;
    }

    public static get earthCube() {
        return [
            0.0,  0.0,
            .25,  0.0,
            .25,  1.0,
            0.0,  1.0
        ];
    }

    public static get earthAndGrassCube() {
        return [
            .25,  0.0,
            .50,  0.0,
            .50,  1.0,
            .25,  1.0,
        ];
    }

    public static get earthAndGrassCubeTwo() {
        return [
            .50,  0.0,
            .50,  1.0,
            .25,  1.0,
            .25,  0.0,
        ];
    }

    public static get grassCube() {
        return [
            .50,  0.0,
            .75,  0.0,
            .75,  1.0,
            .50,  1.0,
        ];
    }

    public static get darkCube() {
        return [
            .75,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            .75,  1.0,
        ];
    }
}

