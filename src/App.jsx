/* eslint-disable react/prop-types */
import { useState } from 'react'

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  )
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice()
    if (xIsNext) {
      nextSquares[i] = 'X'
    } else {
      nextSquares[i] = 'O'
    }
    onPlay(nextSquares)
  }

  const winner = calculateWinner(squares)
  let status
  if (winner) {
    status = `Winner: ${winner}`
  } else {
    status = `Next Player: ${xIsNext ? 'X' : 'O'}`
  }

  let boardRows = []
  for (let row = 0; row < 3; row++) {
    let cols = []
    for (let col = 0; col < 3; col++) {
      const key = row * 3 + col
      cols[col] = <Square
        key={key}
        value={squares[key]}
        onSquareClick={() => handleClick(key)}
      />
    }
    boardRows[row] = <div key={row} className="board-row">{cols}</div>
  }

  return (
    <>
      <div className="status">{status}</div>
      {boardRows}
    </>
  );
}

function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)])
  const [currentMove, setCurrentMove] = useState(0)
  const [isMoveDesc, setIsMoveDesc] = useState(false)
  const xIsNext = currentMove % 2 === 0
  const currentSquares = history[currentMove]

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares]
    setHistory(nextHistory)
    setCurrentMove(nextHistory.length - 1)
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove)
  }

  function handleMove() {
    setIsMoveDesc(!isMoveDesc)
  }

  const moves = history.map((squares, move) => {
    let description
    if (move > 0) {
      description = `Go to move #${move}`
    } else {
      description = 'Go to game start'
    }
    return (
      <li key={move}>
        { move === history.length - 1 ? (
          <div>You are at move #{ move }</div>
        ) : (
          <button onClick={() => jumpTo(move)}>{description}</button>
        )}
      </li>
    )
  })

  if (isMoveDesc) {
    moves.reverse()
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <label>
          <input type="checkbox" value={isMoveDesc} onClick={handleMove}></input>降順
        </label>
        <ol>{moves}</ol>
      </div>
    </div>
  )
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

export default Game
