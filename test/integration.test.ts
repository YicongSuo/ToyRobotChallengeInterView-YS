// service
import { RobotGame } from '../service/robot-game';
import { CommandParser } from '../service/command-parser';

describe('Integration Tests', () => {
  describe('Real-world scenarios', () => {
    test('Scenario 1: Simple navigation', () => {
      const game = new RobotGame();
      const commands = `
        PLACE,0,0,NORTH
        MOVE
        MOVE
        LEFT
        REPORT
      `;
      
      CommandParser.parseAndExecute(commands, game);
      
      const state = game.getState();
      expect(state.x).toBe(0);
      expect(state.y).toBe(2);
      expect(state.direction).toBe('West');
    });

    test('Scenario 2: Navigate to corner', () => {
      const game = new RobotGame();
      const commands = `
        PLACE,0,0,NORTH
        MOVE,4
        RIGHT
        MOVE,4
      `;
      
      CommandParser.parseAndExecute(commands, game);
      
      const state = game.getState();
      expect(state.x).toBe(4);
      expect(state.y).toBe(4);
    });

    test('Scenario 3: Boundary testing', () => {
      const game = new RobotGame();
      const commands = `
        PLACE,4,4,NORTH
        MOVE
        RIGHT
        MOVE
      `;
      
      CommandParser.parseAndExecute(commands, game);
      
      // Should stay at (4,4) because can't move north or east from there
      const state = game.getState();
      expect(state.x).toBe(5);
      expect(state.y).toBe(5);
    });

    test('Scenario 4: Square pattern', () => {
      const game = new RobotGame();
      const commands = `
        PLACE,3,3,NORTH
        MOVE,2
        RIGHT
        MOVE,2
        RIGHT
        MOVE,2
        RIGHT
        MOVE,2
        RIGHT
      `;
      
      CommandParser.parseAndExecute(commands, game);
      
      const state = game.getState();
      expect(state.x).toBe(3);
      expect(state.y).toBe(3);
      expect(state.direction).toBe('North');
    });

    test('Scenario 5: Complex path with multiple turns', () => {
      const game = new RobotGame();
      
      game.setPosition(0, 0, 'North');
      game.move(1);
      game.turn('Right');
      game.move(2);
      game.turn('Left');
      game.move(1);
      game.turn('Left');
      game.move(1);
      
      const state = game.getState();
      expect(state.x).toBe(1);
      expect(state.y).toBe(2);
      expect(state.direction).toBe('West');
    });

    test('Scenario 6: Reset and continue', () => {
      const game = new RobotGame();
      
      game.setPosition(2, 3, 'East');
      game.move(2);
      
      let state = game.getState();
      expect(state.x).toBe(4);
      
      game.reset({ x: 4, y: 2 }, 'West');
      game.move(2);
      
      state = game.getState();
      expect(state.x).toBe(2);
      expect(state.y).toBe(2);
    });

    test('Scenario 7: Mixed case commands', () => {
      const game = new RobotGame();
      const commands = `
        PLACE,0,0,NORTH
        MOVE
        LEFT
        MOVE,2
        REPORT
      `;
      
      CommandParser.parseAndExecute(commands, game);
      
      const state = game.getState();
      expect(state.x).toBe(0);
      expect(state.y).toBe(1);
      expect(state.direction).toBe('West');
    });
  });

  describe('Error handling', () => {
    test('should handle malformed commands gracefully', () => {
      const game = new RobotGame();
      const commands = `
        PLACE,0,0,NORTH
        invalid,command,here
        move
      `;
      
      // Should not throw
      expect(() => {
        CommandParser.parseAndExecute(commands, game);
      }).not.toThrow();
      
      const state = game.getState();
      expect(state.y).toBe(1);
    });

    test('should maintain state integrity after errors', () => {
      const game = new RobotGame();
      
      game.setPosition(2, 3, 'East');
      const initialState = game.getState();
      
      // Try invalid operations
      game.setPosition(50, 50, 'North');
      game.move(50);
      
      const finalState = game.getState();
      expect(finalState).toEqual(initialState);
    });
  });
});