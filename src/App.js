import React, { useReducer, useState } from 'react';
import './App.css';
import { getPossibleMoves } from './game';
import { GameBoard } from './GameBoard';
import { gameReducer, initialGameState, BOAT_COLOURS, PLAY_STATE } from './gameReducer';


function App() {
  const [ { playState, players, currentPlayer, windDirection }, dispatch ] = useReducer(gameReducer, initialGameState);
  const [ showHints, setShowHints ] = useState(true);

  const player = playState === PLAY_STATE.PLAYING ? players[currentPlayer] : null;

  const possibleMoves = player ? getPossibleMoves(player, players, windDirection) : [];

  const windCardCount = player?.windCards;

  const spinnakerCardCount = player?.spinnakerCards;

  return (
    <div className="App">
      {
        playState === PLAY_STATE.PLAYING ?
        <p>Next Move: <span style={{color: BOAT_COLOURS[currentPlayer]}}>Player {currentPlayer + 1}</span></p>
        :
        (
          playState === PLAY_STATE.READY ?
          <p>Select number of players:{' '}
            <button onClick={() => dispatch({type: "setPlayers", players: 2})}>2 Players</button>
            <button onClick={() => dispatch({type: "setPlayers", players: 3})}>3 Players</button>
            <button onClick={() => dispatch({type: "setPlayers", players: 4})}>4 Players</button>
            <button onClick={() => dispatch({type: "setPlayers", players: 5})}>5 Players</button>
            <button onClick={() => dispatch({type: "setPlayers", players: 6})}>6 Players</button>
          </p>
          :
          (
            playState === PLAY_STATE.FINISHED ?
            <p>Finished</p>
            :
            <p>Unkown state</p>
          )
        )
      }
      <button onClick={() => dispatch({ type: "init" })}>Reset</button>
      <label><input type="checkbox" checked={showHints} onChange={e=>setShowHints(e.target.checked)} /> Show Hints</label>
      <div className='App-Container'>
        <Cards windCards={windCardCount} spinnakerCards={spinnakerCardCount} spinnakerActive={player?.spinnakerUp} dispatch={dispatch} />
        <GameBoard
          players={players}
          currentPlayer={currentPlayer}
          windDirection={windDirection}
          highlight={showHints?possibleMoves:[]}
          onClick={(i, j) => dispatch({ type: "move", i, j })}
          />
      </div>
    </div>
  );
}

export default App;


function Cards ({ windCards, spinnakerCards, spinnakerActive, dispatch }) {
  function Card ({ label, onClick = () => void 0, style={} }) {
    return <div style={{ ...style, display: "inline-block", width: 80, height: 40, margin: 5, padding: 10, border: "1px solid rgba(0,0,0,0.7)", boxShadow: "4px 4px 8px rgba(0,0,0,0.3)", cursor: "pointer" }} onClick={onClick}>{label}</div>
  }

  return (
    <div>
    {
      Array.from({ length: windCards }).map((_, i) => <Card key={i} label="WIND" onClick={() => dispatch({ type: "windCard" })} />)
    }
    {
      spinnakerActive && <Card label="SPINNAKER" style={{color:"#F80"}} onClick={() => dispatch({ type: "spinnakerDown" })} />
    }
    {
      Array.from({ length: spinnakerCards }).map((_, i) => <Card key={i} label="SPINNAKER" onClick={() => dispatch({ type: "spinnakerCard" })} />)
    }
    </div>
  );
}

function getDistance (locA, locB) {
  return Math.max(Math.abs(locA[0] - locB[0]), Math.abs(locA[1] - locB[1]));
}

export function getRoute (from, to) {
  const dx = Math.sign(to[0] - from[0]);
  const dy = Math.sign(to[1] - from[1]);
  const out = [];
  let curr = [from[0], from[1]];

  while ((curr[0] !== to[0] || curr[1] !== to[1]) && out.length < 10) {
    curr = [curr[0] + dx, curr[1] + dy];
    out.push(curr);
  }

  return out;
}