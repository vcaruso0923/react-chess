import React, { useEffect, useState } from 'react';
import { board, whiteSquares, initialPiecesLocation } from '../utils/enums';
import { pieceMoveAttempt } from '../utils/gameLogic';
import { io } from 'socket.io-client';

const socket = io();

function Gameboard() {
    const [firstClick, setFirstClick] = useState('');
    const [secondClick, setSecondClick] = useState('');
    const [piecesLocation, setPiecesLocation] = useState(initialPiecesLocation);
    const [playerTurn, setPlayerTurn] = useState('white');
    const [defeatedWhitePieces, setDefeatedWhitePieces] = useState([]);
    const [defeatedBlackPieces, setDefeatedBlackPieces] = useState([]);
    const [joinedRoom, setJoinedRoom] = useState('');
    const [playerColor, setPlayerColor] = useState('');
    const [myTurn, setMyTurn] = useState(false);

    socket.on('opponentMoved', (data) => {
        if (!myTurn) {
            setPiecesLocation(data.piecesLocationFromOpponent);
            setDefeatedBlackPieces(data.defeatedBlackPiecesFromOpponent);
            setDefeatedWhitePieces(data.defeatedWhitePiecesFromOpponent);
            setPlayerTurn(data.playerTurnFromOpponent);
        }
        setMyTurn(true);
    });

    const roomSubmitHandler = (e) => {
        e.preventDefault();
        // ask the server if the room has space for player, and get your playerID
        socket.emit(
            'joinAttempt',
            Number(document.getElementById('room-join-input').value)
        );

        // if successful, set the roomID and playerColor - otherwise show some error
        socket.on('joinSuccess', function (data) {
            setPlayerColor(data.color);
            setJoinedRoom(data.roomId);
            if (data.color === 'white') {
                setMyTurn(true);
            }
        });

        socket.on('joinFailure', function (data) {
            window.alert(`Room ${data.roomId} is full!`);
        });
    };

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
        // variables to send to socket (can't wait for state update)
        let piecesLocationToSend;
        let defeatedBlackPiecesToSend = defeatedBlackPieces
            ? defeatedBlackPieces
            : [];
        let defeatedWhitePiecesToSend = defeatedWhitePieces
            ? defeatedWhitePieces
            : [];
        let playerTurnToSend = '';

        // Valid second click:
        if (pieceMoveAttempt(firstClick, e.target.value, piecesLocation)) {
            setSecondClick(e.target.value);

            // Add defeated pieces to appropriate defeated piece arrays
            if (piecesLocation[e.target.value].includes('white')) {
                defeatedWhitePiecesToSend.push(piecesLocation[e.target.value]);
                defeatedBlackPiecesToSend = defeatedBlackPieces;
                setDefeatedWhitePieces((defeatedWhitePieces) => [
                    ...defeatedWhitePieces,
                    piecesLocation[e.target.value],
                ]);
            } else if (piecesLocation[e.target.value].includes('black')) {
                defeatedBlackPiecesToSend.push(piecesLocation[e.target.value]);
                defeatedWhitePiecesToSend = defeatedWhitePieces;
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
                firstClickInitialClass = 'white-queen';
            }

            let newLocations = {
                [firstClick]: 'empty-square',
                [e.target.value]: firstClickInitialClass,
            };

            piecesLocationToSend = {
                ...piecesLocation,
                ...newLocations,
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
                playerTurnToSend = 'black';
                setPlayerTurn('black');
            } else {
                playerTurnToSend = 'white';
                setPlayerTurn('white');
            }

            if (myTurn) {
                socket.emit('successfulMove', {
                    piecesLocationToSend,
                    defeatedBlackPiecesToSend,
                    defeatedWhitePiecesToSend,
                    playerTurnToSend,
                });
                setMyTurn(false);
            }

            // Check for winner
            if (piecesLocation[e.target.value] === 'white-king') {
                alert('Black Wins! Resetting game...');
                setPiecesLocation(initialPiecesLocation);
                setPlayerTurn('white');
                setDefeatedBlackPieces([]);
                setDefeatedWhitePieces([]);
            } else if (piecesLocation[e.target.value] === 'black-king') {
                alert('White Wins! Resetting game...');
                setPiecesLocation(initialPiecesLocation);
                setPlayerTurn('white');
                setDefeatedBlackPieces([]);
                setDefeatedWhitePieces([]);
            }
            //add socket.emit for game win
        } else {
            if (
                firstClick === '' &&
                piecesLocation[e.target.value].includes(playerTurn) &&
                playerColor === playerTurn
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
        <div className="app-container">
            {joinedRoom === '' ? (
                <div className="form-container">
                    <form>
                        <p>Enter which room to join (1-99)</p>
                        <input type="number" id="room-join-input"></input>
                        <button onClick={roomSubmitHandler}>Enter Room</button>
                    </form>
                </div>
            ) : (
                <div className="board-container">
                    <div className="player-1-container player-container">
                        <h2
                            className={
                                playerTurn === 'white' ? 'active-player' : ''
                            }
                        >
                            Player One{playerTurn === 'white' ? "'s Turn" : ''}
                        </h2>
                        <div className="defeated-pieces">
                            {defeatedBlackPieces !== [] && defeatedBlackPieces
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
                        <h2
                            className={
                                playerTurn === 'black' ? 'active-player' : ''
                            }
                        >
                            Player Two{playerTurn === 'black' ? "'s Turn" : ''}
                        </h2>
                        <div className="defeated-pieces">
                            {defeatedWhitePieces !== [] && defeatedWhitePieces
                                ? defeatedWhitePieces.map((piece) => (
                                      <div className={piece}> </div>
                                  ))
                                : ''}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Gameboard;
