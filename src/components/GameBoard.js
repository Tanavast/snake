import React, { useRef, useEffect, useState } from 'react';

const GameBoard = () => {
    const canvasRef = useRef(null);

    const initialState = [{ x: 19, y: 10 }, { x: 20, y: 10 }, { x: 21, y: 10 }];
    const [snakeState, setSnakeState] = useState(initialState);
    const [intervalId, setIntervalId] = useState(null);
    const [direction, setDirection] = useState("right");
    const [gameStatus, setGameStatus] = useState(true);
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

    const handleKeyPress = (event) => {
        switch (event.code) {
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

    // Function for move snake
    const moveSnake = (snake, direction) => {
        const currentSnake = snake;
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
        wallCells.forEach(cell => {
            if (head.x === cell.x && head.y === cell.y) {
                setGameStatus(false)
                return alert('Game over!')
            }
        })
        currentSnake.unshift(head)
        head.x !== foodState?.x || head.y !== foodState?.y ? currentSnake.pop() : setFoodState(null)
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

    // Function to draw snake       
    const drawSnake = (snake, ctx) => {
        ctx.fillStyle = "#72C26F"
        ctx.fillRect(snake.x * 20, snake.y * 20, cellSize, cellSize);
    }

    const getRandomInt = (max) => {
        return Math.floor(Math.random() * max)
    }

    // Generate food in random free cell
    const generateCoordForFood = (gameBoard, snake) => {
        let x = getRandomInt(39);
        let y = getRandomInt(19);
        wallCells.forEach(cell => {
            if (x === cell.x && y === cell.y) {
                return generateCoordForFood(gameBoard, snake)
            }
        })
        snakeState.forEach(cell => {
            if (x === cell.x && y === cell.y) {
                return generateCoordForFood(gameBoard, snake)
            }
        })
        let food = { x, y };
        console.log(food)
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
        // moveSnake(snake, direction);
        snake.map(item => {
            return drawSnake(item, ctx)
        })

        foodState ? generateFood(foodState, ctx) : generateFood(generateCoordForFood(gameBoard, snake), ctx)

        window.addEventListener('keydown', handleKeyPress);

        // Transform snake
        const interval = setInterval(() => {
            if (!gameStatus) {
                clearInterval(interval);
            }
            drawGrid(ctx)
            moveSnake(snake, direction);
            snake.map(item => {
                return drawSnake(item, ctx)
            })
            foodState ? generateFood(foodState, ctx) : generateFood(generateCoordForFood(gameBoard, snake), ctx)

        }, 300);

        setIntervalId(interval);

        return () => {
            clearInterval(interval);
            window.removeEventListener('keydown', handleKeyPress);
        }
    }, [gameStatus, direction, foodState]);

    return <canvas ref={canvasRef} className='gameBoard' />;
};

export default GameBoard;