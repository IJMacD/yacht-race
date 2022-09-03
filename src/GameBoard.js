import React from "react";
import { excludedSquares, isLocationIncluded, markers, startFinishSquare, startSquares } from "./game";
import MapBackground from "./MapBackground";

export function GameBoard ({ players, currentPlayer, windDirection, highlight, onClick }) {
    const gridWidth = 43;
    const gridHeight = 32;

    const width = 1103;
    const height = 828.633;

    const offsetX = 38.4;
    const offsetY = 40.082;

    const sqW = width / gridWidth;
    const sqH = height / gridHeight;

    const gridSquares = [];

    for (let i = 0; i < gridWidth; i++) {
        for (let j = 0; j < gridHeight; j++) {
            if (!isLocationIncluded(excludedSquares, [i, j])) {
                gridSquares.push([i,j]);
            }
        }
    }

    function toX (i) {
        return offsetX + i * sqW;
    }

    function toY (j) {
        return offsetY + j * sqH;
    }

    return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          width="1173"
          height="900"
          version="1.1"
          viewBox="0 0 1173 900"
          style={{maxWidth:1000,height:"auto"}}
        >
            <MapBackground />
            <g>
                <g transform={`translate(${toX(startFinishSquare.location[0])} ${toY(startFinishSquare.location[1])})`}>
                    <path d="M -6 -2 L 0 -8 L 6 -2 M 0 -8 V 10" transform={`translate(${-0.5 * sqW} ${-0.5 * sqH}) rotate(135)`} fill="none" stroke="#F44" />
                    <path d="M -6 -2 L 0 -8 L 6 -2 M 0 -8 V 10" transform={`translate(${-0.5 * sqW} ${+0.5 * sqH}) rotate(90)`} fill="none" stroke="#F44" />
                    <path d="M -6 -2 L 0 -8 L 6 -2 M 0 -8 V 10" transform={`translate(${-0.5 * sqW} ${+1.5 * sqH}) rotate(45)`} fill="none" stroke="#F44" />
                    <rect x={0} y={0} width={sqW} height={sqH} fill="#F44" />
                    <path d="M -6 -2 L 0 -8 L 6 -2 M 0 -8 V 10" transform={`translate(${+1.5 * sqW} ${-0.5 * sqH}) rotate(225)`} fill="none" stroke="#F44" />
                    <path d="M -6 -2 L 0 -8 L 6 -2 M 0 -8 V 10" transform={`translate(${+1.5 * sqW} ${+0.5 * sqH}) rotate(270)`} fill="none" stroke="#F44" />
                    <path d="M -6 -2 L 0 -8 L 6 -2 M 0 -8 V 10" transform={`translate(${+1.5 * sqW} ${+1.5 * sqH}) rotate(315)`} fill="none" stroke="#F44" />
                    <text x={0} y={0} transform={`translate(${sqW - 2} ${sqH}) rotate(270)`} fill="#FFF" fontSize={8} fontWeight="bold">START</text>
                    <text x={0} y={0} transform={`translate(2 0) rotate(90)`} fill="#FFF" fontSize={8} fontWeight="bold">FINISH</text>
                </g>
                {
                    startSquares.map(st => <text key={st.label} x={toX((st.location[0] + 0.5))} y={toY((st.location[1] + 0.5))} textAnchor="middle" alignmentBaseline="middle">{st.label}</text>)
                }
                {
                    gridSquares.map(sq => <rect key={`${sq[0]}-${sq[1]}`} x={toX(sq[0])} y={toY(sq[1])} width={sqW} height={sqH} fill={isLocationIncluded(highlight, sq)?"rgba(255,255,0,0.5)":"transparent"} stroke="#000" strokeWidth={1} onClick={() => onClick(sq[0], sq[1])} style={{cursor:isLocationIncluded(highlight, sq)?"pointer":"default"}} /> )
                }
                {
                    markers.map(m => <text key={m.label} x={toX((m.location[0] + 0.5))} y={toY((m.location[1] + 0.5))} textAnchor="middle" alignmentBaseline="middle" fill="#F44" style={{fontWeight: "bold"}}>{m.label}</text>)
                }
                {
                    players.map((p, i) => !p.finished && <ellipse key={p.colour} cx={toX(p.location[0]+0.5)} cy={toY(p.location[1]+0.5)} rx={sqW*0.40} ry={sqH*0.40} fill={i === currentPlayer ? "#FFF" : p.colour} stroke={p.colour} strokeWidth={4} opacity={p.started?1:0.5} />)
                }
                <path d="M -30 -20 L 0 -70 L 30 -20 L 0 -10 Z" fill="#F44" stroke="#822" strokeWidth={4} transform={`translate(500 455) rotate(${windDirection})`} />
            </g>
        </svg>
    );
}
