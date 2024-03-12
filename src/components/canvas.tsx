import EmojiPicker from "emoji-picker-react";
import { useEffect, useRef, useState } from "react";
// import FPSCounter from "@sethwebster/react-fps-counter";
import { prominent } from "color.js";
import DebugPannel from "./DebugPannel";
import InfoPannel from "./InfoPannel";
import EndedScreen from "./EndedScreen";

const GameCanvas = () => {
  const [selectEmoji, setSelectEmoji] = useState<boolean>(false);
  const [debugPannel, setDebugPannel] = useState<boolean>(false);
  const [infoPannel, setInfoPannel] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameStatus, setGameStatus] = useState<"Playing" | "Ended" | "Loading">(
    "Ended"
  );
  //to debug f600
  const [score, setScore] = useState<number>(0);
  const [controller, setController] = useState<Controller>({
    x: 75,
    y: 600,
    width: 100,
    height: 30,
  });
  const [ball, setBall] = useState<Ball>({
    emoji: "😀",
    colors: [
      [240, 160, 20],
      [160, 100, 0],
      [255, 220, 40],
      [255, 220, 60],
    ],
    radius: 10,
    speed: 2,
    size: 40,
    x: 400 / 2,
    y: 650 / 2,
    velocity: 1,
    rotationAngle: 0,
    startTime: Date.now(),
    direction: {
      x: Math.cos(((Math.random() * 20 + 60) * Math.PI) / 180), // Angle between 60 and 80 degrees (more towards the right)
      y: -Math.sin(((Math.random() * 10 + 80) * Math.PI) / 180), // Angle between 80 and 90 degrees (moving upward)
    },
  });

  useEffect(() => {
    if (gameStatus !== "Ended") setGameStatus("Playing");
    // console.log(ball);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const draw = () => {
      // ctx.fillStyle = canvasBgColor;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (score < 5) {
        ctx.fillStyle = `rgb(
          ${ball.colors[3][0]},
          ${ball.colors[3][1]},
          ${ball.colors[3][2]}
          )`;
      } else if (score < 10) {
        ctx.fillStyle = `rgb(
          ${ball.colors[1][0]},
          ${ball.colors[1][1]},
          ${ball.colors[1][2]}
          )`;
      } else {
        ctx.fillStyle = `rgb(
          ${ball.colors[0][0]},
          ${ball.colors[0][1]},
          ${ball.colors[0][2]}
          )`;
      }
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (gameStatus != "Ended") {
        drawPoints();
        drawEmojiBall();
        drawController();
        updateEmojiBall();
        bounceBall();
        controllerBounce();
        gameOver();
      }
    };

    const drawEmojiBall = () => {
      /*  ctx.font = `${ball.size}px serif`;
      ctx.save(); // Save the current state of the canvas
      ctx.translate(ball.x, ball.y); // Translate to the position of the emoji
      ctx.rotate(ball.rotationAngle * Math.PI / 180); // Rotate by the rotation angle (in radians)
      ctx.fillText(ball.emoji, -ball.radius, ball.radius / 2); // Draw the emoji
      ctx.restore(); // Restore the saved state to prevent affecting other drawings */

      ctx.font = `${ball.size}px serif`;
      /*  ctx.filter = `rotate(80deg)`;
      ctx.fillText(ball.emoji, ball.x - ball.radius, ball.y + ball.radius / 2); */

      ctx.save(); // Save the current state of the canvas
      ctx.translate(ball.x, ball.y); // Translate to the center of the ball
      ctx.rotate((ball.rotationAngle * Math.PI) / 180); // Rotate by the rotation angle (in radians)

      // Calculate the width and height of the rotated text
      const textWidth = ctx.measureText(ball.emoji).width;
      const textHeight = ball.size;

      // Draw the text at an offset to keep it centered
      ctx.fillText(ball.emoji, -textWidth / 2, textHeight / 4);

      ctx.restore();
    };
    const updateEmojiBall = () => {
      setBall((pre) => ({
        ...pre,
        x: (pre.x += pre.direction.x * pre.velocity * pre.speed),
        y: (pre.y += pre.direction.y * pre.velocity * pre.speed),
        velocity: pre.velocity + 0.0001,
        speed: pre.speed + 0.0001,
        rotationAngle: pre.rotationAngle + 1,
      }));
    };
    const bounceBall = () => {
      // right
      if (ball.x + ball.radius >= canvas.width) {
        const newx = (ball.direction.x *= -1);
        setBall((pre) => ({
          ...pre,
          speed: pre.speed + 0.001,
          direction: {
            ...pre.direction,
            x: newx,
          },
        }));
      }
      // left side
      if (canvas.width - ball.x + ball.radius >= canvas.width) {
        const newx = (ball.direction.x *= -1);
        setBall((pre) => ({
          ...pre,
          speed: pre.speed + 0.001,
          direction: {
            ...pre.direction,
            x: newx,
          },
        }));
      }
      // top side
      if (canvas.height - ball.y + ball.radius >= canvas.height) {
        const newy = (ball.direction.y *= -1);
        setBall((pre) => ({
          ...pre,
          speed: pre.speed + 0.001,
          direction: {
            ...pre.direction,
            y: newy,
          },
        }));
      }
    };
    const drawPoints = () => {
      ctx.fillStyle = "black";
      ctx.font = "90px Arial";
      const text = `${score}`;
      const textMetrics = ctx.measureText(text);
      const textWidth = textMetrics.width;
      const textHeight =
        textMetrics.actualBoundingBoxAscent +
        textMetrics.actualBoundingBoxDescent;
      ctx.fillText(text, centerX - textWidth / 2, centerY + textHeight / 2);
    };
    const drawController = () => {
      const cornerRadius = controller.height / 2; // Adjust the corner radius as needed
      ctx.fillStyle = "black";
      ctx.beginPath();
      // Top left corner
      ctx.arc(
        controller.x + cornerRadius,
        controller.y + cornerRadius,
        cornerRadius,
        Math.PI,
        Math.PI * 1.5
      );
      // Top edge
      ctx.lineTo(controller.x + controller.width - cornerRadius, controller.y);
      // Top right corner
      ctx.arc(
        controller.x + controller.width - cornerRadius,
        controller.y + cornerRadius,
        cornerRadius,
        Math.PI * 1.5,
        Math.PI * 2
      );
      // Right edge
      ctx.lineTo(
        controller.x + controller.width,
        controller.y + controller.height - cornerRadius
      );
      // Bottom right corner
      ctx.arc(
        controller.x + controller.width - cornerRadius,
        controller.y + controller.height - cornerRadius,
        cornerRadius,
        0,
        Math.PI * 0.5
      );
      // Bottom edge
      ctx.lineTo(controller.x + cornerRadius, controller.y + controller.height);
      // Bottom left corner
      ctx.arc(
        controller.x + cornerRadius,
        controller.y + controller.height - cornerRadius,
        cornerRadius,
        Math.PI * 0.5,
        Math.PI
      );
      // Left edge
      ctx.lineTo(controller.x, controller.y + cornerRadius);
      ctx.closePath();
      ctx.fill();
    };

    const gameOver = () => {
      if (ball.y >= canvas.height - ball.size - ball.radius + ball.radius / 2) {
        setGameStatus("Ended");
      }
    };
    const controllerBounce = () => {
      if (
        ball.x + (ball.size - ball.radius) >= controller.x &&
        ball.x - (ball.size - ball.radius) <= controller.x + controller.width &&
        ball.y + (ball.size - ball.radius) >= controller.y &&
        ball.y - (ball.size - ball.radius) <= controller.y + controller.height
      ) {
        if (ball.y - (ball.size + ball.radius) <= controller.y) {
          setScore((prevScore) => prevScore + 1);
          const newX = ball.direction.x * 1; // Reverse the x direction
          const newY = ball.direction.y * -1; // Reverse the y direction
          const newV = ball.velocity + 0.01;
          const newS = ball.speed + 0.05;
          setBall((prevBall) => ({
            ...prevBall,
            velocity: newV,
            speed: newS,
            direction: { x: newX, y: newY },
          }));
        } else if (
          ball.y + (ball.size - ball.radius) >=
          controller.y + controller.height
        ) {
          setGameStatus("Ended");
        }
      }
    };

    const intervalId = setInterval(draw, 5);

    return () => {
      clearInterval(intervalId);
    };
  }, [ball, controller, gameStatus, canvasRef, score]);

  // controller
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameStatus != "Playing") return;
      switch (e.key) {
        case "a": {
          if (controller.x <= 0) return;
          setController((prevController) => ({
            ...prevController,
            x: Math.max(
              prevController.x -
                25 +
                (ball.speed +
                  ball.velocity +
                  ball.direction.y +
                  ball.direction.x),
              0
            ),
          }));
          break;
        }
        case "d": {
          if (controller.x >= canvas.width - controller.width) return;
          setController((prevController) => ({
            ...prevController,
            x: Math.min(
              prevController.x +
                25 +
                ball.speed *
                  ball.velocity *
                  ball.direction.y *
                  ball.direction.x,
              canvas.width - prevController.width
            ),
          }));
          break;
        }
        default:
          break;
      }
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (gameStatus !== "Playing") return;
      const touchX = e.touches[0].clientX;
      const canvasRect = canvas.getBoundingClientRect();
      const relativeTouchX = touchX - canvasRect.left;
      const newX = relativeTouchX - controller.width / 2;
      if (newX + controller.width >= canvas.width || newX <= 0) return;
      setController((prevController) => ({
        ...prevController,
        x: newX,
      }));
    };

    window.addEventListener("keydown", handleKeyPress);
    window.addEventListener("touchmove", handleTouchMove);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [gameStatus, controller, ball]);

  const handlePlayAgain = () => {
    setGameStatus("Playing");
    setScore(0);
    setBall({
      ...ball,
      x: 150,
      y: 300,
      speed: 2,
      velocity: 1,
      direction: {
        x: Math.cos(((Math.random() * 20 + 60) * Math.PI) / 180), // Angle between 60 and 80 degrees (more towards the right)
        y: -Math.sin(((Math.random() * 10 + 80) * Math.PI) / 180), // Angle between 80 and 90 degrees (moving upward)
      },
      startTime: Date.now(),
      rotationAngle: 0,
    });
  };

  return (
    <>
      <div style={{ position: "relative" }}>
        {gameStatus === "Ended" && (
          <EndedScreen
            score={score}
            ball={ball}
            handlePlayAgain={handlePlayAgain}
          />
        )}
        <canvas ref={canvasRef} width={400} height={650} />
      </div>

      <div style={{ position: "absolute", top: 10 }}>
        <button
          className="btn"
          onClick={() => {
            setSelectEmoji(!selectEmoji);
          }}
        >
          {ball.emoji}
        </button>
        <button
          className="btn"
          style={{
            marginLeft: 4,
          }}
          onClick={() => {
            setDebugPannel(!debugPannel);
          }}
        >
          🪲
        </button>
        <button
          className="btn"
          style={{
            marginLeft: 4,
          }}
          onClick={() => {
            setInfoPannel(!infoPannel);
          }}
        >
          {"ℹ️"}
        </button>
        {infoPannel && <InfoPannel />}
        {debugPannel && (
          <DebugPannel ball={ball} gameStatus={gameStatus} score={score} />
        )}
        {selectEmoji && (
          <EmojiPicker
            style={{
              position: "absolute",
              top: 50,
              right: -150,
            }}
            autoFocusSearch={false}
            onEmojiClick={async (emoji) => {
              prominent(emoji.imageUrl, { amount: 5 }).then((color) => {
                if (gameStatus === "Ended") handlePlayAgain();
                setBall({
                  ...ball,
                  emoji: emoji.emoji,
                  colors: color.slice(1) as number[][],
                });
                setSelectEmoji(false);
              });
            }}
          />
        )}
      </div>
    </>
  );
};

export default GameCanvas;
