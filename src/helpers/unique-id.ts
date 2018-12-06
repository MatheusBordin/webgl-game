
/**
 * UniqueID control.
 *
 * @export
 * @class UniqueID
 */
export class UniqueID {
    public red_bits: number;
    public green_bits: number;
    public blue_bits: number;
    public alpha_bits: number;
    public total_bits: number;

    public red_scale: number;
    public green_scale: number;
    public blue_scale: number;
    public alpha_scale: number;

    public red_shift: number;
    public green_shift: number;
    public blue_shift: number;

    constructor(gl: WebGLRenderingContext) {
        this.red_bits   = gl.getParameter(gl.RED_BITS);
        this.green_bits = gl.getParameter(gl.GREEN_BITS);
        this.blue_bits  = gl.getParameter(gl.BLUE_BITS);
        this.alpha_bits = gl.getParameter(gl.ALPHA_BITS);
        this.total_bits = this.red_bits + this.green_bits + this.blue_bits + this.alpha_bits;

        this.red_scale   = Math.pow(2, this.red_bits);
        this.green_scale = Math.pow(2, this.green_bits);
        this.blue_scale  = Math.pow(2, this.blue_bits);
        this.alpha_scale = Math.pow(2, this.alpha_bits);

        this.red_shift   = Math.pow(2, this.green_bits + this.blue_bits + this.alpha_bits);
        this.green_shift = Math.pow(2, this.blue_bits + this.alpha_bits);
        this.blue_shift  = Math.pow(2, this.alpha_bits);
    }

    /**
     * Position to usual color.
     *
     * @param {number} id
     * @returns
     * @memberof UniqueID
     */
    public toColor(id: number) {
        let color = new Float32Array(4);
        let r, g, b, a;

        r = Math.floor(id / this.red_shift);
        id = id - (r * this.red_shift);
    
        g = Math.floor(id / this.green_shift);
        id = id - (g * this.green_shift);
    
        b = Math.floor(id / this.blue_shift);
        id = id - (b * this.blue_shift);
    
        a = id;
    
        color[0] = r / (this.red_scale - 1);
        color[1] = g / (this.green_scale - 1);
        color[2] = b / (this.blue_scale - 1);
        color[3] = a / (this.alpha_scale - 1);
        return color;
    }

    /**
     * Convert color of buffer to id.
     *
     * @param {number} r
     * @param {number} g
     * @param {number} b
     * @param {number} a
     * @returns
     * @memberof UniqueID
     */
    public fromColor(r: number, g: number, b: number, a: number) {
        return (r * this.red_shift + g * this.green_shift + b * this.blue_shift + a);
    }
}

/**
 * Generate ID.
 *
 * @class IDGen
 */
class IDGen {
    private current = 0;

    public next() {
        this.current++;
        return this.current;
    }
}

export const IDGenerator = new IDGen();