/* eslint-disable react/prop-types */ // Disables prop-types linting for this file

import { useState } from "react";

// Square component representing a single square on the board
function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

// Board component representing the game board
function Board({ xIsNext, squares, onPlay }) {
  // Function to handle click on a square
  function handleClick(i) {
    // Check if the square is already filled or if there's a winner
    if (squares[i] || calculateWinner(squares)) return;

    const nextSquares = squares.slice(); // Create a copy of squares array

    // Assign 'X' or 'O' based on the current player
    nextSquares[i] = xIsNext ? "X" : "O";

    // Call the onPlay function with the updated squares
    onPlay(nextSquares);
  }

  // Calculate the winner based on the current squares configuration
  const winner = calculateWinner(squares);
  let status = "";
  if (winner) {
    status = "Winner: " + winner; // Set the status if there's a winner
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O"); // Set the status for the next player
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board">
        {/* Render the squares with their respective values and click handlers */}
        {squares.map((value, index) => (
          <Square key={index} value={value} onSquareClick={() => handleClick(index)} />
        ))}
      </div>
    </>
  );
}

// Game component managing the game state
export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]); // Store the history of moves
  const [currentMove, setCurrentMove] = useState(0); // Track the current move index
  const xIsNext = currentMove % 2 === 0; // Determine if 'X' is the next player
  const currentSquares = history[currentMove]; // Get the current squares configuration

  // Function to jump to a specific move in history
  function jumpTo(nextMove) {
    setCurrentMove(nextMove); // Set the current move to the selected move
  }

  // Function to handle a play and update history
  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares]; // Create a new history
    setHistory(nextHistory); // Update the history with the new move
    setCurrentMove(nextHistory.length - 1); // Set the current move to the latest move
  }

  // Generate a list of moves with buttons to jump to each move
  const moves = history.map((squares, move) => {
    let description = "";
    if (move > 0) {
      description = "Go to move #" + move;
    } else {
      description = "Go to game start";
    }

    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        {/* Render the game board with current data */}
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol> {/* Render the list of moves */}
      </div>
    </div>
  );
}

// Function to calculate the winner based on the squares configuration
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
  ];

  // Iterate through all winning line possibilities and check for a winner
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];

    // Check if squares[a] is filled and all three squares in a line are equal
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]; // Return the winner ('X' or 'O')
    }
  }

  return false; // Return false if there's no winner
}
