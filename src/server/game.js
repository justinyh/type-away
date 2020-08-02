const { builtinModules } = require("module");
const fs = require('fs');
const Player = require('./player');

function Game(io) {
	this.io = io;
	this.players = [];
	this.cash = [];
	this.gameMaster = null;
  
	this.awayStep = 7;
	this.timer = 5000;

}
  
Game.prototype.join = function join(socket, name) {
	console.log(name, " joined the game.");
	this.addPlayer(socket.id, name);
};

Game.prototype.update = function update() {
}

Game.prototype.start = function start() {
	fs.readFile("../../excerpts/test.txt", (err, data) => {
		this.io.emit('start', data.toString());
	});
}

Game.prototype.addPlayer = function addPlayer(id, name) {
	let player = new Player(id);
	player.name = name;
	this.players.push(player);
	console.log("There are now ", this.players.length, " players in the game.");
	this.io.emit('playerchange', JSON.stringify(this.players));
}

Game.prototype.update = function update(socket, object) {
	const player = this.players.find((element) => element.id === socket.id);
	if (!!player) {
		console.log("Update: ", player.name, " has ", object.words, " words and ", object.time, " seconds.");
	}
}

Game.prototype.disconnect = function disconnect(socket) {
	const player = this.players.find((element) => element.id === socket.id);
	const idx = this.players.findIndex((element) => element.id === socket.id);
	this.players.splice(idx, 1);
	console.log(player.name, " left the game. ", this.players.length, " player(s) are still in the game.");
	this.io.emit('playerchange', JSON.stringify(this.players));
}
module.exports = Game;