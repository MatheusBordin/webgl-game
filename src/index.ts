import { Game } from "./game";
import { Cube } from "./objects/cube";
import { BasicProgram } from "./programs/basic";
import { Camera } from "./objects/camera";
import { Control } from "./helpers/controls";

const game = new Game();
const program = new BasicProgram(game.context);
const camera = new Camera(game.context, program);
const cube = new Cube(game.context, program, 3);
const control = new Control();

game.setCamera(camera);
game.addObject(cube);

control.onResize(() => {
    game.configureSize();
    camera.configure();
});
control.onLeft(() => camera.translateLeft());
control.onRight(() => camera.translateRight());
control.onFront(() => camera.translateFront());
control.onBack(() => camera.translateBack());
control.onUp(() => camera.translateUp());
control.onDown(() => camera.translateDown());
control.onMouseChange((deltaX, deltaY) => {
    camera.changeLookAt(camera.x + deltaX, camera.y + deltaY, camera.z - 10);
});

game.start();