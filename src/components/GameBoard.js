import React, { useRef, useEffect, useState } from 'react';

const GameBoard = ({ gameStatus, setGameStatus, isFirstStart }) => {
    const canvasRef = useRef(null);

    const initialState = [{ x: 19, y: 10 }, { x: 20, y: 10 }, { x: 21, y: 10 }];
    const [snakeState, setSnakeState] = useState(initialState);
    const [intervalId, setIntervalId] = useState(null);
    const [directionQueue, setDirectionyQueue] = useState([]);
    const [direction, setDirection] = useState("left");
    const [foodState, setFoodState] = useState(null)

    const cellSize = 20;
    const numRows = 20;
    const numCols = 40;

    const gameBoard = [];
    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
            let isWall = false;
            if (row === 0 || row === 19 || col === 0 || col === 39) {
                isWall = true
            }
            gameBoard.push({ x: col, y: row, isWall });
        }
    }
    const wallCells = gameBoard.filter(cell => cell.isWall);


    const addKeyToQueue = (event) => {
        setDirectionyQueue((queue) => [...queue, event.code]);
    }

    const handleKeyPress = (directionQueue) => {
        let queue = [...directionQueue]
        while (queue.length > 0) {
            const code = queue.pop();
            switch (code) {
                case 'ArrowUp':
                    direction !== "bottom" ? setDirection("top") : console.log('Wrong direction')
                    break;
                case 'ArrowDown':
                    direction !== "top" ? setDirection("bottom") : console.log('Wrong direction')
                    break;
                case 'ArrowLeft':
                    direction !== "right" ? setDirection("left") : console.log('Wrong direction')
                    break;
                case 'ArrowRight':
                    direction !== "left" ? setDirection("right") : console.log('Wrong direction')
                    break;
                default:
                    break;
            }
        }
        setDirectionyQueue(queue)
    }

    // Function for move snake
    const moveSnake = (snake, direction) => {
        const currentSnake = [...snake];
        let head = { ...currentSnake[0] };
        switch (direction) {
            case "right":
                head.x++
                break;
            case "left":
                head.x--
                break;
            case "top":
                head.y--
                break;
            case "bottom":
                head.y++
                break;
            default:
                break;
        }
        for (let i = 0; i < wallCells.length; i++) {
            if (head.x === wallCells[i].x && head.y === wallCells[i].y) {
                return setGameStatus(false)
            }
        }
        let snakeBody = [...currentSnake]
        snakeBody.shift()
        for (let j = 0; j < snakeBody.length; j++) {
            if (head.x === snakeBody[j].x && head.y === snakeBody[j].y) {
                return setGameStatus(false)
            }
        }
        currentSnake.unshift(head)
        head.x !== foodState?.x || head.y !== foodState?.y ? currentSnake.pop() : setFoodState(null);
        setSnakeState(currentSnake)
    }

    // Function to draw grid lines
    const drawGrid = (ctx) => {
        gameBoard.forEach(cell => {
            ctx.beginPath();
            ctx.rect(cell.x * cellSize, cell.y * cellSize, cellSize, cellSize);
            ctx.fillStyle = cell.isWall ? 'gray' : '#245C4F';
            ctx.fill();
            ctx.stroke();
        });
    };

    const drawHead = (snake, ctx, direction) => {
        ctx.fillRect(snake.x * 20, snake.y * 20, cellSize, cellSize);
        ctx.fillStyle = "#000";
        switch (direction) {
            case "left":
                ctx.fillRect((snake.x + 0.2) * 20, (snake.y + 0.14) * 20, cellSize - 17, cellSize - 17);
                ctx.fillRect((snake.x + 0.2) * 20, (snake.y + 0.7) * 20, cellSize - 17, cellSize - 17);
                break;
            case "right":
                ctx.fillRect((snake.x + 0.65) * 20, (snake.y + 0.14) * 20, cellSize - 17, cellSize - 17);
                ctx.fillRect((snake.x + 0.65) * 20, (snake.y + 0.7) * 20, cellSize - 17, cellSize - 17);
                break;
            case "top":
                ctx.fillRect((snake.x + 0.2) * 20, (snake.y + 0.14) * 20, cellSize - 17, cellSize - 17);
                ctx.fillRect((snake.x + 0.65) * 20, (snake.y + 0.14) * 20, cellSize - 17, cellSize - 17);
                break;
            case "bottom":
                ctx.fillRect((snake.x + 0.65) * 20, (snake.y + 0.7) * 20, cellSize - 17, cellSize - 17);
                ctx.fillRect((snake.x + 0.2) * 20, (snake.y + 0.7) * 20, cellSize - 17, cellSize - 17);
                break;
            default:
                break;
        }
    }

    const getTailDirection = (bodyCoords, tailCoords) => {
        if (tailCoords.x > bodyCoords.x) {
            return 'right';
        }
        if (tailCoords.x < bodyCoords.x) {
            return 'left';
        }
        if (tailCoords.y > bodyCoords.y) {
            return 'bottom';
        }
        if (tailCoords.y < bodyCoords.y) {
            return 'top';
        }
    }

    const drawTail = (snake, ctx) => {
        ctx.fillRect(snake.x * 20, snake.y * 20, cellSize, cellSize);
        ctx.fillStyle = "#000"

        let nextDirection = getTailDirection(snake, snakeState[snakeState.length - 2])
        switch (nextDirection) {
            case "left":
                ctx.fillRect((snake.x + 0.2) * 20, (snake.y + 0.45) * 20, cellSize, cellSize - 18);
                break;
            case "right":
                ctx.fillRect((snake.x - 0.2) * 20, (snake.y + 0.45) * 20, cellSize, cellSize - 18);
                break;
            case "top":
                ctx.fillRect((snake.x + 0.45) * 20, (snake.y + 0.2) * 20, cellSize - 18, cellSize);
                break;
            case "bottom":
                ctx.fillRect((snake.x + 0.45) * 20, (snake.y - 0.2) * 20, cellSize - 18, cellSize);
                break;
            default:
                break;
        }
    }

    // Function to draw snake       
    const drawSnake = (snake, ctx, bodyPart) => {
        ctx.fillStyle = "#72C26F"
        if (!bodyPart) {
            return ctx.fillRect(snake.x * 20, snake.y * 20, cellSize, cellSize);
        }
        if (bodyPart === "head") {
            drawHead(snake, ctx, direction)
            return
        }
        if (bodyPart === "tail") {
            drawTail(snake, ctx)
            return
        }
    }

    const getRandomInt = (max) => {
        return Math.floor(Math.random() * max)
    }

    // Generate food in random free cell
    const generateCoordForFood = (gameBoard, snake) => {
        let x = getRandomInt(39);
        let y = getRandomInt(19);

        for (let i = 0; i < wallCells.length; i++) {
            if (x === wallCells[i].x && y === wallCells[i].y) {
                return generateCoordForFood(gameBoard, snake);
            }
        }

        for (let i = 0; i < snakeState.length; i++) {
            if (x === snakeState[i].x && y === snakeState[i].y) {
                return generateCoordForFood(gameBoard, snake);
            }
        }
        let food = { x, y };
        setFoodState(food)
        return food
    }

    const generateFood = (food, ctx) => {
        ctx.fillStyle = "#FFFCE9"
        ctx.fillRect(food.x * 20, food.y * 20, cellSize, cellSize);
    }

    useEffect(() => {
        const snake = snakeState;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Set canvas size
        canvas.width = cellSize * numCols;
        canvas.height = cellSize * numRows;
        drawGrid(ctx)

        window.addEventListener('keydown', addKeyToQueue);


        if (gameStatus) {
            snake.map((item, i) => {
                if (i === 0) {
                    return drawSnake(item, ctx, "head")
                }
                if (i === snake.length - 1) {
                    return drawSnake(item, ctx, "tail")
                }
                return drawSnake(item, ctx)
            })

            foodState ? generateFood(foodState, ctx) : generateFood(generateCoordForFood(gameBoard, snake), ctx)

            const interval = setInterval(() => {
                moveSnake(snake, direction);
            }, 300);
            handleKeyPress(directionQueue)

            setIntervalId(interval);

            return () => {
                clearInterval(interval);
                window.removeEventListener('keydown', addKeyToQueue);
            }

        } else if (isFirstStart) {
            ctx.font = "30px Arial";
            ctx.textAlign = "center"
            ctx.fillStyle = "#fff";
            ctx.fillText('Please press "Start"', 400, 200);
        } else {
            ctx.font = "30px Arial";
            ctx.textAlign = "center"
            ctx.fillStyle = "#fff";
            ctx.fillText("Game paused", 400, 200);
        }


    }, [snakeState, direction, gameStatus]);

    return <canvas ref={canvasRef} className='gameBoard' />;
};

export default GameBoard;