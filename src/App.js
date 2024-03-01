import React, { useEffect, useState } from 'react';

import './assets/scss/style.scss';
import Button from './components/Button';
import GameBoard from './components/GameBoard';
import Modal from './components/Modal';

function App() {
  const [gameStatus, setGameStatus] = useState(false);
  const [isFirstStart, setFirstStart] = useState(true);
  const [gameOver, setGameOver] = useState(false);


  const handleStart = (gameStatus) => {
    isFirstStart ? setFirstStart(false) : setFirstStart(false);
    console.log(isFirstStart)
    gameStatus ? setGameStatus(false) : setGameStatus(true)
  }

  const handleNewGame = (gameOver) => {
    console.log(gameOver)
    gameOver ? setGameOver(false) : setGameOver(true)
  }

  useEffect(() => {
    console.log(gameStatus, isFirstStart, gameOver)
  }, [gameStatus, isFirstStart, gameOver])

  return (
    <div className="App" >
      <div className="main">
        <GameBoard
          setGameStatus={setGameStatus}
          gameStatus={gameStatus}
          isFirstStart={isFirstStart}
          gameOver={gameOver}
          setGameOver={setGameOver}
          setFirstStart={setFirstStart}
        />
        <Modal handleNewGame={handleNewGame} gameOver={gameOver} />
        <Button handleStart={handleStart} gameStatus={gameStatus} />
      </div>
    </div>
  );
}

export default App;
