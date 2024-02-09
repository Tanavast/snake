import React from 'react'

export default function Button({ handleStart, gameStatus }) {
    return (
        <button onClick={() => handleStart(gameStatus)} className='btn'>{gameStatus ? "Pause" : "Start game"}</button>
    )
}
