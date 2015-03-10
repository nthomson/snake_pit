var Pool = function(){};



Pool.prototype = {
  queue: [],
  _update: function(){},

  addPlayer: function(player, socket, data){
    player.name = player.name || data.name;

    // Send the player their ID
    socket.emit('id', player.id)

    this.queue.push(player);

    // Update everyone on the new pool state
    this._update();
  },

  removePlayer: function(player, socket) {
    this.queue = this.queue.filter(function(p) { return p.id !== player.id; });

    this._update();
  },

  on: function(e, callback){
    this['_'+e] = callback;
  }
}


module.exports = Pool;
