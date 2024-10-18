import { useGameState } from './useGameState';

interface UseDrawReturn {
  drawClassicGame: (context: CanvasRenderingContext2D) => void;
  width: number;
  height: number;
}

export function useDraw(
  isSpeedModeMatchEnd: boolean,
  isClassicMatchModeEnd: boolean
): UseDrawReturn {
  const { gameState } = useGameState();

  // dessine ligne poitillee au centre
  const drawNet = (context: CanvasRenderingContext2D) => {
    if (gameState) {
      const netWidth = 10;
      const netHeight = 10;
      const gap = 18;
      const numberOfDashes = gameState.canva.height / (netHeight + gap);

      context.fillStyle = '#ffffff';
      for (let i = 0; i < numberOfDashes; i += 1) {
        context.fillRect(
          gameState.canva.width / 2 - netWidth / 2,
          i * (netHeight + gap),
          netWidth,
          netHeight
        );
      }
    }
  };

  const resetCanvas = (context: CanvasRenderingContext2D) => {
    if (context && gameState) {
      const { width } = gameState.canva;
      const { height } = gameState.canva;
      context.fillStyle = '#2A2957';
      context.beginPath();
      context.strokeStyle = '#ffffff';
      context.roundRect(0, 0, width, height, 30);
      context.lineWidth = 10;
      context.stroke();
      context.fill();
    }
  };

  // dessine le message de fin de partie
  const drawGameOverMessage = (
    context: CanvasRenderingContext2D,
    message: string
  ) => {
    if (gameState) {
      context.fillStyle = '#ffffff';
      context.font = '50px Arial';
      context.textAlign = 'center';
      context.fillText(
        message,
        gameState.canva.width / 2,
        gameState.canva.height / 2
      );
    }
  };

  // dessine la raquette
  const drawPaddle = (
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number
  ) => {
    context.fillStyle = '#ffffff';
    context.beginPath();
    context.roundRect(x, y, width, height, 30);
    context.fill();
  };

  // dessiner la balle
  const drawBall = (
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    radius: number
  ) => {
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fillStyle = '#ffffff';
    context.fill();
    context.closePath();
  };

  // afficher le score
  const drawScore = (context: CanvasRenderingContext2D) => {
    if (gameState) {
      context.fillStyle = '#ffffff';
      context.font = '50px Arial';
      context.fillText(String(gameState.scorePlayer1), 500, 70);
      context.fillText(String(gameState.scorePlayer2), 670, 70);
    }
  };

  const drawClassicGame = (context: CanvasRenderingContext2D) => {
    resetCanvas(context);
    if (gameState && (isClassicMatchModeEnd || isSpeedModeMatchEnd)) {
      if (gameState.scorePlayer1 > gameState.scorePlayer2) {
        drawGameOverMessage(context, 'Player 1 Wins');
      } else {
        drawGameOverMessage(context, 'Player 2 Wins');
      }
    } else if (gameState) {
      drawScore(context);
      drawNet(context);
      drawPaddle(
        context,
        gameState.leftPaddle.x,
        gameState.leftPaddle.y,
        gameState.leftPaddle.width,
        gameState.leftPaddle.height
      );
      drawPaddle(
        context,
        gameState.rightPaddle.x,
        gameState.rightPaddle.y,
        gameState.rightPaddle.width,
        gameState.rightPaddle.height
      );
      drawBall(
        context,
        gameState.ball.x,
        gameState.ball.y,
        gameState.ball.radius
      );
    }
  };

  return {
    drawClassicGame,
    width: gameState ? gameState.canva.width : 1200,
    height: gameState ? gameState.canva.height : 700
  };
}
