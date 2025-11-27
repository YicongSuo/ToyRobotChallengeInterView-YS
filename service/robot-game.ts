// Type
import type {
  Direction,
  TurnDirection,
  Position,
  RobotState,
  MapBorder,
  DirectionSymbols,
  GameConfig,
  OperationResult
} from '../types/types';

// Constants
import { directionConstant, turnDirectionConstantType } from '../constants/constants'

// Utils
import { appendToFile } from '../utils/writeFile'


// robotPositionGame
export class RobotGame {
  private readonly bounds: MapBorder;
  private robot: RobotState;
  private readonly directionSymbols: DirectionSymbols;
  private readonly directions: Direction[];
  public mapSize: number;
  public hasInit: boolean;

  constructor(config: GameConfig = {}) {
    this.mapSize = config.mapSize || 5;
    this.hasInit = false;
    
    // init map
    this.bounds = {
      minX: 0,
      maxX: this.mapSize,
      minY: 0,
      maxY: this.mapSize
    };

    // init robot status
    this.robot = {
      x: config.initialPosition?.x ?? 0,
      y: config.initialPosition?.y ?? 0,
      direction: config.initialDirection ?? 'North'
    };

    // symbols for direction
    this.directionSymbols = {
      'North': '↑',
      'East': '→',
      'South': '↓',
      'West': '←'
    };

    // direction array
    this.directions = ['North', 'East', 'South', 'West'];
  }

  // function 1: set robot position
  public setPosition(x: number, y: number, direction: Direction = 'North'): OperationResult {
    if (!this.isValidPosition(x, y)) {
      const message = `❌ Location out of range! Coordinates must be within (${this.bounds.minX},${this.bounds.minY}) to (${this.bounds.maxX},${this.bounds.maxY})`;
      console.log(message);
      return { success: false, message };
    }

    if (!this.isValidDirection(direction)) {
      const message = '❌ The direction must be one of North, East, South, or West.';
      console.log(message);
      return { success: false, message };
    }

    this.robot.x = x;
    this.robot.y = y;
    this.robot.direction = direction;
    
    const message = `✅ Robot has been placed at (${x}, ${y})，face to the ${direction}`;
    // robot has been placed
    this.hasInit = true;
    console.log(message);
    return { 
      success: true, 
      message,
      state: { ...this.robot }
    };
  }

  // function 2: moving function based on current direction
  public move(steps: number = 1): OperationResult {
    console.log('hasInit', this.hasInit)
    if(this.hasInit === false){
      const message = `❌ robot has not initialized yet`;
      console.log(message);
      return { success: false, message, state: { ...this.robot } };
    }
    const { x: newX, y: newY } = this.calculateNewPosition(steps);

    if (!this.isValidPosition(newX, newY)) {
      const message = `❌ Unable to move! Will exceed the boundary.`;
      console.log(message);
      return { success: false, message, state: { ...this.robot } };
    }

    this.robot.x = newX;
    this.robot.y = newY;
    
    const message = `Robot has moved ${steps} step`;
    console.log(message);
    return { 
      success: true, 
      message,
      state: { ...this.robot }
    };
  }

  // function 3: turning function
  public turn(direction: TurnDirection): OperationResult {
    if(this.hasInit === false){
      const message = `❌ robot has not initialized yet`;
      console.log(message);
      return { success: false, message, state: { ...this.robot } };
    }
    const currentIndex = this.directions.indexOf(this.robot.direction);
    let newDirection: Direction;

    if (direction === turnDirectionConstantType.left) {
      newDirection = this.directions[(currentIndex + 3) % 4];
      const message = `turn left，currently face to ${newDirection}`;
      console.log(message);
      this.robot.direction = newDirection;
      return { success: true, message, state: { ...this.robot } };
    } else if (direction === turnDirectionConstantType.right) {
      newDirection = this.directions[(currentIndex + 1) % 4];
      const message = `turn right，currently face to ${newDirection}`;
      console.log(message);
      this.robot.direction = newDirection;
      return { success: true, message, state: { ...this.robot } };
    } else {
      const message = '❌ direction must be Left or Right';
      console.log(message);
      return { success: false, message };
    }
  }

  // function 4: report current coordinate
  public report(): RobotState | null {
    if(this.hasInit === false){
      const message = `❌ robot has not initialized yet`;
      console.log(message);
      return null;
    }
    const reportInfo = `${this.robot.x}, ${this.robot.y}, ${this.robot.direction.toUpperCase()}`
    console.log('\n' + '='.repeat(40));
    console.log('Robot position report:');
    console.log(`Output: ${reportInfo}`);
    console.log('='.repeat(40) + '\n');
    
    appendToFile(reportInfo)
    // commend this line if report will not end the game
    // robot has been removed
    this.hasInit = false;
    
    return { ...this.robot };
  }

  // display map
  public displayMap(mapSize: number): void {
    console.log(`\nGame Map (${mapSize}x${mapSize}):`);
    console.log('   ' + '─'.repeat(42));

    for (let y = this.bounds.maxY; y >= this.bounds.minY; y--) {
      let row = `${y >= 0 ? ' ' : ''}${y} │ `;
      
      for (let x = this.bounds.minX; x <= this.bounds.maxX; x++) {
        if (x === this.robot.x && y === this.robot.y) {
          row += ` ${this.directionSymbols[this.robot.direction]} `;
        } else if (x === 0 && y === 0) {
          row += ' ⊕ ';
        } else {
          row += ' · ';
        }
      }
      
      row += '│';
      console.log(row);
    }

    console.log('   ' + '─'.repeat(42));
    process.stdout.write('     ');
    for(let i=0; i <= mapSize; i++){
      const printNumber = this.bounds.minX + i
      process.stdout.write(` ${printNumber} `);
    }
    process.stdout.write('  (x-axis)');
    console.log();
  }

  // get current status of robot
  public getState(): RobotState {
    return { ...this.robot };
  }

  // get map border information
  public getBounds(): MapBorder {
    return { ...this.bounds };
  }

  // reset robot position to init point
  public reset(position?: Position, direction?: Direction): void {
    this.robot.x = position?.x ?? 0;
    this.robot.y = position?.y ?? 0;
    this.robot.direction = direction ?? 'North';
    console.log('The robot has been reset.');
  }

  // position check
  private isValidPosition(x: number, y: number): boolean {
    return x >= this.bounds.minX && 
           x <= this.bounds.maxX && 
           y >= this.bounds.minY && 
           y <= this.bounds.maxY;
  }

  // check if direction is valid or not
  private isValidDirection(direction: string): direction is Direction {
    return this.directions.includes(direction as Direction);
  }

  // calculate new position
  private calculateNewPosition(steps: number): Position {
    let newX = this.robot.x;
    let newY = this.robot.y;

    switch (this.robot.direction) {
      case directionConstant.north:
        newY += steps;
        break;
      case directionConstant.east:
        newX += steps;
        break;
      case directionConstant.south:
        newY -= steps;
        break;
      case directionConstant.west:
        newX -= steps;
        break;
    }

    return { x: newX, y: newY };
  }
}

export default RobotGame;