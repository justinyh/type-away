function Player(id) {
    this.id = id;
    this.gameLeader = false;
    this.name = null;
    this.words = 0;
    this.time = 0;
    this.finished = false;
    this.speed = 0;
    this.progress = 0;
    this.spectator = false;
}

Player.prototype.reset= function reset() {
    this.words = 0;
    this.time = 0;
    this.speed = 0;
    this.finished = false;
    this.progress = 0;
}



module.exports = Player;