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

// create an array of 100 games and initialize them
const games = Array(100);
for (let i = 0; i < 100; i++) {
    games[i] = { players: 0, playerNumber: ['', ''], playerName: ['', ''] };
}
const root = path.join(__dirname, '../', 'client', 'build');

app.use(express.static(root));

app.get('*', (req, res) => {
    res.sendFile('index.html', { root });
});

io.on('connection', function (socket) {
    var color;
    var playerId = socket.id;

    // when user attempts to join, see if there is space in the room
    // both slots available
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
        console.log(playerId + ' connected to room ' + roomId);
        // both slots available
        if (
            games[roomId].playerNumber[0] === '' &&
            games[roomId].playerNumber[1] === ''
        ) {
            games[roomId].playerNumber[0] = playerId;
            games[roomId].playerName[0] = playerName;
            color = 'white';
            initalRoomJoin(playerId, roomId, color, playerName);
            // first slot available
        } else if (
            games[roomId].playerNumber[0] === '' &&
            games[roomId].playerNumber[1] !== ''
        ) {
            games[roomId].playerNumber[0] = playerId;
            games[roomId].playerName[0] = playerName;
            color = 'white';
            initalRoomJoin(playerId, roomId, color, playerName);
            // second slot available
        } else if (
            games[roomId].playerNumber[0] !== '' &&
            games[roomId].playerNumber[1] === ''
        ) {
            games[roomId].playerNumber[1] = playerId;
            games[roomId].playerName[1] = playerName;
            color = 'black';
            initalRoomJoin(playerId, roomId, color, playerName);
            // neither slot available
        } else if (
            games[roomId].playerNumber[0] !== '' &&
            games[roomId].playerNumber[1] !== ''
        ) {
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

            socket.broadcast.emit('opponentMoved', {
                piecesLocationFromOpponent,
                defeatedBlackPiecesFromOpponent,
                defeatedWhitePiecesFromOpponent,
                playerTurnFromOpponent,
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
        });
    });
});

server.listen(port, () => {
    console.log(`Server listening on ${port}`);
});
