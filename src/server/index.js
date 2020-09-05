const server = require('./server');
const Game = require('./game');

const game = new Game(server.io);

server.io.on('connection', (socket) => {
    console.log("connecting ", socket.id);
    socket.on('join', (name) => {
        game.join(socket, name);
    });

    socket.on('startgame', () => {
        game.start();
    });

    socket.on('disconnect', () => {
        console.log("DISCONNECTING ", socket.id);
        game.disconnect(socket);
    });

    socket.on('update',  (object) => {
        game.update(socket, object);
    });

    socket.on('playerfinish', (object) => {
        game.playerFinish(socket.id, object);
    });

    socket.on('togglespectator', () => {
        game.toggleSpectator(socket.id);
    })

    socket.on('message', (message) => {
        game.sendMessage(socket.id, message);
    })


});
