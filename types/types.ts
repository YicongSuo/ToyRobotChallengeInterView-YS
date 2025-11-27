export type Direction = 'North' | 'South' | 'West' | 'East';

export interface DirectionConstantType {
  north: Direction,
  south: Direction,
  east: Direction,
  west: Direction,
}

export type TurnDirection = 'Left' | 'Right';

export interface TurnDirectionConstantType {
  left: TurnDirection,
  right: TurnDirection,
}

export interface Position {
  x: number;
  y: number;
}

export interface RobotState {
  x: number;
  y: number;
  direction: Direction;
}

export interface MapBorder {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

export type DirectionSymbols = {
  [key in Direction]: string;
};

export interface GameConfig {
  mapSize?: number;
  initialPosition?: Position;
  initialDirection?: Direction;
}

export interface OperationResult {
  success: boolean;
  message: string;
  state?: RobotState;
}

export interface Command {
  type: 'place' | 'move' | 'turn' | 'report' | 'display';
  args?: any[];
}