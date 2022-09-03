import { COMPASS, getPossibleMoves, isLocationIncluded, startFinishSquare, startSquares } from './game';
import { getRoute } from './App';

export const PLAY_STATE = {
  READY: "READY",
  PLAYING: "PLAYING",
  FINISHED: "FINISHED",
};

/**
 * @param {any} state
 * @param {any} action
 */
export function gameReducer(state, action) {
  if (action.type === "init") {
    return initialGameState;
  }

  if (action.type === "setPlayers" && state.playState === PLAY_STATE.READY) {
    return { ...state, players: makePlayers(action.players), playState: PLAY_STATE.PLAYING };
  }

  if (action.type === "move") {
    const { players, currentPlayer, windDirection } = state;
    const { i, j } = action;
    const player = players[currentPlayer];
    const possibles = getPossibleMoves(player, players, windDirection);

    if (isLocationIncluded(possibles, [i, j])) {
      const route = getRoute(player.location, [i, j]);
      const spinnakerUp = player.spinnakerUp && route.length === 5;

      const started = player.started || (isLocationIncluded(route, startFinishSquare.location) && i < player.location[0]);

      const newFinished = isLocationIncluded(route, startFinishSquare.location) && i > player.location[0];

      const finished = player.finished || newFinished;

      const nextState = {
        ...state,
        players: players.map((p, idx) => idx === currentPlayer ? { ...p, location: [i, j], spinnakerUp, started, finished } : p),
        currentPlayer: (currentPlayer + 1) % players.length,
      };

      // Check if all players are finished
      if (nextState.players.every(p => p.finished)) {
        nextState.playState = PLAY_STATE.FINISHED;
      }
      else {
        // Find next unfinished player
        while (players[nextState.currentPlayer].finished) {
          nextState.currentPlayer = (nextState.currentPlayer + 1) % players.length;
        }
      }

      return nextState;
    }
  }

  if (action.type === "windCard") {
    const { players, currentPlayer, windDirection } = state;
    const player = players[currentPlayer];

    if (player.windCards > 0) {
      return {
        ...state,
        players: players.map((p, i) => i === currentPlayer ? { ...p, windCards: p.windCards - 1 } : p),
        windDirection: (windDirection + 45) % 360,
      };
    }
  }

  if (action.type === "spinnakerCard") {
    const { players, currentPlayer } = state;
    const player = players[currentPlayer];

    if (player.spinnakerCards > 0) {
      return {
        ...state,
        players: players.map((p, i) => i === currentPlayer ? { ...p, spinnakerCards: p.spinnakerCards - 1, spinnakerUp: true } : p),
      };
    }
  }

  if (action.type === "spinnakerDown") {
    const { players, currentPlayer } = state;

    return {
      ...state,
      players: players.map((p, i) => i === currentPlayer ? { ...p, spinnakerUp: false } : p),
    };
  }

  return state;
}

const DEFAULT_WIND_CARDS = 12;
const DEFAULT_SPINNAKER_CARDS = 3;

export const initialGameState = {
  playState: PLAY_STATE.READY,
  currentPlayer: 0,
  players: [],
  windDirection: COMPASS.NW,
};

function makePlayers(playerCount) {
  const boats = [];

  for (let i = 0; i < playerCount; i++) {
    boats.push({
      colour: BOAT_COLOURS[i],
      location: startSquares[i].location,
      windCards: DEFAULT_WIND_CARDS,
      spinnakerCards: DEFAULT_SPINNAKER_CARDS,
      spinnakerUp: false,
      started: false,
      finished: false,
    });
  }

  return boats;
}
export const BOAT_COLOURS = [
  "#F00",
  "#0F0",
  "#00F",
  "#F80",
  "#F08",
  "#08F",
  "#F0F",
];
