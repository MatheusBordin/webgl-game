import { Game } from "./game";
import { Cube } from "./objects/cube/index";

const game = new Game();
game.addObject(
    new Cube(game.context, 2)
);