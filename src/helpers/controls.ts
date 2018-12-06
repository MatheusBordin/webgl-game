import { IMoveDirection } from "../types/move-direction";
import { IMousePoint } from "../types/mouse-point";

type ChangeCallback = (keysPress?: IMoveDirection, oldMouse?: IMousePoint, currMose?: IMousePoint) => void;
type ClickCallback = (x: number, y: number) => void;

export class Control {
    private changeCallback: ChangeCallback = () => null;
    private resizeCallback: () => void = () => null;
    private clickCallback: ClickCallback = () => null;
    private oldMousePoint: IMousePoint = { x: 0, y: 0 };
    private mousePoint: IMousePoint = { x: 0, y: 0 };
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
        document.addEventListener('click', (e: MouseEvent) => this.clickCallback(e.clientX, e.clientY));
       
        window.addEventListener('resize', () => this.resizeCallback());
    }

    public onClick(cb: ClickCallback) {
        this.clickCallback = cb;
    }

    public onChange(cb: ChangeCallback) {
        this.changeCallback = cb;
    }

    public onResize(cb: () => void) {
        this.resizeCallback = cb;
    }

    private onMouseMove(event: any) {
        const movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
        const movementY = event.movementY || event.mozMovementY|| event.webkitMovementY || 0;
        this.mousePoint.x += movementX;
        this.mousePoint.y += movementY;

        this.changeCallback(this.keysPress, this.oldMousePoint, this.mousePoint);
        
        this.oldMousePoint.x = this.mousePoint.x = window.innerWidth >> 1;
        this.oldMousePoint.y = this.mousePoint.y = window.innerHeight >> 1;
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