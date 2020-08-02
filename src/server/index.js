const server = require('./server');
const Game = require('./game');

const game = new Game(server.io);

server.io.on('connection', (socket) => {

    socket.send('hello');
    socket.on('join', (name) => {
        game.join(socket, name);
    });

    socket.on('startgame', () => {
        game.start();
    });

    socket.on('disconnect', () => {
        game.disconnect(socket);
    });

    socket.on('update',  (object) => {
        game.update(socket, object);
    })

});
