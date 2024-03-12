import React from "react";

interface DebugPannelProps {
  ball: Ball;
  gameStatus: string;
  score: number;
}

const DebugPannel: React.FC<DebugPannelProps> = ({
  ball,
  gameStatus,
  score,
}) => {
  return (
    <div
      style={{
        position: "absolute",
        top: 50,
        right: -50,
        backgroundColor: "#fafafa",
        color: "#000",
        width: 250,
        padding: 4,
        fontSize: 14,
      }}
    >
      {/*  <p>
      <b>FPS</b>
      <FPSCounter visible={true} targetFrameRate={60}/>
    </p> */}
      <p>
        <b>Played Time</b>: {Date.now() - ball.startTime}
      </p>
      <p>
        <b>Game Status</b>: {gameStatus}
      </p>
      <p>
        <b>Speed</b>: {ball.speed}
      </p>
      <p>
        <b>Velocity</b>: {ball.velocity}
      </p>
      <p>
        <b>Score</b>: {score}
      </p>
      <p>
        <b>Ball Pos X</b>: {ball.x}
      </p>
      <p>
        <b>Ball Pos Y</b>: {ball.y}
      </p>
      <p>
        <b>Ball Direction X</b>: {ball.direction.x}
      </p>
      <p>
        <b>Ball Direction Y</b>: {ball.direction.y}
      </p>
    </div>
  );
};

export default DebugPannel;
