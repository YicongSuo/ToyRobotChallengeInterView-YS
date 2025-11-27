// command-parser
import { Command, Direction, TurnDirection } from '../types/types';
import { RobotGame } from './robot-game';



// command-parser
export class CommandParser {
  // parse single line command
  static parseLine(line: string): Command | null {
    // remove space
    line = line.trim();
    
    // ignore comment
    if (!line || line.startsWith('#') || line.startsWith('//')) {
      return null;
    }

    // divide command based on line
    const parts = line.split(',').map(part => part.trim());
    const commandName = parts[0].toLowerCase();

    switch (commandName) {
      case 'place':
      case 'setPosition':
        if (parts.length >= 4) {
          const x = parseInt(parts[1]);
          const y = parseInt(parts[2]);
          const direction = this.normalizeDirection(parts[3]);
          
          if (isNaN(x) || isNaN(y) || !direction) {
            console.error(`❌ inValid place command: ${line}`);
            return null;
          }
          
          return {
            type: 'place',
            args: [x, y, direction]
          };
        }
        console.error(`❌ insufficient args for place command: ${line}`);
        return null;

      case 'move':
        const steps = parts.length > 1 ? parseInt(parts[1]) : 1;
        return {
          type: 'move',
          args: [isNaN(steps) ? 1 : steps]
        };

      case 'left':
      case 'right':
      case 'turn':
        let turnDirection: TurnDirection;
        
        if (commandName === 'left') {
          turnDirection = 'Left';
        } else if (commandName === 'right') {
          turnDirection = 'Right';
        } else {
          turnDirection = parts.length > 1 
            ? (parts[1].toLowerCase() === 'left' ? 'Left' : 'Right')
            : 'Left';
        }
        
        return {
          type: 'turn',
          args: [turnDirection]
        };

      case 'report':
        return {
          type: 'report',
          args: []
        };

      case 'display':
      case 'map':
      case 'show':
        return {
          type: 'display',
          args: []
        };

      default:
        console.error(`❌ unKnown command: ${commandName}`);
        return null;
    }
  }

  // standarize the direction
  private static normalizeDirection(dir: string): Direction | null {
    const normalized = dir.toLowerCase();
    
    const directionMap: { [key: string]: Direction } = {
      'north': 'North',
      'east': 'East',
      'south': 'South',
      'west': 'West',
    };

    return directionMap[normalized] || null;
  }

  // execute command
  static executeCommand(command: Command, game: RobotGame): void {
    switch (command.type) {
      case 'place':
        game.setPosition(...command.args! as [number, number, Direction]);
        break;
      
      case 'move':
        game.move(...command.args! as [number]);
        break;
      
      case 'turn':
        game.turn(...command.args! as [TurnDirection]);
        break;
      
      case 'report':
        game.report();
        break;
      
      case 'display':
        game.displayMap(game.mapSize);
        break;
    }
  }

  // entry function for command parser
  static parseAndExecute(content: string, game: RobotGame): void {
    const lines = content.split('\n');
    let executedCount = 0;

    console.log('Start execute...\n');
    console.log('='.repeat(50));

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const command = this.parseLine(line);

      if (command) {
        console.log(`\nexecute command ${i + 1}: ${line}`);
        console.log('─'.repeat(50));
        this.executeCommand(command, game);
        executedCount++;
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log(`✅ command finished！we finished ${executedCount} commands in total\n`);
  }
}