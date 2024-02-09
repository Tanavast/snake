import React, { useEffect, useState } from 'react';

import './assets/scss/style.scss';
import Button from './components/Button';
import GameBoard from './components/GameBoard';

function App() {
  const [gameStatus, setGameStatus] = useState(false);
  const handleStart = (gameStatus) => {
    gameStatus ? setGameStatus(false) : setGameStatus(true)
  }

  useEffect(() => {
    console.log(gameStatus)
  }, [gameStatus])

  return (
    <div className="App">
      <div className="main">
        <GameBoard setGameStatus={setGameStatus} gameStatus={gameStatus} />
        <Button handleStart={handleStart} gameStatus={gameStatus} />
      </div>
    </div>
  );
}

export default App;
