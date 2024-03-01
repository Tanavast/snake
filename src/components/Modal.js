import React, { useEffect } from 'react'

export default function Modal({ handleNewGame, gameOver }) {
    let scores = 0
    useEffect(() => {
    }, [gameOver])
    return (
        <div className={gameOver ? 'overlay' : 'hidden'}>
            <div className='modal'>
                <h2>Game over!</h2>
                <p>Your score: <span>{scores}</span></p>
                <button onClick={() => handleNewGame(gameOver)} className='btn'>Continue</button>
            </div>
        </div>
    )
}
