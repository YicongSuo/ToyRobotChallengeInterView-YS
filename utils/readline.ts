// Liberary
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

// Utils
import { CommandParser } from '../service/command-parser';
import RobotGame from '../service/robot-game';

export default async function interactivePrompt(game:RobotGame) {
  const rl = readline.createInterface({ input, output });

  let keepRunning = true;
  while (keepRunning) {
    const answer = await rl.question('Enter a command (or "exit" to quit): ');
    const command = answer.toLowerCase().trim();
    switch (command) {
      case 'exit':
        console.log('Exiting interactive prompt. Goodbye!');
        keepRunning = false;
        break;
      default:
        CommandParser.parseAndExecute(command, game);
    }
  }

  rl.close();
}
