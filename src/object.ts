
/**
 * Game object.
 *
 * @export
 * @class GameObject
 */
export class GameObject {
    constructor(public name: string) {
    }

    /**
     * Force object to say.
     *
     * @param {string} msg Message to say.
     * @memberof GameObject
     */
    public say(msg: string): void {
        console.log(`Object '${this.name} say: ${msg}'`);
    }
}