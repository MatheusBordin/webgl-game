export class Control {
    private leftCallback: () => void = () => null;
    private rightCallback: () => void = () => null;
    private frontCallback: () => void = () => null;
    private backCallback: () => void = () => null;
    private upCallback: () => void = () => null;
    private downCallback: () => void = () => null;
    private resizeCallback: () => void = () => null;
    private mouseCallback: (deltaX: number, deltaY: number) => void = () => null;

    constructor() {
        this.bindEvents();
    }

    public bindEvents() {
        document.addEventListener('keydown', this.onKeyPress.bind(this));
        document.addEventListener('mousemove', this.onMouseMove.bind(this))
        window.addEventListener('resize', () => this.resizeCallback());
    }

    public onResize(cb: () => void) {
        this.resizeCallback = cb;
    }

    public onLeft(cb: () => void) {
        this.leftCallback = cb;
    }

    public onRight(cb: () => void) {
        this.rightCallback = cb;
    }

    public onFront(cb: () => void) {
        this.frontCallback = cb;
    }

    public onBack(cb: () => void) {
        this.backCallback = cb;
    }

    public onUp(cb: () => void) {
        this.upCallback = cb;                                
    }

    public onDown(cb: () => void) {
        this.downCallback = cb;
    }

    public onMouseChange(cb: (deltaX: number, deltaY: number) => void) {
        this.mouseCallback = cb;
    }

    private onMouseMove(event: MouseEvent) {
        const x = event.clientX;
        const y = event.clientY;

        const halfWidth = window.innerWidth / 2;
        const halfHeight = window.innerHeight / 2;

        const deltaX = x - halfWidth;
        const deltaY = y - halfHeight;

        this.mouseCallback(deltaX, deltaY);
    }

    private onKeyPress(event: KeyboardEvent) {
        if (event.keyCode == 87 || event.keyCode == 38) {
            // Front
            this.frontCallback();
        } else if (event.keyCode == 83 || event.keyCode == 40) {
            // Back
            this.backCallback();
        } else if (event.keyCode == 65 || event.keyCode == 37) {
            // Left
            this.leftCallback();
        } else if (event.keyCode == 68 || event.keyCode == 39) {
            // Right
            this.rightCallback();
        } else if (event.keyCode == 32) {
            // Up
            this.upCallback();
        } else if (event.keyCode == 16) {
            // Down
            this.downCallback();            
        }
    }
}