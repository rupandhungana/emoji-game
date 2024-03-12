interface Ball {
  emoji: string;
  x: number;
  y: number;
  size: number;
  speed: number;
  startTime: number;

  colors: number[][];

  radius: number;

  velocity: number;
  rotationAngle: number;

  direction: {
    x: number;
    y: number;
  };
}

interface Controller {
  height: number;
  width: number;
  x: number;
  y: number;
}
