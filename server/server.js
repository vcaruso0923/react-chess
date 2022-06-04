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
    games[i] = { players: 0, pid: [0, 0] };
}

app.use(express.static(path.join(__dirname, '../client/build')));

app.get('*', (req, res) => {
    res.sendFile('../client/build/index.html', { root });
});

app.listen(port, () => {
    console.log(`Server listening on ${port}`);
});
