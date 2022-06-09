import React, { useEffect, useState } from 'react';
import { board, whiteSquares, initialPiecesLocation } from '../utils/enums';
import { pieceMoveAttempt, checkChecker } from '../utils/gameLogic';
import { io } from 'socket.io-client';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

    const roomIsFullNotif = (roomId) => toast.dark(`Room ${roomId} is full!`);
    const cannotMoveIntoCheckNotif = () =>
        toast.dark("You can't move into check!");
    const winnerNotif = (winnerColor) =>
        toast.dark(`${winnerColor} wins! Resetting game...`);
    const checkmateWinnerNotif = (winnerColor) =>
        toast.dark(`Checkmate! ${winnerColor} wins! Resetting game...`);

    // Get data after an opponent moves
    socket.on('opponentMoved', (data) => {
        if (!myTurn) {
            setPiecesLocation(data.piecesLocationFromOpponent);
            setDefeatedBlackPieces(data.defeatedBlackPiecesFromOpponent);
            setDefeatedWhitePieces(data.defeatedWhitePiecesFromOpponent);
            setPlayerTurn(data.playerTurnFromOpponent);
        }
        setMyTurn(true);
    });

    // If we find a winner, send and recieve that message, reset gameboard
    const winHandler = (winnerColor) => {
        socket.emit('winnerSend', winnerColor);
    };

    socket.on('winnerRecieve', (playerColor) => {
        checkmateWinnerNotif(playerColor);
        setPiecesLocation(initialPiecesLocation);
        setPlayerTurn('white');
        setDefeatedBlackPieces([]);
        setDefeatedWhitePieces([]);
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
            roomIsFullNotif(data.roomId);
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
        roomIsFullNotif();
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

        // Add here the check checker! Can't move into check
        if (
            firstClick !== '' &&
            checkChecker(
                firstClick,
                e.target.value,
                piecesLocation,
                playerTurn
            ) === 'cannot-move-into-check'
        ) {
            cannotMoveIntoCheckNotif();
            return;
        }
        // Valid second click
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
            if (
                firstClick !== '' &&
                checkChecker(
                    firstClick,
                    e.target.value,
                    piecesLocation,
                    'black'
                ) === 'checkmate-white-wins'
            ) {
                winHandler('white');
            }
            if (
                firstClick !== '' &&
                checkChecker(
                    firstClick,
                    e.target.value,
                    piecesLocation,
                    'white'
                ) === 'checkmate-black-wins'
            ) {
                winHandler('black');
            }
            if (piecesLocation[e.target.value] === 'white-king') {
                winnerNotif('Black');
                setPiecesLocation(initialPiecesLocation);
                setPlayerTurn('white');
                setDefeatedBlackPieces([]);
                setDefeatedWhitePieces([]);
            } else if (piecesLocation[e.target.value] === 'black-king') {
                winnerNotif('White');
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
        <div className="board-container">
            {joinedRoom === '' ? (
                <form className="form-container">
                    <h2>Enter your name</h2>
                    <div className="break"></div>
                    <input
                        type="text"
                        id="name-input"
                        className="form-input"
                        placeholder="Your Name..."
                    ></input>
                    <div className="break"></div>
                    <h2>Enter a room to join</h2>
                    <div className="break"></div>
                    <input
                        type="number"
                        id="room-join-input"
                        className="form-input"
                        placeholder="0-99..."
                    ></input>
                    <div className="break"></div>
                    <button
                        className="form-submit-button"
                        onClick={roomSubmitHandler}
                    >
                        Enter Room
                    </button>
                    <ToastContainer />
                </form>
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
                    <ToastContainer />
                </div>
            )}
        </div>
    );
}

export default Gameboard;
