export enum CubeMode {
    EARTH = 1,
    IRON = 2,
    GRASS = 3
}

class CubeModeControl {
    public current: CubeMode = CubeMode.GRASS;
}

export const currentCubeMode = new CubeModeControl();