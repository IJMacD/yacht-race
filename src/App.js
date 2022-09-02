import React, { useEffect, useState } from 'react';
import './App.css';
import { COMPASS, getPossibleMoves, isLocationIncluded, startSquares } from './game';
import { GameBoard } from './GameBoard';

function App() {
  const [ windDirection, setWindDirection ] = useState(COMPASS.NW);
  const [ boats, setBoats ] = useState(() => makeBoats(2));
  const [ move, setMove ] = useState(0);

  const player = move % boats.length;

  const possibleMoves = getPossibleMoves(boats[player], boats, windDirection);

  function handleClick (i, j) {
    if (isLocationIncluded(possibleMoves, i, j)) {
      setBoats(boats => boats.map((b,idx) => idx === player ? { ...b, location: [i,j] } : b));
      setMove(move => move + 1);
    }
  }

  return (
    <div className="App">
      <p>Next Move: Player {player + 1}</p>
      <GameBoard boats={boats} windDirection={windDirection} highlight={possibleMoves} onClick={handleClick} />
    </div>
  );
}

export default App;

function makeBoats (players) {
  const boats = [];

  for (let i = 0; i < players; i++) {
    boats.push({ colour: BOAT_COLOURS[i], location: startSquares[i].location });
  }

  return boats;
}

const BOAT_COLOURS = [
  "#F00",
  "#0F0",
  "#00F",
  "#F80",
  "#FF0",
  "#08F",
  "#F0F",
];