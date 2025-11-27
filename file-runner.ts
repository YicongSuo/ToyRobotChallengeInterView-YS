// Node
import * as fs from 'fs';
import * as path from 'path';

// Utils
import { RobotGame } from './utils/robot-game';
import { CommandParser } from './utils/command-parser';

// Constants
import { directionConstant } from './constants/constants';

// read commands from file
export class FileRunner {
  // run file
  static async runFile(filePath: string): Promise<void> {
    try {
      // check if file is exist or not
      if (!fs.existsSync(filePath)) {
        console.error(`❌ file not exist: ${filePath}`);
        return;
      }

      // read content from file
      const content = fs.readFileSync(filePath, 'utf-8');
      
      console.log('command file executor');
      console.log(`read file: ${path.basename(filePath)}`);
      console.log('='.repeat(50));
      console.log('file content:');
      console.log(content);
      console.log('='.repeat(50));

      // create game instance
      const mapSize = 5;
      const game = new RobotGame({
          mapSize: mapSize,
          initialPosition: { x: 0, y: 0 },
          initialDirection: directionConstant.north
        });

      // parse and execute the command line by line
      CommandParser.parseAndExecute(content, game);

      // display final status
      console.log('Final status:');
      game.displayMap(mapSize);
      
    } catch (error) {
      console.error('❌ execute error:', error);
    }
  }

  // run from command args
  static runFromArgs(): void {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
      console.log('how to use:');
      console.log('  npm run file <command file path>');
      console.log('\nsample:');
      console.log('  npm run file commands.txt');
      return;
    }

    const filePath = args[0];
    this.runFile(filePath);
  }
}

// for direct execute
if (require.main === module) {
  FileRunner.runFromArgs();
}