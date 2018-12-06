import { BaseObject } from "../objects/base";
import { Face } from "./face";

export class FaceDetection {
    object: BaseObject;
    face: Face;
    x: number;
    z: number;
    heightPosition: number;
}