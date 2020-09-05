const { builtinModules } = require("module");
const fs = require('fs');
const Player = require('./player');

function Game(io) {
	this.io = io;
	this.gameDetails = {
		hasStarted: false,
		hasFinished: false,
		players: [],
		gameLeader: null,
		excerpt: "",
		totalWords: 0
	}

}
  
Game.prototype.join = function join(socket, name) {
	console.log(name, " joined the game.");
	if (!this.gameDetails.hasStarted) {
		this.addPlayer(socket.id, name);
	}
	else {
		this.addSpectator(socket.id, name);
	}
	this.io.emit('playerchange', JSON.stringify(this.gameDetails));
};

Game.prototype.setGameLeader = function setGameLeader(player) {
	if (!!player) {
		this.gameDetails.gameLeader = player.id;
		player.gameLeader = true;
	}
	else {
		this.gameDetails.gameLeader = null;
	}
	console.log("NEW GAME LEADER: ", player);
}

Game.prototype.start = function start() {
	console.log("Game leader started game.");
	fs.readFile("../../excerpts/test.json", (err, data) => {
		this.reset();
		const excerptsArr = JSON.parse(data);
		console.log(excerptsArr.length, " excerpts were located. Selecting a number between 0 and ", excerptsArr.length-1);
		const index = Math.floor(Math.random() * excerptsArr.length);
		console.log("Excerpt ", index, " was selected:");
		this.gameDetails.excerpt = excerptsArr[index].excerpt;
		console.log(this.gameDetails.excerpt);
		this.io.emit('gamestarted', JSON.stringify(this.gameDetails));
		this.gameDetails.hasStarted = true;
		this.gameDetails.totalWords = this.gameDetails.excerpt.match(/\S+/g).length;
		console.log("Passage has ", this.gameDetails.totalWords, " words.");
	});
}

Game.prototype.toggleSpectator = function toggleSpectator(id) {
	const player = this.gameDetails.players.find((element) => element.id === id);
	this.removePlayer(id);
	if (player.spectator) {
		this.addPlayer(id, player.name);
	}
	else {
		this.addSpectator(id, player.name);
	}
	this.io.emit('playerchange', JSON.stringify(this.gameDetails));
}

Game.prototype.addPlayer = function addPlayer(id, name) {
	let player = new Player(id);
	player.name = name;
	if (!this.gameDetails.gameLeader) {
		this.setGameLeader(player);
	}
	this.gameDetails.players.push(player);
	console.log("There are now ", this.gameDetails.players.length, " players in the game.");
}

Game.prototype.removePlayer = function removePlayer(id) {
	const idx = this.gameDetails.players.findIndex((element) => element.id === id);
	this.gameDetails.players.splice(idx, 1);
	if (id === this.gameDetails.gameLeader) {
		const players = this.gameDetails.players.filter((player) => !player.spectator);
		this.setGameLeader(players[0]);
	}
	console.log("Deleted player, ", this.gameDetails.players.length, " players in the game.");
}

Game.prototype.addSpectator = function addSpectator(id, name) {
	let player = new Player(id);
	player.name = name;
	player.spectator = true;
	this.gameDetails.players.push(player);
	console.log(name, " joined the game as a spectator.");
}

Game.prototype.sendMessage = function sendMessage(id, message){
	const player = this.gameDetails.players.find((element) => element.id === id);
	const messageBroadcast = {
		name: player.name,
		content: message.content,
		time: message.time
	}
	console.log("Sending message from", player.name, " with payload of ", message.content);
	this.io.emit('message', messageBroadcast);
}
Game.prototype.update = function update(socket, object) {
	const player = this.gameDetails.players.find((element) => element.id === socket.id);
	if (!!player) {
		player.words = object.words;
		player.time = object.time;
		player.progress = object.words * 100 / this.gameDetails.totalWords;
		player.speed = Math.round(player.words * 60 / player.time);
		if (!player.speed) {
			player.speed = 0;
		}
		console.log("Update: ", player.name, " has ", object.words, " words and ", object.time, " seconds.");
		console.log("Progress: ", player.progress);
	}
	this.io.emit('gameupdate', JSON.stringify(this.gameDetails));
}

Game.prototype.reset = function reset() {
	this.gameDetails.players.forEach((element) => element.reset());
}

Game.prototype.disconnect = function disconnect(socket) {
	let idx = this.gameDetails.players.findIndex((element) => element.id === socket.id);
	let player = this.gameDetails.players[idx];
	const finishPromise = new Promise((resolve) => {
		if (this.gameDetails.hasStarted && !player.finished) {
			resolve(this.playerFinish(socket.id));
		}
	});
	const splicePromise = new Promise((resolve) => {
		console.log(player.name, " left the game. ", this.gameDetails.players.length - 1, " player(s) are still in the game.");
		resolve(this.removePlayer(socket.id));
	});
	finishPromise.then(splicePromise).then(() => {
		socket.disconnect();
		this.io.emit('playerchange', JSON.stringify(this.gameDetails));
	});
}

Game.prototype.playerFinish = function playerFinish(id, object) {
	const player = this.gameDetails.players.find((element) => element.id === id);
	player.finished = true;
	console.log(player.name, " has finished.");
	if (!!object) {
		player.words = object.words;
		player.time = object.time;
	}
	player.speed = Math.round(player.words * 60 / player.time);
	this.io.emit('gameupdate', JSON.stringify(this.gameDetails));
	if (this.gameDetails.players.every((element) => element.spectator || element.finished )) {
		this.io.emit('gamefinished', this.gameDetails.gameLeader);
		this.gameDetails.hasFinished = true;
		this.gameDetails.hasStarted = false;
		console.log("GAME FINISHED!");
		const spectators = this.gameDetails.players.filter((player) => player.spectator);
		if (spectators.length) {
			spectators.map((player) => {
				player.spectator = false;
			});
			this.io.emit('playerchange', JSON.stringify(this.gameDetails));
		}
		
		// if last player leaves, game will never finish..
	}
}
module.exports = Game;