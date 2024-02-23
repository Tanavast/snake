import React, { useEffect, useState } from 'react';

import './assets/scss/style.scss';
import Button from './components/Button';
import GameBoard from './components/GameBoard';

function App() {
  const [gameStatus, setGameStatus] = useState(false);
  const [isFirstStart, setFirstStart] = useState(true)

  const handleStart = (gameStatus) => {
    isFirstStart ? setFirstStart(false) : setFirstStart(false);
    console.log(isFirstStart)
    gameStatus ? setGameStatus(false) : setGameStatus(true)
  }

  useEffect(() => {
    console.log(gameStatus, isFirstStart)
  }, [gameStatus, isFirstStart])

  return (
    <div className="App">
      <div className="main">
        <GameBoard setGameStatus={setGameStatus} gameStatus={gameStatus} isFirstStart={isFirstStart} />
        <Button handleStart={handleStart} gameStatus={gameStatus} />
      </div>
    </div>
  );
}

export default App;
