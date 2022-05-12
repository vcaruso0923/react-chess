import React, { useEffect, useState } from 'react';
import { board, whiteSquares, initialPiecesLocation } from '../utils/enums';
import { pieceMoveAttempt } from '../utils/gameLogic';

function Gameboard() {
    const [firstClick, setFirstClick] = useState('');
    const [secondClick, setSecondClick] = useState('');
    const [piecesLocation, setPiecesLocation] = useState(initialPiecesLocation);
    const [playerTurn, setPlayerTurn] = useState('white');
    const [defeatedWhitePieces, setDefeatedWhitePieces] = useState([]);
    const [defeatedBlackPieces, setDefeatedBlackPieces] = useState([]);

    const boardSquareClasses = (item) => {
        let classesString = 'board-square ';
        if (whiteSquares.includes(item)) {
            classesString += 'white-board-square ';
        } else {
            classesString += 'black-board-square ';
        }

        classesString += piecesLocation[item];
        return classesString;
    };

    useEffect(() => {
        console.log(piecesLocation);
    }, [piecesLocation]);

    const boardClickHandler = (e) => {
        e.preventDefault();

        // Valid second click:
        if (pieceMoveAttempt(firstClick, e.target.value, piecesLocation)) {
            setSecondClick(e.target.value);

            // Add defeated pieces to appropriate defeated piece arrays
            if (piecesLocation[e.target.value].includes('white')) {
                setDefeatedWhitePieces((defeatedWhitePieces) => [
                    ...defeatedWhitePieces,
                    piecesLocation[e.target.value],
                ]);
            } else if (piecesLocation[e.target.value].includes('black')) {
                setDefeatedBlackPieces((defeatedBlackPieces) => [
                    ...defeatedBlackPieces,
                    piecesLocation[e.target.value],
                ]);
            }

            // Empty pieces origin square and move it to destination
            let firstClickInitialClass = piecesLocation[firstClick];
            // Pawn to queen for black
            if (
                piecesLocation[firstClick].includes('pawn') &&
                parseInt(e.target.value.slice(-1)) === 1
            ) {
                firstClickInitialClass = 'black-queen';
            }
            // Pawn to queen for white
            if (
                piecesLocation[firstClick].includes('pawn') &&
                parseInt(e.target.value.slice(-1)) === 8
            ) {
                firstClickInitialClass = 'black-queen';
            }

            let newLocations = {
                [firstClick]: 'empty-square',
                [e.target.value]: firstClickInitialClass,
            };
            setPiecesLocation({
                ...piecesLocation,
                ...newLocations,
            });
            document
                .getElementById(firstClick)
                .classList.remove('first-piece-selection');

            // Switch turns
            setFirstClick('');
            if (playerTurn === 'white') {
                setPlayerTurn('black');
            } else {
                setPlayerTurn('white');
            }

            // Check for winner
            if (piecesLocation[e.target.value] === 'white-king') {
                alert('Black Wins! Resetting game...');
                setPiecesLocation(initialPiecesLocation);
                setPlayerTurn('white');
            } else if (piecesLocation[e.target.value] === 'black-king') {
                alert('White Wins! Resetting game...');
                setPiecesLocation(initialPiecesLocation);
                setPlayerTurn('white');
            }
        } else {
            if (
                firstClick === '' &&
                piecesLocation[e.target.value].includes(playerTurn)
            ) {
                document
                    .getElementById(e.target.value)
                    .classList.add('first-piece-selection');
                setFirstClick(e.target.value);
            } else if (firstClick === e.target.value) {
                document
                    .getElementById(e.target.value)
                    .classList.remove('first-piece-selection');
                setFirstClick('');
            }
        }
    };

    return (
        <div className="board-container">
            <div className="player-1-container player-container">
                <h2 className={playerTurn === 'white' ? 'active-player' : ''}>
                    Player One{playerTurn === 'white' ? "'s Turn" : ''}
                </h2>
                <div className="defeated-pieces">
                    {defeatedBlackPieces !== []
                        ? defeatedBlackPieces.map((piece) => (
                              <div className={piece}> </div>
                          ))
                        : ''}
                </div>
            </div>
            <div className="chess-board">
                {board.map((row) =>
                    row.map((item) => (
                        <button
                            onClick={boardClickHandler}
                            className={boardSquareClasses(item)}
                            value={item}
                            id={item}
                        ></button>
                    ))
                )}
            </div>
            <div className="player-2-containter player-container">
                <h2 className={playerTurn === 'black' ? 'active-player' : ''}>
                    Player Two{playerTurn === 'black' ? "'s Turn" : ''}
                </h2>
                <div className="defeated-pieces">
                    {defeatedWhitePieces !== []
                        ? defeatedWhitePieces.map((piece) => (
                              <div className={piece}> </div>
                          ))
                        : ''}
                </div>
            </div>
        </div>
    );
}

export default Gameboard;
