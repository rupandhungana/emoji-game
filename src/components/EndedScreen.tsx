import React from "react";

interface EndedScreenProps {
  ball: Ball;
  handlePlayAgain: () => void;
  score: number;
}

const EndedScreen: React.FC<EndedScreenProps> = ({
  ball,
  handlePlayAgain,
  score,
}) => {
  return (
    <div
      style={{
        inset: 0,
        position: "absolute",
        backgroundColor: `rgb(
        ${ball.colors[0][0] + 40},
        ${ball.colors[0][1] + 40},
        ${ball.colors[0][2] + 40}
        )`,
        animation: "gameOverAnimation 0.5s ease-in-out forwards",
      }}
    >
      <style>
        {`@keyframes gameOverAnimation {
0% {
transform: scale(0);
opacity: 0;
}

100% {
transform: scale(1);
opacity: 1;
}
}`}
      </style>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
        }}
      >
        {Array(100)
          .fill(null)
          .map((_, i) => {
            const spacing = 1; // Adjust this value as needed to control the spacing between raindrops
            const fallDistance = Math.random() * 350 + 5;
            const rotation = Math.random() * 360; // Random rotation angle
            return (
              <div
                className="rain-ball"
                style={{
                  position: "absolute",
                  top: spacing * i, // Adjust the spacing
                  left: `${Math.random() * 350 + (spacing * i) / 100}px`,
                  animationDelay: `${Math.random() * 200}ms`,
                  transform: `rotate(${rotation}deg)`,
                  fontSize: "42px",
                  animation: `fallAnimation ease-in-out 2s forwards`,
                  animationTimingFunction: "cubic-bezier(0.42, 0, 0.80, 1)",
                  animationIterationCount: "1",
                  animationFillMode: "forwards",
                  animationDirection: "normal",
                  animationPlayState: "running",
                  animationName: `fallAnimation${i}`,
                }}
                key={`${ball.emoji}_${i}`}
              >
                {ball.emoji}
                <style>
                  {`
       @keyframes fallAnimation${i} {
        0% {
          transform: translateY(-50px) rotate(${rotation * 4}deg);;
        }
        100% {
          transform: translateY(${fallDistance}px) rotate(${rotation}deg);
        }
      }
        `}
                </style>
              </div>
            );
          })}

        <div
          style={{
            position: "relative",
            top: 200,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <h1 style={{ fontSize: "64px" }}>{score}</h1>
          <button className="btn" onClick={handlePlayAgain}>
            Play again
          </button>
        </div>
      </div>
    </div>
  );
};

export default EndedScreen;
