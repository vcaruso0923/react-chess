import React, {useEffect, useState} from 'react'
import {board, whiteSquares, initialPiecesLocation} from '../utils/enums'
import {pieceMoveAttempt, checkChecker} from '../utils/gameLogic'
import {io} from 'socket.io-client'
import {ToastContainer, toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const socket = io()

function Gameboard() {
    const [firstClick, setFirstClick] = useState('')
    const [secondClick, setSecondClick] = useState('')
    const [piecesLocation, setPiecesLocation] = useState(initialPiecesLocation)
    const [playerTurn, setPlayerTurn] = useState('white')
    const [defeatedWhitePieces, setDefeatedWhitePieces] = useState([])
    const [defeatedBlackPieces, setDefeatedBlackPieces] = useState([])
    const [joinedRoom, setJoinedRoom] = useState('')
    const [playerColor, setPlayerColor] = useState('')
    const [myTurn, setMyTurn] = useState(false)
    const [playerId, setPlayerId] = useState('')
    const [playerName, setPlayerName] = useState('')
    const [whitePlayerName, setWhitePlayerName] = useState('')
    const [blackPlayerName, setBlackPlayerName] = useState('')
    const [movesHistory, setMovesHistory] = useState([])

    // Toast messages
    const roomIsFullNotif = roomId => toast.dark(`Room ${roomId} is full!`)
    const cannotMoveIntoCheckNotif = () => toast.dark("You can't move into check!")
    const winnerNotif = winnerColor => toast.dark(`${winnerColor} wins! Resetting game...`)
    const checkmateWinnerNotif = winnerColor => toast.dark(`Checkmate! ${winnerColor} wins! Resetting game...`)
    const resetNotif = () => toast.dark(`Resetting the game...`)
    const invalidForm = () => toast.dark(`You must enter a name and room!`)
    const opponentDisconnectNotif = () => toast.dark(`Opponent disconnected! Resetting game...`)

    const resetHandler = () => {
        setPiecesLocation(initialPiecesLocation)
        setPlayerTurn('white')
        setDefeatedBlackPieces([])
        setDefeatedWhitePieces([])
        setMovesHistory([])
    }

    // Get room data including player names
    socket.on('roomsObjectFromServer', roomData => {
        if (
            (whitePlayerName && roomData.roomObj.playerOneName === '') ||
            (blackPlayerName && roomData.roomObj.playerTwoName === '')
        ) {
            opponentDisconnectNotif()
            resetHandler()
        }
        setWhitePlayerName(roomData.roomObj.playerOneName)
        setBlackPlayerName(roomData.roomObj.playerTwoName)
    })

    // Get data after an opponent moves
    socket.on('opponentMoved', data => {
        if (!myTurn) {
            setPiecesLocation(data.piecesLocationFromOpponent)
            setDefeatedBlackPieces(data.defeatedBlackPiecesFromOpponent)
            setDefeatedWhitePieces(data.defeatedWhitePiecesFromOpponent)
            setPlayerTurn(data.playerTurnFromOpponent)
            setMovesHistory(data.movesHistoryFromOpponent)
        }
        setMyTurn(true)
    })

    // If we find a winner, send and recieve that message, reset gameboard
    const winHandler = winnerColor => {
        socket.emit('winnerSend', winnerColor)
    }

    socket.on('winnerRecieve', playerColor => {
        checkmateWinnerNotif(playerColor.winnerColor)
        resetHandler()
    })

    const onReset = playerName => {
        if (window.confirm('Are you sure you want to reset the game?') === true) {
            socket.emit('resetSend')
            resetNotif()
            resetHandler()
        }
    }

    socket.on('resetRecieve', () => {
        resetNotif()
        resetHandler()
    })

    const roomSubmitHandler = e => {
        e.preventDefault()
        if (
            document.getElementById('room-join-input').value.toString().trim().toLowerCase() === '' ||
            document.getElementById('name-input').value === ''
        ) {
            return invalidForm()
        }
        // ask the server if the room has space for player, and get your playerID
        socket.emit(
            'joinAttempt',
            document.getElementById('room-join-input').value.toString().trim().toLowerCase(),
            document.getElementById('name-input').value
        )

        setPlayerName(document.getElementById('name-input').value)

        // if successful, set the roomID and playerColor - otherwise show some error
        socket.on('joinSuccess', function (data) {
            setPlayerColor(data.color)
            setJoinedRoom(data.roomId)
            setPlayerId(data.playerId)
            if (data.color === 'white') {
                setMyTurn(true)
            }
        })

        socket.on('joinFailure', function (data) {
            roomIsFullNotif(data.roomId)
        })
    }

    const boardSquareClasses = item => {
        let classesString = 'board-square '
        if (whiteSquares.includes(item)) {
            classesString += 'white-board-square '
        } else {
            classesString += 'black-board-square '
        }

        classesString += piecesLocation[item]
        return classesString
    }

    const boardClickHandler = e => {
        e.preventDefault()
        // variables to send to socket (can't wait for state update)
        let piecesLocationToSend
        let defeatedBlackPiecesToSend = defeatedBlackPieces ? defeatedBlackPieces : []
        let defeatedWhitePiecesToSend = defeatedWhitePieces ? defeatedWhitePieces : []
        let playerTurnToSend = ''

        // Add here the check checker! Can't move into check
        if (
            firstClick !== '' &&
            checkChecker(firstClick, e.target.value, piecesLocation, playerTurn) === 'cannot-move-into-check'
        ) {
            cannotMoveIntoCheckNotif()
            return
        }

        // Valid second click
        if (pieceMoveAttempt(firstClick, e.target.value, piecesLocation)) {
            setSecondClick(e.target.value)

            // Add move to move history
            const newMove =
                piecesLocation[firstClick].replace('black-', '').replace('white-', '').charAt(0).toUpperCase() === 'P'
                    ? e.target.value
                    : piecesLocation[firstClick].replace('black-', '').replace('white-', '').charAt(0).toUpperCase()
            const newMoveColor = piecesLocation[firstClick].includes('white') ? 'white' : 'black'
            const newMoveObject = {move: newMove, color: newMoveColor}
            const movesHistoryToSend = [newMoveObject, ...movesHistory]
            setMovesHistory([newMoveObject, ...movesHistory])

            // Add defeated pieces to appropriate defeated piece arrays
            if (piecesLocation[e.target.value].includes('white')) {
                defeatedWhitePiecesToSend.push(piecesLocation[e.target.value])
                defeatedBlackPiecesToSend = defeatedBlackPieces
                // setDefeatedWhitePieces((defeatedWhitePieces) => [
                //     ...defeatedWhitePieces,
                //     piecesLocation[e.target.value],
                // ]);
            } else if (piecesLocation[e.target.value].includes('black')) {
                defeatedBlackPiecesToSend.push(piecesLocation[e.target.value])
                defeatedWhitePiecesToSend = defeatedWhitePieces
                // setDefeatedBlackPieces((defeatedBlackPieces) => [
                //     ...defeatedBlackPieces,
                //     piecesLocation[e.target.value],
                // ]);
            }

            // Empty pieces origin square and move it to destination
            let firstClickInitialClass = piecesLocation[firstClick]
            // Pawn to queen for black
            if (piecesLocation[firstClick].includes('pawn') && parseInt(e.target.value.slice(-1)) === 1) {
                firstClickInitialClass = 'black-queen'
            }
            // Pawn to queen for white
            if (piecesLocation[firstClick].includes('pawn') && parseInt(e.target.value.slice(-1)) === 8) {
                firstClickInitialClass = 'white-queen'
            }

            let newLocations = {
                [firstClick]: 'empty-square',
                [e.target.value]: firstClickInitialClass
            }

            piecesLocationToSend = {
                ...piecesLocation,
                ...newLocations
            }

            setPiecesLocation({
                ...piecesLocation,
                ...newLocations
            })
            document.getElementById(firstClick).classList.remove('first-piece-selection')

            // Switch turns
            setFirstClick('')
            if (playerTurn === 'white') {
                playerTurnToSend = 'black'
                setPlayerTurn('black')
            } else {
                playerTurnToSend = 'white'
                setPlayerTurn('white')
            }

            if (myTurn) {
                socket.emit('successfulMove', {
                    piecesLocationToSend,
                    defeatedBlackPiecesToSend,
                    defeatedWhitePiecesToSend,
                    playerTurnToSend,
                    movesHistoryToSend
                })
                setMyTurn(false)
            }

            // Check for winner
            if (
                firstClick !== '' &&
                checkChecker(firstClick, e.target.value, piecesLocation, 'black') === 'checkmate-white-wins'
            ) {
                winHandler('White')
            }
            if (
                firstClick !== '' &&
                checkChecker(firstClick, e.target.value, piecesLocation, 'white') === 'checkmate-black-wins'
            ) {
                winHandler('Black')
            }
            if (piecesLocation[e.target.value] === 'white-king') {
                winHandler('Black')
                resetHandler()
                winnerNotif('Black')
            } else if (piecesLocation[e.target.value] === 'black-king') {
                winHandler('White')
                resetHandler()
                winnerNotif('White')
            }
        } else {
            if (
                firstClick === '' &&
                piecesLocation[e.target.value].includes(playerTurn) &&
                playerColor === playerTurn
            ) {
                document.getElementById(e.target.value).classList.add('first-piece-selection')
                setFirstClick(e.target.value)
            } else if (firstClick === e.target.value) {
                document.getElementById(e.target.value).classList.remove('first-piece-selection')
                setFirstClick('')
            }
        }
    }

    // If player wants to disconnect, we have to remove them from the room - if the room is empty, we have to destroy it
    const onDisconnect = () => {
        if (window.confirm('Are you sure you want to disconnect?') === true) {
            socket.emit('forceDisconnect', playerId, joinedRoom)
            window.location.reload()
        }
    }

    return (
        <div className='page-container'>
            {joinedRoom === '' ? (
                <form className='form-container'>
                    <h1 className='form-title'>React Chess</h1>
                    <h2 className='form-prompt'>Enter your name:</h2>
                    <div className='break'></div>
                    <input type='text' id='name-input' className='form-input' placeholder='Your name...'></input>
                    <div className='break'></div>
                    <h2 className='form-prompt'>Enter a room to join:</h2>
                    <div className='break'></div>
                    <input
                        type='text'
                        id='room-join-input'
                        className='form-input'
                        placeholder='Room to join...'
                    ></input>
                    <div className='break'></div>
                    <button className='form-submit-button' onClick={roomSubmitHandler}>
                        Enter Room
                    </button>
                    <ToastContainer autoClose={5000} pauseOnFocusLoss={false} pauseOnHover={false} />
                </form>
            ) : (
                <div className='board-container'>
                    <div className='player-1-container player-container'>
                        <div className='defeated-pieces'>
                            {!!defeatedBlackPieces && defeatedBlackPieces
                                ? defeatedBlackPieces.map((piece, index) => (
                                      <div className={piece} key={piece + index}>
                                          {' '}
                                      </div>
                                  ))
                                : ''}
                        </div>
                        <h2 className={playerTurn === 'white' ? 'active-player' : ''}>
                            {whitePlayerName === '' ? 'Waiting for opponent...' : whitePlayerName}
                            {playerTurn === 'white' && whitePlayerName !== '' ? "'s Turn - (White)" : ' - (White)'}
                        </h2>
                    </div>
                    <div className='chess-board'>
                        {board.map(row =>
                            row.map((item, index) => (
                                <button
                                    onClick={boardClickHandler}
                                    className={boardSquareClasses(item)}
                                    value={item}
                                    id={item}
                                    disabled={whitePlayerName === '' || blackPlayerName === ''}
                                    key={item + index}
                                ></button>
                            ))
                        )}
                    </div>
                    <div className='player-2-containter player-container'>
                        <h2 className={playerTurn === 'black' ? 'active-player' : ''}>
                            {blackPlayerName === '' ? 'Waiting for opponent...' : blackPlayerName}
                            {playerTurn === 'black' && blackPlayerName !== '' ? "'s Turn - (Black)" : ' - (Black)'}
                        </h2>
                        <div className='defeated-pieces'>
                            {!!defeatedWhitePieces
                                ? defeatedWhitePieces.map((piece, index) => (
                                      <div className={piece} key={piece + index}>
                                          {' '}
                                      </div>
                                  ))
                                : ''}
                        </div>
                    </div>
                    <div className='board-controls'>
                        <button className='board-control-button' onClick={onDisconnect}>
                            Disconnect
                        </button>
                        <button className='board-control-button' onClick={onReset}>
                            Reset
                        </button>
                    </div>
                    <ToastContainer autoClose={5000} pauseOnFocusLoss={false} pauseOnHover={false} />
                </div>
            )}
        </div>
    )
}

export default Gameboard
