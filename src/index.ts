import { Game } from "./game";
import { Cube } from "./objects/cube";
import { BasicProgram } from "./programs/basic";
import { Camera } from "./objects/camera";

const game = new Game();
const program = new BasicProgram(game.context);
const camera = new Camera(game.context, program);
const cube = new Cube(game.context, program, 3);

game.setCamera(camera);
game.addObject(cube);

game.start();