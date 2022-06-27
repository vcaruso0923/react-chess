const express = require('express');
const http = require('http');
const socket = require('socket.io');
const path = require('path');

const port = process.env.PORT || 3001;

var app = express();

// start the server
const server = http.createServer(app);

// initialize a new instance of socket.io by passing the HTTP server object
const io = socket(server);

// keep track of how many players in a game (0, 1, 2)
let players;

// Data is stored in this object in this format:
// roomId: { playerOneName: 'John Smith', playerTwoName: 'Bob Joe' },
const roomsDataObj = {};
// Hey future VInce. Create an array within the obj????!!?!?!?!?!?!!?!?!?!
// roomsDataObj[roomId] = {
//     'playerOneName': [playerOneName],
//     'playerOneId': [playerOneId],
//     'playerTwoName': [playerTwoName],
//     'playerTwoId': [playerTwoId],
// };

const root = path.join(__dirname, '../', 'client', 'build');

app.use(express.static(root));

app.get('*', (req, res) => {
    res.sendFile('index.html', { root });
});

io.on('connection', function (socket) {
    var color;
    var playerId = socket.id;

    // when user attempts to join, see if there is space in the room
    socket.on('joinAttempt', function (roomId, playerName) {
        const initalRoomJoin = (playerId, roomId, color) => {
            socket.join(roomId);
            socket.emit('joinSuccess', {
                playerId,
                roomId,
                color,
                playerName,
            });
        };
        const broadcastRoomObject = (roomObj) => {
            io.to(roomId).emit('roomsObjectFromServer', {
                roomObj,
            });
        };
        console.log(playerId + ' connected to room ' + roomId);

        // Both slots available
        if (!roomsDataObj.hasOwnProperty(roomId)) {
            roomsDataObj[roomId] = {
                playerOneName: playerName,
                playerOneId: playerId,
                playerTwoName: '',
                playerTwoId: '',
            };
            color = 'white';
            initalRoomJoin(playerId, roomId, color, playerName);
            broadcastRoomObject(roomsDataObj[roomId]);
        }
        // first slot available
        else if (roomsDataObj[roomId]?.playerOneName === '') {
            roomsDataObj[roomId].playerOneName = playerName;
            roomsDataObj[roomId].playerOneId = playerId;
            color = 'white';
            initalRoomJoin(playerId, roomId, color, playerName);
            broadcastRoomObject(roomsDataObj[roomId]);
        }
        // second slot available
        else if (roomsDataObj[roomId]?.playerTwoName === '') {
            roomsDataObj[roomId].playerTwoName = playerName;
            roomsDataObj[roomId].playerTwoId = playerId;
            color = 'black';
            initalRoomJoin(playerId, roomId, color, playerName);
            broadcastRoomObject(roomsDataObj[roomId]);
        }
        // No slots available
        else {
            socket.emit('joinFailure', {
                roomId,
                playerId,
            });
        }

        // Send the board data to opponent on a successful move event
        socket.on('successfulMove', function (data) {
            let piecesLocationFromOpponent = data.piecesLocationToSend;
            let defeatedBlackPiecesFromOpponent =
                data.defeatedBlackPiecesToSend;
            let defeatedWhitePiecesFromOpponent =
                data.defeatedWhitePiecesToSend;
            let playerTurnFromOpponent = data.playerTurnToSend;
            let movesHistoryFromOpponent = data.movesHistoryToSend;

            socket.broadcast.emit('opponentMoved', {
                piecesLocationFromOpponent,
                defeatedBlackPiecesFromOpponent,
                defeatedWhitePiecesFromOpponent,
                playerTurnFromOpponent,
                movesHistoryFromOpponent,
            });
        });

        // Tell both players that a winner has been found
        socket.on('winnerSend', function (winnerColor) {
            socket.broadcast.emit('winnerRecieve', {
                winnerColor,
            });
        });

        // Tell both players that one of them reset the game
        socket.on('resetSend', function () {
            socket.broadcast.emit('resetRecieve');
        });

        socket.on('forceDisconnect', function (playerId, roomId) {
            socket.disconnect();
        });

        socket.on('disconnect', function () {
            console.log(playerId + ' disconnected from room ' + roomId);
            // Remove players or rooms as needed from roomsDataObj on disconnect
            if (playerId === roomsDataObj[roomId].playerOneId) {
                roomsDataObj[roomId].playerOneName = '';
                roomsDataObj[roomId].playerOneId = '';
                broadcastRoomObject(roomsDataObj[roomId]);
            } else if (playerId === roomsDataObj[roomId].playerTwoId) {
                roomsDataObj[roomId].playerTwoName = '';
                roomsDataObj[roomId].playerTwoId = '';
                broadcastRoomObject(roomsDataObj[roomId]);
            }

            if (
                roomsDataObj[roomId].playerTwoId === '' &&
                roomsDataObj[roomId].playerOneId === ''
            ) {
                delete roomsDataObj[roomId];
            }
        });
    });
});

server.listen(port, () => {
    console.log(`Server listening on ${port}`);
});
