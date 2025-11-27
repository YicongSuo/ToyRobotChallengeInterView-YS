// main.ts
import { RobotGame } from './utils/robot-game';

// Constants
import { directionConstant } from './constants/constants'

// Utils
import interactivePrompt from './utils/readline';

// game demo
const main = ():void => {
  console.log('demo is ready！\n');

  // create game instance
  const game = new RobotGame({
    mapSize: 5,
    initialPosition: { x: 0, y: 0 },
    initialDirection: directionConstant.north
  });

  interactivePrompt(game);
  console.log('Command mode finished!')
}

// run the game
main();