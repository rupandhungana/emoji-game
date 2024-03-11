import EmojiPicker from "emoji-picker-react";
import { useEffect, useRef, useState } from "react";
// import FPSCounter from "@sethwebster/react-fps-counter";
import { prominent } from "color.js";

const GameCanvas = () => {
  const [selectEmoji, setSelectEmoji] = useState<boolean>(false);
  const [debugPannel, setDebugPannel] = useState<boolean>(false);
  const [infoPannel, setInfoPannel] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameStatus, setGameStatus] = useState<"Playing" | "Ended" | "Loading">(
    "Loading"
  );
  //to debug f600
  const [score, setScore] = useState<number>(0);
  const [controller, setController] = useState<Controller>({
    x: 75,
    y: 600,
    width: 150,
    height: 15,
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
    size: 30,
    x: 400 / 2,
    y: 650 / 2,
    velocity: 2,
    rotationAngle: 0,
    startTime: Date.now(),
    direction: {
      x: Math.cos(Math.random() * 8 * Math.PI + 2),
      y: Math.sin(Math.random() * 8 * Math.PI + 3),
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
        /*   window.addEventListener("keydown", handleKeyPress);
        window.addEventListener("touchmove", handleTouchMove); */
      }
    };

    const drawEmojiBall = () => {
      /*  ctx.font = `${ball.size}px serif`;
      ctx.save(); // Save the current state of the canvas
      ctx.translate(ball.x, ball.y); // Translate to the position of the emoji
      ctx.rotate(ball.rotationAngle * Math.PI / 180); // Rotate by the rotation angle (in radians)
      ctx.fillText(ball.emoji, -ball.radius, ball.radius / 2); // Draw the emoji
      ctx.restore(); // Restore the saved state to prevent affecting other drawings */

      ctx.font = `${ball.radius * 3}px serif`;
      /*  ctx.filter = `rotate(80deg)`;
      ctx.fillText(ball.emoji, ball.x - ball.radius, ball.y + ball.radius / 2); */

      ctx.save(); // Save the current state of the canvas
      ctx.translate(ball.x, ball.y); // Translate to the center of the ball
      ctx.rotate((ball.rotationAngle * Math.PI) / 180); // Rotate by the rotation angle (in radians)

      // Calculate the width and height of the rotated text
      const textWidth = ctx.measureText(ball.emoji).width;
      const textHeight = ball.radius * 3;

      // Draw the text at an offset to keep it centered
      ctx.fillText(ball.emoji, -textWidth / 2, textHeight / 4);

      ctx.restore();
    };
    const updateEmojiBall = () => {
      setBall((pre) => ({
        ...pre,
        x: (pre.x += ball.direction.x * pre.velocity),
        y: (pre.y += ball.direction.y * pre.velocity),
        velocity: pre.velocity + 0.0002,
        rotationAngle: pre.rotationAngle + 1,
      }));
    };
    const bounceBall = () => {
      // right
      if (ball.x + ball.radius * 3 >= canvas.width) {
        let newx = (ball.direction.x *= -1);
        setBall((pre) => ({
          ...pre,
          direction: {
            ...pre.direction,
            x: newx,
          },
        }));
      }
      // left side
      if (canvas.width - ball.x + ball.radius >= canvas.width) {
        let newx = (ball.direction.x *= -1);
        setBall((pre) => ({
          ...pre,
          direction: {
            ...pre.direction,
            x: newx,
          },
        }));
      }
      // top side
      if (canvas.height - ball.y + ball.radius * 3 >= canvas.height) {
        let newy = (ball.direction.y *= -1);
        setBall((pre) => ({
          ...pre,
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
      ctx.fillStyle = "black";
      ctx.fillRect(
        controller.x,
        controller.y,
        controller.width,
        controller.height
      );
    };
    const gameOver = () => {
      if (ball.y >= canvas.height - ball.radius) {
        setGameStatus("Ended");
      }
    };
    const controllerBounce = () => {
      if (
        ball.x + ball.radius >= controller.x &&
        ball.x - ball.radius <= controller.x + controller.width &&
        ball.y + ball.radius >= controller.y &&
        ball.y - ball.radius <= controller.y + controller.height
      ) {
        // Check if the ball hits the top or bottom side of the controller
        if (
          ball.y >= controller.y &&
          ball.y <= controller.y + controller.height - ball.radius
        ) {
          // If the ball hits the top or bottom side of the controller
          setScore((pre) => pre + 1);
          // alert("++");
          // let newX = (ball.direction.x *= Math.random() - 2);
          let newY = (ball.direction.y *= -1);
          let newV = ball.velocity + 0.1;
          setBall((prevBall) => ({
            ...prevBall,
            velocity: newV,
            direction: { ...prevBall.direction, y: newY },
          }));
        } else {
          // If the ball hits the left or right side of the controller
          if (
            ball.x <= controller.x ||
            ball.x >= controller.x + controller.width
          ) {
            // If the ball hits the left or right side of the controller
            let newX = (ball.direction.x *= -1);
            setBall((prevBall) => ({
              ...prevBall,
              direction: { ...prevBall.direction, x: newX },
            }));
          }
        }
      }
    };

    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameStatus != "Playing") return;
      switch (e.key) {
        case "a": {
          if (controller.x <= 0) return;
          setController((prevController) => ({
            ...prevController,
            x: Math.max(prevController.x - 10, 0),
          }));
          break;
        }
        case "d": {
          if (controller.x >= canvas.width - controller.width) return;
          setController((prevController) => ({
            ...prevController,
            x: Math.min(
              prevController.x + 10,
              canvas.width - prevController.width
            ),
          }));
          break;
        }
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
    const intervalId = setInterval(draw, 5);

    window.addEventListener("keydown", handleKeyPress);
    window.addEventListener("touchmove", handleTouchMove);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("keydown", handleKeyPress);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [score, ball, controller, gameStatus, canvasRef]);

  const handlePlayAgain = () => {
    setGameStatus("Playing");
    setScore(0);
    setBall({
      ...ball,
      x: 150,
      y: 300,
      velocity: 2,
      direction: {
        x: Math.cos(Math.random() * 8 * Math.PI + 2),
        y: Math.sin(Math.random() * 8 * Math.PI + 3),
      },
      startTime: Date.now(),
    });
  };

  return (
    <>
      <div style={{ position: "relative" }}>
        {gameStatus === "Ended" && (
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
              {Array(20)
                .fill(null)
                .map((_, i) => {
                  const fallDistance = Math.random() * 450 + 10;
                  return (
                    <div
                      className="rain-ball"
                      style={{
                        position: "absolute",
                        top: 20,
                        left: `${Math.random() * 250}px`,
                        animationDelay: `${Math.random() * 250}ms`,
                        fontSize: "32px",
                        animation: `fallAnimation ease-in-out 2s forwards`,
                        animationTimingFunction:
                          "cubic-bezier(0.42, 0, 0.80, 1)", // Optional: ease-in-out timing function
                        animationIterationCount: "1", // Optional: Only play the animation once
                        animationFillMode: "forwards", // Optional: Keep the element in its final state after the animation finishes
                        animationDirection: "normal", // Optional: Play the animation forward
                        animationPlayState: "running", // Optional: Start the animation
                        animationName: `fallAnimation${i}`, // Use a unique animation name for each ball
                      }}
                      key={`${ball.emoji}_${i}`}
                    >
                      {ball.emoji}
                      <style>
                        {`
                  @keyframes fallAnimation${i} {
                    0% {
                      transform: translateY(-50px);
                    }
                    100% {
                      transform: translateY(${fallDistance}px);
                    }
                  }
                `}
                      </style>
                    </div>
                  );
                })}
              <h1>{score}</h1>
              <button className="btn" onClick={handlePlayAgain}>
                Play again
              </button>
            </div>
          </div>
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
        {infoPannel && (
          <div
            style={{
              position: "absolute",
              top: 50,
              right: -100,
              backgroundColor: "#fafafa",
              color: "#000",
              width: 300,
              padding: 4,
              fontSize: 16,
            }}
          >
            <p>
              Developer: <b>Rupan Dhungana</b>
            </p>
            <p>
              Github:{" "}
              <a
                href="https://github.com/rupandhungana/emoji-game"
                target="_blank"
                style={{
                  fontSize: 12
                }}
              >
                https://github.com/rupandhungana/emoji-game
              </a>
            </p>
            <p>
              Language: <b>React + TypeScript</b>
            </p>
            <p>
              Info: <b>has bugs and more..</b>
            </p>
          </div>
        )}
        {debugPannel && (
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
              console.log(emoji);
              prominent(emoji.imageUrl, { amount: 5 }).then((color) => {
                if (gameStatus === "Ended") handlePlayAgain();
                setBall({
                  ...ball,
                  emoji: emoji.emoji,
                  colors: color.slice(1) as number[][],
                });
              });
            }}
          />
        )}
      </div>
    </>
  );
};

export default GameCanvas;
