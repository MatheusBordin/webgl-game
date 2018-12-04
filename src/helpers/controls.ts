import { IMoveDirection } from "../types/move-direction";
import { IMousePoint } from "../types/mouse-point";

type ChangeCallback = (keysPress?: IMoveDirection, oldMouse?: IMousePoint, currMose?: IMousePoint) => void;

export class Control {
    private changeCallback: ChangeCallback = () => null;
    private resizeCallback: () => void = () => null;
    private mousePoint: IMousePoint;
    private keysPress: IMoveDirection = {
        left: false,
        right: false,
        front: false,
        back: false,
        up: false,
        down: false
    };

    constructor() {
        this.bindEvents();
    }

    public bindEvents() {
        document.addEventListener('keydown', this.onKeyDown.bind(this));
        document.addEventListener('keyup', this.onKeyUp.bind(this));
        document.addEventListener('mousemove', this.onMouseMove.bind(this))
       
        window.addEventListener('resize', () => this.resizeCallback());
    }

    public onChange(cb: ChangeCallback) {
        this.changeCallback = cb;
    }

    public onResize(cb: () => void) {
        this.resizeCallback = cb;
    }

    private onMouseMove(event: MouseEvent) {
        if (!this.mousePoint) {
            this.mousePoint = {
                x: event.clientX,
                y: event.clientY
            };
        }

        const oldMousePoint: IMousePoint = {
            x: this.mousePoint.x,
            y: this.mousePoint.y
        };

        this.mousePoint.x = event.clientX;
        this.mousePoint.y = event.clientY;

        this.changeCallback(this.keysPress, oldMousePoint, this.mousePoint);
    }

    private onKeyDown(event: KeyboardEvent) {
        if (event.keyCode == 87 || event.keyCode == 38) {
            // Front
            this.keysPress.front = true;
        } else if (event.keyCode == 83 || event.keyCode == 40) {
            // Back
            this.keysPress.back = true;
        } else if (event.keyCode == 65 || event.keyCode == 37) {
            // Left
            this.keysPress.left = true;
        } else if (event.keyCode == 68 || event.keyCode == 39) {
            // Right
            this.keysPress.right = true;
        } else if (event.keyCode == 32) {
            // Up
            this.keysPress.up = true;
        } else if (event.keyCode == 16) {
            // Down
            this.keysPress.down = true;    
        } else {
            return;
        }

        this.changeCallback(this.keysPress, this.mousePoint, this.mousePoint);
    }

    private onKeyUp(event: KeyboardEvent) {
        if (event.keyCode == 87 || event.keyCode == 38) {
            // Front
            this.keysPress.front = false;
        } else if (event.keyCode == 83 || event.keyCode == 40) {
            // Back
            this.keysPress.back = false;
        } else if (event.keyCode == 65 || event.keyCode == 37) {
            // Left
            this.keysPress.left = false;
        } else if (event.keyCode == 68 || event.keyCode == 39) {
            // Right
            this.keysPress.right = false;
        } else if (event.keyCode == 32) {
            // Up
            this.keysPress.up = false;
        } else if (event.keyCode == 16) {
            // Down
            this.keysPress.down = false;    
        } else {
            return;
        }

        this.changeCallback(this.keysPress, this.mousePoint, this.mousePoint);
    }
}