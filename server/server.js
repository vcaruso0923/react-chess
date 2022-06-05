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
    games[i] = { players: 0, playerNumber: [0, 0] };
}
const root = path.join(__dirname, '../', 'client', 'build');

app.use(express.static(root));

app.get('*', (req, res) => {
    res.sendFile('index.html', { root });
});

io.on('connection', function (socket) {
    var color;
    var playerId = Math.floor(Math.random() * 100 + 1);

    console.log(playerId + ' connected');

    socket.on('joinAttempt', function (roomId) {
        // when user attempts to join, see if there is space in the room
        // both slots available
        if (
            games[roomId].playerNumber[0] === 0 &&
            games[roomId].playerNumber[1] === 0
        ) {
            games[roomId].playerNumber[0] = playerId;
            color = 'white';
            socket.emit('joinSuccess', {
                playerId,
                roomId,
                color,
            });
            // first slot available
        } else if (
            games[roomId].playerNumber[0] === 0 &&
            games[roomId].playerNumber[1] !== 0
        ) {
            games[roomId].playerNumber[0] = playerId;
            color = 'white';
            socket.emit('joinSuccess', {
                playerId,
                roomId,
                color,
            });
            // second slot available
        } else if (
            games[roomId].playerNumber[0] !== 0 &&
            games[roomId].playerNumber[1] === 0
        ) {
            games[roomId].playerNumber[1] = playerId;
            color = 'black';
            socket.emit('joinSuccess', {
                playerId,
                roomId,
                color,
            });
            // neither slot available
        } else if (
            games[roomId].playerNumber[0] !== 0 &&
            games[roomId].playerNumber[1] !== 0
        ) {
            socket.emit('joinFailure', {
                roomId,
                playerId,
            });
        }
    });
});

server.listen(port, () => {
    console.log(`Server listening on ${port}`);
});
